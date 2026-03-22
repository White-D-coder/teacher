'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navigation/Navbar';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthContext';
import { 
  ChevronRight, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { getSubjectById, getSubjectKeyById } from '@/lib/constants';
import styles from './syllabus.module.css';

export default function SyllabusPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubPart, setSelectedSubPart] = useState<string | null>(null);

  const currentClass = user?.class || 'Class 8';
  const isSocial = id === 'social';
  const subjectMetadata = getSubjectById(id as string);
  const subjectName = subjectMetadata?.name || 'Subject';
  const subjectKey = getSubjectKeyById(id as string);

  useEffect(() => {
    if (!user) return;
    if (isSocial && !selectedSubPart) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchChapters = async () => {
      try {
        const subjectToFetch = isSocial ? selectedSubPart : subjectKey;
        const res = await fetch(`/api/lessons?subject=${encodeURIComponent(subjectToFetch as string)}&class=${encodeURIComponent(currentClass)}`);
        const data = await res.json();
        setChapters(data || []);
      } catch (err) {
        console.error('Failed to fetch syllabus:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id, user, currentClass, subjectKey, selectedSubPart, isSocial]);

  // Social Science Selection Screen
  if (isSocial && !selectedSubPart) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/courses">All Courses</Link> <ChevronRight size={14} /> <span>Social Science</span>
            </div>
            <div className={styles.titleArea}>
              <h1>Social Science Trio 🌍</h1>
              <p>Which path will you explore today?</p>
            </div>
          </header>

          <div className={styles.selectionGrid}>
            {[
              { name: 'History', icon: '📜', color: '#ff7e67', desc: 'Our Pasts - III' },
              { name: 'Geography', icon: '🏔️', color: '#4facfe', desc: 'Resources & Development' },
              { name: 'Civics', icon: '🗳️', color: '#f9d423', desc: 'Social & Political Life' }
            ].map(part => (
              <div 
                key={part.name} 
                className={`glass-card ${styles.selectionCard}`} 
                onClick={() => setSelectedSubPart(part.name)}
                style={{ borderTop: `4px solid ${part.color}` }}
              >
                <div className={styles.partIcon}>{part.icon}</div>
                <h3>{part.name}</h3>
                <p>{part.desc}</p>
                <button className="btn-primary" style={{ backgroundColor: part.color, marginTop: '1rem' }}>Explore</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/courses">All Courses</Link> 
            <ChevronRight size={14} /> 
            <span onClick={() => isSocial && setSelectedSubPart(null)} style={{ cursor: isSocial ? 'pointer' : 'default' }}>
              {subjectName}
            </span>
            {selectedSubPart && (
              <>
                <ChevronRight size={14} /> 
                <span className={styles.activeBranch}>{selectedSubPart}</span>
              </>
            )}
          </div>
          <div className={styles.titleArea}>
            <h1>{selectedSubPart || subjectName} Syllabus 📚</h1>
            <p>Select a chapter to start your learning adventure for <strong>{currentClass}</strong>!</p>
          </div>
        </header>

        <div className={styles.chaptersGrid}>
          {loading ? (
            <div className={styles.loading}>Loading your adventure...</div>
          ) : chapters.length > 0 ? (
            chapters.map((chapter, index) => {
              const isCompleted = chapter.progress?.[0]?.isCompleted || false;
              const isUnlocked = index === 0 || (chapters[index - 1]?.progress?.[0]?.isCompleted === true);

              return (
                <div 
                  key={chapter.id} 
                  className={`glass-card ${styles.chapterCard} ${!isUnlocked ? styles.locked : ''} ${isCompleted ? styles.completed : ''}`}
                  onClick={() => isUnlocked && router.push(`/courses/${id}?chapter=${chapter.id}${selectedSubPart ? `&part=${selectedSubPart}` : ''}`)}
                >
                  <div className={styles.chapterNumber}>{index + 1}</div>
                  <div className={styles.chapterInfo}>
                    <h3>{chapter.title}</h3>
                    <div className={styles.chapterStats}>
                      <span><PlayCircle size={14} /> {chapter.lessons?.length || 0} Videos</span>
                      {isCompleted && <span className={styles.doneBadge}><CheckCircle2 size={14} /> Done!</span>}
                    </div>
                  </div>
                  <div className={styles.actionArea}>
                    {isUnlocked ? (
                      <ArrowRight size={20} className={styles.arrowIcon} />
                    ) : (
                      <Lock size={20} className={styles.lockIcon} />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.empty}>
              <BookOpen size={48} />
              <p>No chapters found for this subject yet.</p>
              <Link href="/courses" className="btn-primary">Go Back</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
