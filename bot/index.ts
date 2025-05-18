import { Client, GatewayIntentBits, AttachmentBuilder } from 'discord.js';
import { config } from 'dotenv';
import { prisma } from '../lib/prisma';
import path from 'path';

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot ready as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!help')) {
    message.reply('Commands: !share <subject> <link>, !sharefile <subject> + attach one or more files');
    return;
  }
  console.log(message)
  if (message.content.startsWith('!share ')) {
    const parts = message.content.split(' ');
    const [, subject, link] = parts;

    if (!subject || !link) {
      message.reply('Usage: !share <subject> <link>');
      return;
    }

    await prisma.resource.create({
      data: {
        subject,
        link,
        uploader: message.author.username,
      },
    });

    message.reply('Resource shared successfully!');
  }


  else if (message.content.startsWith('!sharefile ')) {
    const parts = message.content.split(' ');
    const [, subject] = parts;

    if (!subject) {
      message.reply('Usage: !sharefile <subject> + attach one or more files');
      return;
    }

    if (message.attachments.size === 0) {
      message.reply('Please attach one or more files to share.');
      return;
    }

    for (const attachment of message.attachments.values()) {
      await prisma.resource.create({
        data: {
          subject,
          link: attachment.url,
          uploader: message.author.username,
        },
      });
    }

    message.reply(`Successfully shared ${message.attachments.size} file(s) under subject "${subject}"!`);
  }
});


client.login(process.env.DISCORD_TOKEN);
