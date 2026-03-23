import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const db = prisma;

export async function POST(request: Request) {
  try {
    const { name, secretCode } = await request.json();
    
    const user = await db.user.findFirst({
      where: { name }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const isValid = await bcrypt.compare(secretCode, (user as any).password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Streak Logic
    let newStreak = (user as any).streakCount || 0;
    const now = new Date();
    const lastActive = (user as any).lastActiveDate ? new Date((user as any).lastActiveDate) : now;
    const diffHours = Math.abs(now.getTime() - lastActive.getTime()) / 36e5;
    
    if (diffHours > 24 && diffHours < 48) {
      newStreak++;
    } else if (diffHours >= 48) {
      newStreak = 1;
    } else if ((user as any).streakCount === 0) {
      newStreak = 1;
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        streakCount: newStreak,
        lastActiveDate: now
      }
    });

    const token = signToken({ id: user.id, name: user.name, role: user.role });
    const response = NextResponse.json({ 
      id: updatedUser.id, 
      name: updatedUser.name, 
      class: updatedUser.class, 
      role: updatedUser.role,
      streakCount: (updatedUser as any).streakCount || 0
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
