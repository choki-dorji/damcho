import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Get user ID from cookie (adjust as needed)
  const cookieStore = cookies();
  const userId = cookieStore.get("userData")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all survey data for user
  const surveys = await prisma.survey.findMany({
    where: { userId },
  });

  if (!surveys || surveys.length === 0) {
    return NextResponse.json({ error: "No survey data found" }, { status: 404 });
  }

  // Format all survey data as text
  const text = surveys.map((survey, idx) => {
    return `Survey #${idx + 1}\n` + Object.entries(survey)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join("\n") + "\n\n";
  }).join("");

  return new NextResponse(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=survey-data.txt",
    },
  });
}