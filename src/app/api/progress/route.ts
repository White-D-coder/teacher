import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, lessonId, videoCompleted, quizCompleted, writtenCompleted, mastery: providedMastery } = await request.json();
    
    // Fetch existing progress
    const existingProgress = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } }
    });

    const isVideoDone = videoCompleted ?? (existingProgress as any)?.videoCompleted ?? false;
    const isQuizDone = quizCompleted ?? (existingProgress as any)?.quizCompleted ?? false;
    const isWrittenDone = writtenCompleted ?? (existingProgress as any)?.writtenCompleted ?? false;

    // Calculate Mastery for this specific lesson
    // We treat the 3 components equally (Video, Quiz, Written)
    // If a specific mastery is provided (e.g. from quiz), we can factor it in
    let completionFlags = 0;
    if (isVideoDone) completionFlags++;
    if (isQuizDone) completionFlags++;
    if (isWrittenDone) completionFlags++;
    
    // Simple mastery: (Flags/3) * 100. 
    // If they finished a quiz with 80%, we still treat 'Quiz' as a 1/3 contribution.
    const mastery = Math.round((completionFlags / 3) * 100);

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
      const chapterId = (lesson as any).chapterId;
      const allLessons = await prisma.lesson.findMany({ where: { chapterId }});
      
      if (allLessons.length > 0) {
        let totalMastery = 0;
        for (const l of allLessons) {
          const lp = await prisma.userProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: l.id } }
          });
          totalMastery += (lp as any)?.mastery ?? 0;
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
