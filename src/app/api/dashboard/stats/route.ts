import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const className = searchParams.get("class");

    if (!userId || !className) {
      return NextResponse.json({ error: "Missing userId or class" }, { status: 400 });
    }

    // 1. Get all subjects for this class
    const subjects = await prisma.subject.findMany({
      where: { class: className },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // 2. Get user progress for these lessons
    const userProgress = await prisma.userProgress.findMany({
      where: { userId: userId },
    });

    // 3. Define the subjects we want to show on the dashboard (from lib/constants)
    const dashboardSubjects = ["Math", "Science", "Social Science", "English", "Hindi", "Musical World"];

    // 4. Aggregate stats
    const stats = dashboardSubjects.map((subName) => {
      let totalVideos = 0;
      let completedVideos = 0;

      // Filter subjects that belong to this dashboard category
      // For 'Social Science', we include History, Geography, Civics, Economics
      const relevantSubjects = subjects.filter((s: any) => {
        if (subName === "Social Science") {
          return s.name === "Social Science" || ["History", "Geography", "Civics", "Economics"].includes(s.name);
        }
        return s.name === subName;
      });

      relevantSubjects.forEach((subject: any) => {
        subject.chapters.forEach((chapter: any) => {
          totalVideos += chapter.lessons.length;
          
          chapter.lessons.forEach((lesson: any) => {
            const progress = userProgress.find((p: any) => p.lessonId === lesson.id);
            // @ts-ignore - Prisma types might be out of sync in IDE
            if (progress?.videoCompleted) {
              completedVideos++;
            }
          });
        });
      });

      const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      return {
        subjectName: subName,
        totalVideos,
        completedVideos,
        progressPercent,
      };
    });

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error("❌ Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats", details: error.message }, { status: 500 });
  }
}
