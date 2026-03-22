import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, lessonId, videoCompleted, quizCompleted, writtenCompleted } = await request.json();
    
    // Fetch existing progress
    const existingProgress = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    const isVideoDone = videoCompleted ?? existingProgress?.videoCompleted ?? false;
    const isQuizDone = quizCompleted ?? existingProgress?.quizCompleted ?? false;
    const isWrittenDone = writtenCompleted ?? existingProgress?.writtenCompleted ?? false;

    // Calculate Mastery for this specific lesson
    let flags = 0;
    if (isVideoDone) flags++;
    if (isQuizDone) flags++;
    if (isWrittenDone) flags++;
    const mastery = Math.round((flags / 3) * 100);

    const progress = await prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        videoCompleted: isVideoDone,
        quizCompleted: isQuizDone,
        writtenCompleted: isWrittenDone,
        mastery,
        completedAt: mastery === 100 ? new Date() : null
      },
      create: {
        userId,
        lessonId,
        videoCompleted: isVideoDone,
        quizCompleted: isQuizDone,
        writtenCompleted: isWrittenDone,
        mastery,
        completedAt: mastery === 100 ? new Date() : null
      }
    });

    // Automatically recalculate ChapterProgress
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }});
    if (lesson) {
      const chapterId = lesson.chapterId;
      const allLessons = await prisma.lesson.findMany({ where: { chapterId }});
      
      if (allLessons.length > 0) {
        let totalMastery = 0;
        for (const l of allLessons) {
          const lp = await prisma.userProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: l.id } }
          });
          totalMastery += lp?.mastery ?? 0;
        }

        const chapterMastery = Math.round(totalMastery / allLessons.length);
        const isCompleted = chapterMastery === 100;

        await prisma.chapterProgress.upsert({
          where: { userId_chapterId: { userId, chapterId } },
          update: { mastery: chapterMastery, isCompleted },
          create: { userId, chapterId, mastery: chapterMastery, isCompleted }
        });
      }
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
