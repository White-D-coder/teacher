'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Rocket, BookOpen, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthContext';
import styles from './navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Rocket className="animate-float" />
          <span>Teacher</span>
        </Link>
      </div>

      <div className={styles.links}>
        <Link href="/courses" className={isActive('/courses') ? styles.active : ''}>
          <BookOpen size={20} />
          <span>My Classes</span>
        </Link>
        <Link href="/profile" className={isActive('/profile') ? styles.active : ''}>
          <Trophy size={20} />
          <span>Stats & Streaks</span>
        </Link>
      </div>

      <div className={styles.actions}>
        <div className={styles.profile}>
          <User size={20} />
          <span>Hi, {user?.name || 'Buddy'}!</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
