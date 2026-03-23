'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import { Trophy, Flame, Download, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import { useAuth } from '@/components/Auth/AuthContext';
import styles from './profile.module.css';

const MOCK_DATA = [
  { subject: 'Math', progress: 65, color: '#FF6B6B' },
  { subject: 'Science', progress: 30, color: '#4ECDC4' },
  { subject: 'English', progress: 90, color: '#FFE66D' },
  { subject: 'Hindi', progress: 10, color: '#4D96FF' },
  { subject: 'Music', progress: 50, color: '#6BCB77' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [progression, setProgression] = useState(MOCK_DATA);
  const [streak, setStreak] = useState(5);
  const userName = user?.name || 'Little Scholar';
  const [isSunday, setIsSunday] = useState(false);

  const [nextReportDate, setNextReportDate] = useState('This Sunday');

  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 0) setIsSunday(true); // 0 is Sunday
    
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStreak(data.streakCount || 0);
          setNextReportDate(data.nextReport || 'This Sunday');
          
          if (data.subjectProgress) {
            const updated = data.subjectProgress.map((sp: any, i: number) => {
              const staticMatch = MOCK_DATA.find(m => m.subject.toLowerCase() === sp.subject.toLowerCase());
              return {
                subject: sp.subject.charAt(0).toUpperCase() + sp.subject.slice(1),
                progress: sp.mastery,
                color: staticMatch ? staticMatch.color : ['#FF6B6B', '#4ECDC4', '#FFE66D', '#4D96FF', '#6BCB77'][i % 5]
              };
            });
            // If the user hasn't enrolled in subjects, fallback gracefully
            setProgression(updated.length > 0 ? updated : MOCK_DATA.map(m => ({ ...m, progress: 0 })));
          }
        }
      } catch (err) {
        console.error('Failed fetching dashboard', err);
      }
    };
    fetchDashboard();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Progress Report for ${userName}`, 20, 20);
    doc.setFontSize(14);
    doc.text(`Current Streak: ${streak} Days 🔥`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    
    doc.text('Subject Progress:', 20, 60);
    progression.forEach((p, index) => {
      doc.text(`${p.subject}: ${p.progress}%`, 30, 75 + (index * 10));
    });
    
    doc.save(`${userName}_Progress_Report.pdf`);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {isSunday && (
          <div className={`glass-card ${styles.sundayBanner}`}>
            <div className={styles.bannerInfo}>
              <Calendar size={24} />
              <div>
                <h3>Sunday Update is Here! 📅</h3>
                <p>Your weekly progress report is ready for review.</p>
              </div>
            </div>
            <button onClick={generatePDF} className={styles.reportBtn}>View Report</button>
          </div>
        )}
        <header className={styles.header}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <Trophy size={40} color="var(--accent)" />
            </div>
            <div className={styles.userInfo}>
              <h1>{userName}'s Dashboard</h1>
              <p>Keep going, you're doing amazing! ✨</p>
            </div>
          </div>
          <button onClick={generatePDF} className={styles.downloadBtn}>
            <Download size={20} /> Download Report (PDF)
          </button>
        </header>

        <section className={styles.statsGrid}>
          <div className={`glass-card ${styles.statCard}`}>
            <Flame size={32} color="#fd9644" />
            <div>
              <h3>{streak} Days</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <div className={`glass-card ${styles.statCard}`}>
            <Calendar size={32} color="var(--info)" />
            <div>
              <h3>{nextReportDate}</h3>
            </div>
          </div>
        </section>

        <section className={`glass-card ${styles.chartSection}`}>
          <div className={styles.chartHeader}>
            <BarChart3 size={24} color="var(--primary)" />
            <h2>Subject Progression Graph</h2>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progression}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" radius={[10, 10, 0, 0]}>
                  {progression.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
