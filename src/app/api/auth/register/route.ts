import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const db = prisma;

export async function POST(request: Request) {
  try {
    const { name, secretCode, class: userClass, role } = await request.json();
    
    // Check existing
    const existing = await db.user.findFirst({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: 'Username taken' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(secretCode, 10);
    
    // @ts-ignore
    const user = await db.user.create({
      data: { 
        name, 
        password: hashedPassword, 
        class: userClass, 
        role: role || 'student' 
      }
    });

    const token = signToken({ id: user.id, name: user.name, role: user.role });
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      class: user.class,
      role: user.role,
      streakCount: (user as any).streakCount || 0
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error details:', error);
    return NextResponse.json({ error: 'Server error', details: error.message || String(error) }, { status: 500 });
  }
}
