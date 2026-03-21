'use client';

import { useState } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import { Upload, Plus, BarChart, Video, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/components/Auth/AuthContext';
import { CLASS_SUBJECTS, SUBJECT_METADATA } from '@/lib/constants';
import styles from './admin.module.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'analytics'>('content');
  const [videoTitle, setVideoTitle] = useState('');
  const [targetClass, setTargetClass] = useState('Class 7');
  const [subject, setSubject] = useState('Mathematics');
  const [videoLink, setVideoLink] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  if (user && user.role !== 'admin') {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.accessDenied}>
          <h1>Access Denied 🔒</h1>
          <p>This area is for Teachers and Admins only!</p>
        </main>
      </div>
    );
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoLink) return;

    const newContent = {
      id: Date.now().toString(),
      title: videoTitle.trim(),
      targetClass,
      subject,
      link: videoLink.trim(),
      date: new Date().toLocaleDateString()
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem('uploaded_content') || '[]');
      localStorage.setItem('uploaded_content', JSON.stringify([...existing, newContent]));
      
      setShowSuccess(true);
      setVideoTitle('');
      setVideoLink('');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Failed to save content. Your browser's storage might be full!");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Admin Command Center 🛠️</h1>
          <div className={styles.tabs}>
            <button 
              className={activeTab === 'content' ? styles.activeTab : ''} 
              onClick={() => setActiveTab('content')}
            >
              <Video size={18} /> Manage Content
            </button>
            <button 
              className={activeTab === 'analytics' ? styles.activeTab : ''} 
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart size={18} /> AI Analytics
            </button>
          </div>
        </header>

        {activeTab === 'content' ? (
          <div className={styles.contentGrid}>
            <section className={`glass-card ${styles.uploadCard}`}>
              <h2><Upload size={24} /> Upload New Video</h2>
              <form onSubmit={handleUpload} className={styles.uploadForm}>
                <div className={styles.inputGroup}>
                  <label>Video Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Intro to Addition" 
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required 
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Target Class</label>
                    <select 
                      value={targetClass} 
                      onChange={(e) => setTargetClass(e.target.value)}
                      required
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
                    <label>Subject</label>
                    <select 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      {(CLASS_SUBJECTS[targetClass] || CLASS_SUBJECTS['Class 7']).map(subjName => (
                        <option key={subjName}>{subjName}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Video Link (YouTube/Internal)</label>
                  <input 
                    type="url" 
                    placeholder="https://youtube.com/..." 
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Chapter PDF (Optional)</label>
                  <input type="file" accept=".pdf" disabled />
                  <p style={{fontSize: '0.8rem', color: '#636e72'}}>* PDF upload simulation (requires backend storage)</p>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={showSuccess}>
                  {showSuccess ? 'Saved Successfully! ✨' : 'Save & Publish ✨'}
                </button>
                {showSuccess && <p className={styles.successText}>Lesson added to the classroom!</p>}
              </form>
            </section>

            <section className={`glass-card ${styles.quizCard}`}>
              <h2><Plus size={24} /> Create Quiz</h2>
              <p>Add interactive questions for the new video.</p>
              <button className={styles.secondaryBtn}>Add Question</button>
            </section>
          </div>
        ) : (
          <section className={`glass-card ${styles.analyticsSection}`}>
            <div className={styles.aiInsightHeader}>
              <BrainCircuit size={40} color="var(--primary)" className="animate-float" />
              <div>
                <h2>AI Analytical Report</h2>
                <p>Generated by Teacher AI based on recent performance data.</p>
              </div>
            </div>

            <div className={styles.insightBox}>
              <h3>Key Predictions & Advice:</h3>
              <div className={styles.insightCard}>
                <span className={styles.tag}>Critical</span>
                <p><b>Video: "Complex Equations" is seeing a high drop-off rate (60%) at the 4-minute mark.</b></p>
                <p className={styles.advice}><b>Teacher AI Suggestion:</b> The concepts might be too difficult or too fast. Consider easing the learning curve or breaking the video into two parts with simpler examples.</p>
              </div>
            </div>

            <div className={styles.statsSummary}>
              <div className={styles.statBox}>
                <h4>Total Active Heroes</h4>
                <span>1,250</span>
              </div>
              <div className={styles.statBox}>
                <h4>Avg. Quiz Score</h4>
                <span>82%</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
