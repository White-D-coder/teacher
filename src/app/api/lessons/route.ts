import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

const db = prisma;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectName = searchParams.get('subject');
  const targetClass = searchParams.get('class');

  if (!subjectName || !targetClass) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  console.log(`Fetching lessons for Subject: ${subjectName}, Class: ${targetClass}`);

  try {
    const authHeader = request.headers.get('cookie');
    const tokenMatch = authHeader?.match(/auth_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    let userId = null;
    if (token) {
      const decoded: any = verifyToken(token);
      if (decoded && decoded.id && /^[0-9a-fA-F]{24}$/.test(decoded.id)) {
        userId = decoded.id;
      }
    }

    const subject = await db.subject.findFirst({
      where: { name: subjectName, class: targetClass },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              include: {
                progress: userId ? { where: { userId } } : undefined
              }
            },
            supplements: true,
            quiz: {
              include: {
                questions: true
              }
            },
            progress: userId ? { where: { userId } } : undefined
          }
        }
      }
    });

    if (!subject) return NextResponse.json([]);

    // 4. Calculate isUnlocked logic
    const chapters = subject.chapters.map((chapter: any, index: number) => {
      const prog = chapter.progress?.[0];
      const isCompleted = prog?.isCompleted || false;
      const mastery = prog?.mastery || 0;
      const quizCompleted = prog?.quizCompleted || false;
      const writtenCompleted = prog?.writtenCompleted || false;

      // Unlocking Logic:
      // First chapter is always unlocked.
      // Subsequent chapters unlock if the PREVIOUS one is completed.
      let isUnlocked = false;
      if (index === 0) {
        isUnlocked = true;
      } else {
        const prevChapter = subject.chapters[index - 1];
        const prevProg = prevChapter.progress?.[0];
        if (prevProg?.isCompleted) {
          isUnlocked = true;
        }
      }

      return {
        ...chapter,
        isCompleted,
        isUnlocked,
        mastery,
        quizCompleted,
        writtenCompleted,
        order: chapter.orderIndex // Map to the frontend 'order' property
      };
    });

    return NextResponse.json(chapters);
  } catch (error: any) {
    console.error('Fetch lessons error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Keeping simple lesson creation compatibility if they hit this directly from admin
  try {
    const data = await request.json();
    return NextResponse.json({ error: 'Admin bulk upload endpoint required.' }, { status: 501 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
