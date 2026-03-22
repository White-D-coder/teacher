'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthContext';
import { getSubjectsForClass } from '@/lib/constants';
import styles from './courses.module.css';


export default function CoursesPage() {
  const { user, updateClass } = useAuth();
  const selectedClass = user?.class || 'Class 7';

  const handleClassChange = (newClass: string) => {
    updateClass(newClass);
  };

  const subjects = getSubjectsForClass(selectedClass);

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h2>{selectedClass} Adventure! 🎒</h2>
            <div className={styles.classSelector}>
              <label>Switch Class:</label>
              <select 
                value={selectedClass} 
                onChange={(e) => handleClassChange(e.target.value)}
              >
                <option>Class 7</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>
            </div>
          </div>
          <p>Explore your subjects for {selectedClass} and level up!</p>
        </header>

        <div className={styles.grid}>
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/courses/${subject.id}/syllabus`} className={`glass-card ${styles.card}`}>
              <div className={styles.iconWrapper} style={{ backgroundColor: `${subject.color}22`, color: subject.color }}>
                <subject.icon size={40} />
              </div>
              <h3>{subject.name}</h3>
              <div className={styles.stats}>
                <span>12 Videos</span>
                <span>•</span>
                <span>0% Done</span>
              </div>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `0%`, backgroundColor: subject.color }}></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
