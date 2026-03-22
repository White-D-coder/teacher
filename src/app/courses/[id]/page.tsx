'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navigation/Navbar';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthContext';
import { 
  Play, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Trophy, 
  ScanLine, 
  FileText, 
  ChevronRight, 
  Video,
  Star,
  Lock
} from 'lucide-react';
import { getGeminiResponse, analyzeImage } from '@/lib/gemini';
import CustomYTPlayer from '@/components/Video/CustomYTPlayer';
import Roadmap from '@/components/Roadmap/Roadmap';
import { getSubjectById, getSubjectKeyById } from '@/lib/constants';
import styles from './subject.module.css';

export default function SubjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'index' | 'video' | 'quiz' | 'practice'>('index');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [videoFinished, setVideoFinished] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState(0);

  // Content state
  const [availableContent, setAvailableContent] = useState<any[]>([]);
  const currentClass = user?.class || 'Class 7';
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  const subjectName = getSubjectById(id as string)?.name || 'Subject';
  const subjectKey = getSubjectKeyById(id as string);

  useEffect(() => {
    if (!user) return;

    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/lessons?subject=${encodeURIComponent(subjectKey)}&class=${encodeURIComponent(currentClass)}`);
        const data = await res.json();
        
        let chapters = data;
        if (!chapters || chapters.length === 0) {
          chapters = [];
        }
        
        setAvailableContent(chapters);
        
        // Auto-resume logic
        let initialChapter = chapters?.[0] || null;
        for (const ch of chapters) {
          if (!ch.progress?.[0]?.isCompleted) {
            initialChapter = ch;
            break;
          }
        }

        setSelectedChapter(initialChapter);

        // Fetch subject progress percentage
        let totalMastery = 0;
        chapters.forEach((ch: any) => totalMastery += (ch.progress?.[0]?.mastery || 0));
        setSubjectProgress(chapters.length > 0 ? Math.round(totalMastery / chapters.length) : 0);

      } catch (err) {
        console.error('Failed to fetch content:', err);
      }
    };

    fetchContent();
  }, [id, user, currentClass, subjectName]);

  const handleComponentFinished = async (type: 'video' | 'quiz' | 'written') => {
    if (!selectedChapter || !selectedChapter.lessons?.[0] || !user) return;
    
    if (type === 'video') setVideoFinished(true);

    try {
      const payload: any = {
        userId: user.id || user.name,
        lessonId: selectedChapter.lessons[0].id
      };
      
      if (type === 'video') payload.videoCompleted = true;
      if (type === 'quiz') payload.quizCompleted = true;
      if (type === 'written') payload.writtenCompleted = true;

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const newProgress = await res.json();
      
      // Mutate state gracefully
      const updatedChapters = [...availableContent];
      const chIndex = updatedChapters.findIndex(c => c.id === selectedChapter.id);
      if (chIndex > -1) {
        if (!updatedChapters[chIndex].progress) updatedChapters[chIndex].progress = [];
        if (!updatedChapters[chIndex].progress[0]) updatedChapters[chIndex].progress[0] = { mastery: 0, isCompleted: false };
        
        // We do a soft refetch of the dashboard metrics ideally, but approximating locally:
        // Or better yet, we can reload content from API silently
        fetchContentSilently();
      }
    } catch (err) {
      console.error('Progress sync error:', err);
    }
  };

  const fetchContentSilently = async () => {
    const res = await fetch(`/api/lessons?subject=${encodeURIComponent(subjectKey)}&class=${encodeURIComponent(currentClass)}`);
    const chapters = await res.json();
    setAvailableContent(chapters);
    let totalMastery = 0;
    chapters.forEach((ch: any) => totalMastery += (ch.progress?.[0]?.mastery || 0));
    setSubjectProgress(chapters.length > 0 ? Math.round(totalMastery / chapters.length) : 0);
  };


  const handleSelectChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    setVideoFinished(chapter.lessons?.[0]?.progress?.[0]?.videoCompleted || false);
    setActiveTab('video');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAiTyping) return;
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAiTyping(true);
    
    try {
      const aiResponse = await getGeminiResponse(inputValue, `Student is learning ${id} in ${currentClass}. Currently watching: ${selectedChapter?.title}`);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validation
    if (file.size > 5 * 1024 * 1024) {
      alert("Oops! This picture is too big. Please try a smaller one (under 5MB).");
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert("Please upload a picture of your work (JPG or PNG)!");
      return;
    }

    // 2. Preview & Base64 conversion
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Content = (reader.result as string).split(',')[1];
      setScanPreview(reader.result as string);
      setIsAnalyzing(true);
      setActiveTab('practice');

      try {
        const result = await analyzeImage(base64Content, "Explain this answer and check if it is correct.");
        setMessages(prev => [...prev, { role: 'ai', content: `🔍 **Scan Result:**\n${result}` }]);
        handleComponentFinished('written');
      } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', content: "I had trouble reading that image. Can you try again with a clearer photo?" }]);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const getYoutubeEmbed = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0` : url;
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.breadcrumb}>
              <Link href="/courses">All Courses</Link> <ChevronRight size={14} /> <span>{subjectName}</span>
            </div>
            <h1>{subjectName} Adventure! ✨</h1>
            <p className={styles.subtitle}>Currently learning content for <strong>{currentClass}</strong></p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.progressBadge}>
              <Trophy size={18} />
              <span>{subjectProgress}% Mastery</span>
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.contentArea}>
            <nav className={styles.tabs}>
              <button className={activeTab === 'index' ? styles.active : ''} onClick={() => setActiveTab('index')}>
                <FileText size={18} /> Syllabus
              </button>
              <button className={activeTab === 'video' ? styles.active : ''} onClick={() => setActiveTab('video')}>
                <Play size={18} /> Video Lessons
              </button>
              <button className={activeTab === 'quiz' ? styles.active : ''} onClick={() => setActiveTab('quiz')}>
                <CheckCircle size={18} /> Chapter Quiz
              </button>
              <button className={activeTab === 'practice' ? styles.active : ''} onClick={() => setActiveTab('practice')}>
                <ScanLine size={18} /> Written Practice
              </button>
            </nav>

            <div className={`glass-card ${styles.mediaCard}`}>
              {activeTab === 'index' ? (
                <div className={styles.indexArea}>
                  <div className={styles.roadmapHeader}>
                    <h3>Course Syllabus & Roadmap 🗺️</h3>
                    <p>Complete chapters one by one to level up!</p>
                  </div>
                  {availableContent.length > 0 ? (
                    <div className={styles.fullRoadmapWrapper}>
                      <Roadmap 
                        chapters={availableContent.map((v, index) => ({
                          id: v.id,
                          title: v.title,
                          isCompleted: v.progress?.[0]?.isCompleted || false,
                          isUnlocked: index === 0 || (availableContent[index - 1]?.progress?.[0]?.isCompleted === true),
                          order: index + 1
                        }))}
                        onChapterClick={handleSelectChapter}
                        activeChapterId={selectedChapter?.id}
                      />
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      <Video size={48} />
                      <p>No chapters available yet.</p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'video' ? (
                <div className={styles.videoPlayerContainer}>
                  {selectedChapter ? (
                    <div className={styles.activeVideo}>
                      <div className={styles.videoWrapper}>
                        {selectedChapter.lessons?.[0] ? (
                          <CustomYTPlayer 
                            videoId={getYoutubeId(selectedChapter.lessons[0].videoUrl)} 
                            title={selectedChapter.lessons[0].title}
                            onComplete={() => handleComponentFinished('video')}
                          />
                        ) : (
                          <div className={styles.nativePlaceholder}>
                            <Play size={64} />
                            <p>No video attached to this chapter.</p>
                          </div>
                        )}
                      </div>
                      <div className={styles.videoInfo}>
                        <h2>{selectedChapter.title}</h2>
                        <div className={styles.videoMeta}>
                          <button onClick={() => handleComponentFinished('video')} className={styles.finishBtn}>
                            {videoFinished ? '✅ Finished!' : 'Mark as Finished'}
                          </button>
                          
                          {selectedChapter.supplements && selectedChapter.supplements.length > 0 && (
                            <div className={styles.supplementsList} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {selectedChapter.supplements.map((supp: any) => (
                                <Link key={supp.id} href={supp.link} className={styles.pdfBtn} target="_blank">
                                  <FileText size={18} /> {supp.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      <Video size={48} />
                      <p>No videos found for this class yet!</p>
                    </div>
                  )}

                  {availableContent.length > 0 && (
                    <div className={styles.roadmapSidebar}>
                      <div className={styles.roadmapHeader}>
                        <h3>Lesson Roadmap 🗺️</h3>
                        <p>Complete lessons to unlock the next level!</p>
                      </div>
                      <Roadmap 
                        chapters={availableContent.map((v, index) => ({
                          id: v.id,
                          title: v.title,
                          isCompleted: v.progress?.[0]?.isCompleted || false,
                          isUnlocked: index === 0 || (availableContent[index - 1]?.progress?.[0]?.isCompleted === true),
                          order: index + 1
                        }))}
                        onChapterClick={handleSelectChapter}
                        activeChapterId={selectedChapter?.id}
                      />
                    </div>
                  )}
                </div>
              ) : activeTab === 'quiz' ? (
                <div className={styles.quizArea}>
                  <h3>Brain Challenge! 🧠</h3>
                  <div className={styles.lockedState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Trophy size={48} color="var(--accent)" />
                    <p>Earn questions by watching the video!</p>
                    <button onClick={() => handleComponentFinished('quiz')} className={styles.finishBtn} style={{ marginTop: '20px' }}>
                      Mark Quiz Completed (Debug)
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.practiceArea}>
                  <h3>Teacher AI Checker 📝</h3>
                  <p>Upload a photo of your written answer and I'll check it for you!</p>
                  
                  <div className={styles.scanControls}>
                    <label className={`${styles.uploadBox} ${isAnalyzing ? styles.loading : ''}`}>
                      {scanPreview ? (
                        <div className={styles.previewContainer}>
                          <img src={scanPreview} alt="Scan Preview" className={styles.previewImg} />
                          {isAnalyzing && <div className={styles.scanOverlay}><Sparkles className="animate-pulse" /> Analyzing...</div>}
                        </div>
                      ) : (
                        <>
                          <ScanLine size={48} />
                          <span>Click to Scan Written Answer</span>
                        </>
                      )}
                      <input type="file" hidden onChange={handleImageUpload} accept="image/*" disabled={isAnalyzing} />
                    </label>
                    {scanPreview && !isAnalyzing && (
                      <button className={styles.resetBtn} onClick={() => setScanPreview(null)}>Scan Another Answer</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className={`glass-card ${styles.aiSiderbar}`}>
            <div className={styles.aiHeader}>
              <Sparkles size={22} color="var(--primary)" />
              <h3>Teacher Assistant AI</h3>
            </div>
            <div className={styles.chatWindow}>
              {messages.length === 0 ? (
                <div className={styles.welcomeMsg}>
                  👋 Hello! I'm your Teacher AI. Ask me anything about this lesson—I love to help!
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={i} className={`${styles.bubble} ${styles[m.role]}`}>
                      {m.content}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className={`${styles.bubble} ${styles.ai} ${styles.typing}`}>
                      Thinking... ✨
                    </div>
                  )}
                </>
              )}
            </div>
            <div className={styles.chatInput}>
              <input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}><Send size={18} /></button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
