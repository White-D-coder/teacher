'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthContext';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 7');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const role = name.toLowerCase().includes('teacher') ? 'admin' : 'student';
    login({
      name: name || 'New Hero',
      class: selectedClass,
      role: role as 'student' | 'admin'
    });
    router.push(role === 'admin' ? '/admin' : '/courses');
  };

  return (
    <div className={styles.container}>
      <div className={`glass-card ${styles.registerCard}`}>
        <div className={styles.header}>
          <Sparkles size={40} color="var(--accent)" className="animate-float" />
          <h1>Create Your Hero!</h1>
          <p>Pick a name and start your journey.</p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Hero Name</label>
            <input 
              type="text" 
              placeholder="What should we call you?" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Your Class</label>
            <select 
              className={styles.select}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option>Class 7</option>
              <option>Class 8</option>
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11</option>
              <option>Class 12</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Secret Code</label>
            <input type="password" placeholder="Create a secret code..." required />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Let's Start! ✨
          </button>
        </form>

        <p className={styles.switch}>
          Already have a hero? <Link href="/auth/login">Log In here!</Link>
        </p>
      </div>
    </div>
  );
}
