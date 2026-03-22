import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('cookie');
    const tokenMatch = authHeader?.match(/auth_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = decoded.id;
    const user = await prisma.user.findUnique({ where: { id: userId }});

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Aggregate Subject Mastery
    // To get Subject mastery, find all Chapters per subject, avg the mastery.
    const subjects = await prisma.subject.findMany({
      where: { class: user.class },
      include: { chapters: true }
    });

    const subjectProgress = await Promise.all(subjects.map(async (subj) => {
      let total = 0;
      for (const ch of subj.chapters) {
        const cp = await prisma.chapterProgress.findUnique({
          where: { userId_chapterId: { userId, chapterId: ch.id } }
        });
        total += cp?.mastery ?? 0;
      }
      return {
        subject: subj.name,
        mastery: subj.chapters.length > 0 ? Math.round(total / subj.chapters.length) : 0
      };
    }));

    return NextResponse.json({
      streakCount: user.streakCount,
      nextReport: 'In 2 days', // Static as requested
      subjectProgress
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
