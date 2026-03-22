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

  try {
    const authHeader = request.headers.get('cookie');
    const tokenMatch = authHeader?.match(/auth_token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    let userId = null;
    if (token) {
      const decoded: any = verifyToken(token);
      if (decoded && decoded.id) {
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
                progress: userId ? { where: { userId } } : false
              }
            },
            supplements: true,
            progress: userId ? { where: { userId } } : false
          }
        }
      }
    });

    if (!subject) return NextResponse.json([]);

    return NextResponse.json(subject.chapters);
  } catch (error) {
    console.error('Fetch lessons error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
