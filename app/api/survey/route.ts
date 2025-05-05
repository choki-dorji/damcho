import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
  const surveys = await prisma.Survey.findMany();
  return Response.json(surveys);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const survey = await prisma.Survey.create({ data });
  return Response.json(survey, { status: 201 });
} 