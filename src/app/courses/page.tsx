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
  const [selectedClass, setSelectedClass] = useState('Class 7');
  const [subjectStats, setSubjectStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.class) {
      setSelectedClass(user.class);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/stats?userId=${user.id}&class=${encodeURIComponent(selectedClass)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSubjectStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, selectedClass]);

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    updateClass(newClass);
  };

  const subjectMeta = getSubjectsForClass(selectedClass);

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
          {subjectMeta.map((meta) => {
            const stats = subjectStats.find(s => s.subjectName === meta.name) || {
              totalVideos: 0,
              progressPercent: 0
            };

            return (
              <Link key={meta.id} href={`/courses/${meta.id}/syllabus`} className={`glass-card ${styles.card}`}>
                <div className={styles.iconWrapper} style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                  <meta.icon size={40} />
                </div>
                <h3>{meta.name}</h3>
                <div className={styles.stats}>
                  <span>{stats.totalVideos} Videos</span>
                  <span>•</span>
                  <span>{stats.progressPercent}% Done</span>
                </div>
                <div className={styles.progressContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ 
                      width: `${stats.progressPercent}%`, 
                      backgroundColor: meta.color,
                      boxShadow: stats.progressPercent > 0 ? `0 0 10px ${meta.color}44` : 'none'
                    }}
                  ></div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
