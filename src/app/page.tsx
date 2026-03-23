'use client';

import Link from 'next/link';
import { BookOpen, PlayCircle, Rocket, Trophy, ScanLine } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Rocket className="animate-float" />
          <h1>Teacher</h1>
        </div>
        <nav className={styles.nav}>
          <Link href="/auth/login" className={styles.loginBtn}>Start Learning!</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h2 className={styles.title}>Unlock your Superpowers with Learning! 🚀</h2>
          <p className={styles.subtitle}>Watch videos, solve puzzles, and win streaks. Bilingual & Hinglish support for everyone!</p>
          
          <div className={styles.features}>
            <div className={`glass-card ${styles.featureCard}`}>
              <PlayCircle size={40} color="var(--primary)" />
              <h3>Fun Videos</h3>
              <p>Learn subjects like stories.</p>
            </div>
            <div className={`glass-card ${styles.featureCard}`}>
              <BookOpen size={40} color="var(--secondary)" />
              <h3>Smart Books</h3>
              <p>Books that talk to you.</p>
            </div>
            <div className={`glass-card ${styles.featureCard}`}>
              <Trophy size={40} color="var(--accent)" />
              <h3>Win Streaks</h3>
              <p>Keep the streak alive!</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={`glass-card ${styles.ctaCard}`}>
            <h2>Ready to be a Hero?</h2>
            <div className={styles.ctaButtons}>
              <Link href="/courses" className={styles.primaryBtn}>Explore Classes</Link>
              <Link href="/admin" className={styles.secondaryBtn}>Admin Log In</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Teacher - Making Learning fun for everyone! ❤️</p>
      </footer>
    </div>
  );
}
