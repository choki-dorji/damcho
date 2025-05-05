import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();
export async function GET() {
  const surveys = await prisma.Survey.findMany();
  return Response.json(surveys);
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  // 1. Create the survey
  const survey = await prisma.Survey.create({ data });

  // 2. Mark hasCompletedSurvey as true for the user
  await prisma.user.update({
    where: { id: data.userId },
    data: { hasCompletedSurvey: true }
  });

  return Response.json(survey, { status: 201 });
} 