import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { prisma } from '../lib/prisma';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Bot ready as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(' ');
  const command = args[0];

  if (command === '!help') {
    message.reply(
      'Commands: !share <subject> <link>, !sharefile <subject> + attach one or more files, !shareprivate <@user> <subject> <link>'
    );
    return;
  }

  if (command === '!shareprivate') {
    const userMention = args[1];
    const subject = args[2];
    const rest = args.slice(3).join(' ');

    if (!userMention || !subject) {
      message.reply('Usage: !shareprivate <@user> <subject> <link or attach files>');
      return;
    }

    const userId = userMention.replace(/[<@!>]/g, '');

    try {
      const targetUser = await client.users.fetch(userId);

      if (!targetUser) {
        message.reply('User not found.');
        return;
      }

      if (message.attachments.size > 0) {
        for (const attachment of message.attachments.values()) {
          await prisma.resource.create({
            data: {
              subject,
              link: attachment.url,
              uploader: message.author.username,
              receiver: targetUser.username,
            },
          });

          await targetUser.send({
            content: `📥 You received a private file:\n**Subject**: ${subject}\n👤 Shared by: ${message.author.username}`,
            files: [attachment.url],
          });
        }

        message.reply(`✅ Shared ${message.attachments.size} file(s) privately!`);
      } else if (rest) {
        await prisma.resource.create({
          data: {
            subject,
            link: rest,
            uploader: message.author.username,
            receiver: targetUser.username,
          },
        });

        await targetUser.send(`📥 You received a private resource:\n**Subject**: ${subject}\n🔗 ${rest}\n👤 Shared by: ${message.author.username}`);
        message.reply('✅ Resource shared privately!');
      } else {
        message.reply('Please attach files or provide a link/message to share.');
      }
    } catch {
      message.reply('❌ Could not send private message.');
    }

    return;
  }

  if (command === '!sharefile') {
    const subject = args[1];

    if (!subject) {
      message.reply('Usage: !sharefile <subject> + attach one or more files');
      return;
    }

    if (message.attachments.size === 0) {
      message.reply('Please attach one or more files to share.');
      return;
    }

    for (const attachment of message.attachments.values()) {
      if (!attachment.url) continue;

      await prisma.resource.create({
        data: {
          subject,
          link: attachment.url,
          uploader: message.author.username,
        },
      });
    }

    message.reply(
      `Successfully shared ${message.attachments.size} file(s) under subject "${subject}"!`
    );
    return;
  }

  if (command === '!share') {
    const subject = args[1];
    const link = args.slice(2).join(' ');

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
});

client.login(process.env.DISCORD_TOKEN);
