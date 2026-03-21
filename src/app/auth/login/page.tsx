'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: name || (role === 'admin' ? 'Super Admin' : 'Little Scholar'),
      class: 'Class 7', // Default or fetch from last session
      role: role
    });
    router.push(role === 'admin' ? '/admin' : '/courses');
  };

  return (
    <div className={styles.container}>
      <div className={`glass-card ${styles.loginCard}`}>
        <div className={styles.header}>
          <LogIn size={40} color="var(--primary)" />
          <h1>Welcome Back!</h1>
          <p>Ready to continue your adventure?</p>
        </div>

        <div className={styles.roleSelection}>
          <button 
            className={role === 'student' ? styles.activeRole : ''} 
            onClick={() => setRole('student')}
          >
            <User size={20} /> Student
          </button>
          <button 
            className={role === 'admin' ? styles.activeRole : ''} 
            onClick={() => setRole('admin')}
          >
            <ShieldCheck size={20} /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Name or Email</label>
            <input 
              type="text" 
              placeholder="Enter your secret name..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Secret Code (Password)</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Let's Go! 🚀
          </button>
        </form>

        <p className={styles.switch}>
          New here? <Link href="/auth/register">Create a new hero!</Link>
        </p>
      </div>
    </div>
  );
}
