import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const resources = await prisma.resource.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  const { subject, link, uploader } = await req.json();
  const created = await prisma.resource.create({ data: { subject, link, uploader } });
  return NextResponse.json(created);
}