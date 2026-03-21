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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, secretCode: password })
      });

      if (!res.ok) throw new Error('Invalid name or secret code!');

      const user = await res.json();
      login(user);
      router.push(user.role === 'admin' ? '/admin' : '/courses');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
          {error && <p className={styles.error}>{error}</p>}
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
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Wait a sec... ✨' : "Let's Go! 🚀"}
          </button>
        </form>

        <p className={styles.switch}>
          New here? <Link href="/auth/register">Create a new hero!</Link>
        </p>
      </div>
    </div>
  );
}
