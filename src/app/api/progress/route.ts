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

    // 1. Update UserProgress (Video only)
    const progress = await (prisma.userProgress as any).upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        videoCompleted: videoCompleted ?? undefined,
        // Quiz/Written no longer needed in UserProgress but keeping for legacy
        quizCompleted: quizCompleted ?? undefined,
        writtenCompleted: writtenCompleted ?? undefined,
      },
      create: {
        userId,
        lessonId,
        videoCompleted: videoCompleted ?? false,
        quizCompleted: quizCompleted ?? false,
        writtenCompleted: writtenCompleted ?? false,
      }
    });

    // 2. Automatically recalculate ChapterProgress
    const lesson = await (prisma.lesson as any).findUnique({ 
      where: { id: lessonId },
      include: { chapter: true }
    });

    if (lesson) {
      const chapterId = lesson.chapterId;
      
      // Get all lessons for this chapter
      const allLessons = await (prisma.lesson as any).findMany({ 
        where: { chapterId },
        include: { progress: { where: { userId } } }
      });
      
      const totalVideos = allLessons.filter((l: any) => l.videoUrl).length; // Only count lessons with videos
      const completedVideos = allLessons.filter((l: any) => l.progress?.[0]?.videoCompleted).length;
      
      const videoScore = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 100;

      // Get/Update ChapterProgress
      const existingChapterProg = await (prisma.chapterProgress as any).findUnique({
        where: { userId_chapterId: { userId, chapterId } }
      });

      const isQuizDone = quizCompleted ?? existingChapterProg?.quizCompleted ?? false;
      const isWrittenDone = writtenCompleted ?? existingChapterProg?.writtenCompleted ?? false;

      // Final Mastery: (VideoScore + QuizScore + WrittenScore) / 3
      const mastery = Math.round((videoScore + (isQuizDone ? 100 : 0) + (isWrittenDone ? 100 : 0)) / 3);
      const isCompleted = mastery === 100;

      await (prisma.chapterProgress as any).upsert({
        where: { userId_chapterId: { userId, chapterId } },
        update: { 
          mastery, 
          isCompleted,
          quizCompleted: isQuizDone,
          writtenCompleted: isWrittenDone
        },
        create: { 
          userId, 
          chapterId, 
          mastery, 
          isCompleted,
          quizCompleted: isQuizDone,
          writtenCompleted: isWrittenDone
        }
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
