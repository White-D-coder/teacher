'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navigation/Navbar';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthContext';
import { 
  ChevronRight, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Play,
  CheckCircle,
  ScanLine,
  FileText,
  Video,
  Trophy,
  Sparkles,
  Star,
  MessageSquare,
  Send
} from 'lucide-react';
import { getGeminiResponse, analyzeImage } from '@/lib/gemini';
import CustomYTPlayer from '@/components/Video/CustomYTPlayer';
import Roadmap from '@/components/Roadmap/Roadmap';
import { getSubjectById, getSubjectKeyById } from '@/lib/constants';
import styles from './subject.module.css';

export default function SubjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const chapterIdFromUrl = searchParams.get('chapter');
  const [activeTab, setActiveTab] = useState<'index' | 'video' | 'quiz' | 'practice'>('index');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanPreview, setScanPreview] = useState<string | null>(null);
  const [videoFinished, setVideoFinished] = useState(false);
  const [subjectProgress, setSubjectProgress] = useState(0);

  const [availableContent, setAvailableContent] = useState<any[]>([]);
  const currentClass = user?.class || 'Class 7';
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [chapterNotes, setChapterNotes] = useState<string | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const subjectName = getSubjectById(id as string)?.name || 'Subject';
  const subjectKey = getSubjectKeyById(id as string);

  const part = searchParams.get('part');
  const isSocial = id === 'social';

  useEffect(() => {
    if (!user) return;

    const fetchContent = async () => {
      try {
        const subjectToFetch = (isSocial && part) ? part : subjectKey;
        const res = await fetch(`/api/lessons?subject=${encodeURIComponent(subjectToFetch)}&class=${encodeURIComponent(currentClass)}`);
        const data = await res.json();
        
        let chapters = data;
        if (!chapters || chapters.length === 0) {
          chapters = [];
        }
        
        setAvailableContent(chapters);
        
        // Auto-resume logic
        let initialChapter = chapters?.[0] || null;
        if (chapterIdFromUrl) {
          const matched = chapters.find((c: any) => c.id === chapterIdFromUrl);
          if (matched) {
            initialChapter = matched;
            setActiveTab('video');
          }
        }

        setSelectedChapter(initialChapter);
        setSelectedLesson(initialChapter?.lessons?.[0] || null);

        // Fetch subject progress percentage
        let totalMastery = 0;
        chapters.forEach((ch: any) => totalMastery += (ch.progress?.[0]?.mastery || 0));
        setSubjectProgress(chapters.length > 0 ? Math.round(totalMastery / chapters.length) : 0);

      } catch (err) {
        console.error('Failed to fetch content:', err);
      }
    };

    fetchContent();
  }, [id, user, currentClass, subjectKey, isSocial, part]);

  // Auto-generate written questions if missing or generic
  useEffect(() => {
    if (activeTab === 'practice' && selectedChapter && !isGeneratingQuestions) {
      const q = selectedChapter.writtenQuestion || "";
      const isGeneric = !q.includes('1.') || q.includes('Write a summary of what you learned');
      if (isGeneric) {
        handleGenerateQuestions();
      }
    }
  }, [activeTab, selectedChapter?.id]);

  const handleComponentFinished = async (type: 'video' | 'quiz' | 'written', performance?: number) => {
    if (!selectedChapter || !selectedChapter.lessons?.[0] || !user) return;
    
    if (type === 'video') setVideoFinished(true);

    try {
      const payload: any = {
        userId: user.id || user.name,
        lessonId: selectedLesson?.id
      };
      
      if (type === 'video') payload.videoCompleted = true;
      if (type === 'quiz') {
        payload.quizCompleted = true;
        if (performance !== undefined) payload.mastery = performance;
      }
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
        // Simply refetch to get the latest unlocking status from backend
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


  const handleGenerateQuestions = async () => {
    if (!selectedChapter || isGeneratingQuestions) return;
    
    setIsGeneratingQuestions(true);
    try {
      const res = await fetch('/api/ai/generate-written', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: selectedChapter.id,
          chapterTitle: selectedChapter.title,
          subject: (isSocial && part) ? part : subjectKey,
          className: currentClass
        })
      });

      const data = await res.json();
      if (data.questions) {
        // Update local state
        setSelectedChapter({
          ...selectedChapter,
          writtenQuestion: data.questions
        });
        
        // Update available content to keep in sync
        const updatedContent = availableContent.map(ch => 
          ch.id === selectedChapter.id ? { ...ch, writtenQuestion: data.questions } : ch
        );
        setAvailableContent(updatedContent);
      }
    } catch (err) {
      console.error('Failed to generate questions:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedChapter || isGeneratingQuiz) return;
    
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: (isSocial && part) ? part : subjectKey,
          className: currentClass,
          chapterId: selectedChapter.id,
          chapterTitle: selectedChapter.title
        })
      });
      const data = await res.json();
      if (data.questions) {
        // Update both the specific chapter and availableContent to reflect new quiz immediately
        setSelectedChapter({ ...selectedChapter, quiz: data });
        
        const updatedContent = availableContent.map(c => 
          c.id === selectedChapter.id ? { ...c, quiz: data } : c
        );
        setAvailableContent(updatedContent);

        // Reset quiz state
        setCurrentQuizStep(0);
        setQuizScore(0);
        setIsQuizFinished(false);
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    const lesson = chapter.lessons?.[0] || null;
    setSelectedLesson(lesson);
    setVideoFinished(lesson?.progress?.[0]?.videoCompleted || false);
    setActiveTab('video');
    // Reset Quiz
    setCurrentQuizStep(0);
    setQuizScore(0);
    setIsQuizFinished(false);
    setSelectedQuizOption(null);
    setIsCorrect(null);
  };

  // Helper for comprehensive markdown rendering
  const renderMarkdown = (text: string | null) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    // Helper to process bold, italic and highlights in a line
    const processInlines = (str: string) => {
      // Bold (**text**), Italic (*text*)
      return str.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} style={{ color: "var(--primary)", fontWeight: "bold" }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={i} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Horizontal Rules
      if (trimmed === "---") {
        elements.push(<hr key={idx} style={{ border: "0", borderTop: "1px solid rgba(0,0,0,0.1)", margin: "1.5rem 0" }} />);
        return;
      }

      // Headings (Longest first)
      if (trimmed.startsWith("####")) {
        const hText = trimmed.replace(/^####\s*/, "");
        elements.push(<h4 key={idx} style={{ color: "var(--accent)", marginTop: "1rem", marginBottom: "0.4rem", fontSize: "1rem" }}>{processInlines(hText)}</h4>);
        return;
      }
      if (trimmed.startsWith("###")) {
        const hText = trimmed.replace(/^###\s*/, "");
        elements.push(<h3 key={idx} style={{ color: "var(--primary)", marginTop: "1.2rem", marginBottom: "0.5rem", fontSize: "1.15rem" }}>{processInlines(hText)}</h3>);
        return;
      }

      // Bullet points
      const bulletMatch = trimmed.match(/^[*+-]\s+(.*)/);
      if (bulletMatch) {
        const bText = bulletMatch[1];
        elements.push(
          <div key={idx} style={{ display: "flex", gap: "8px", marginLeft: "1.2rem", marginBottom: "6px" }}>
            <span style={{ color: "var(--primary)", fontWeight: "bold" }}>•</span>
            <div style={{ flex: 1 }}>{processInlines(bText)}</div>
          </div>
        );
        return;
      }

      // Empty Lines (Para Breaks)
      if (trimmed === "") {
        elements.push(<div key={idx} style={{ height: "0.8rem" }} />);
        return;
      }

      // Standard Text
      elements.push(<div key={idx} style={{ marginBottom: "6px", lineHeight: "1.6" }}>{processInlines(line)}</div>);
    });

    return elements;
  };

  const handleGenerateNotes = async () => {
    if (!selectedChapter || isGeneratingNotes) return;
    setIsGeneratingNotes(true);
    setChapterNotes(null);
    
    try {
      const prompt = `Generate friendly, fun, and detailed chapter notes and a 2-paragraph summary for a child (Class ${currentClass}) about the chapter: "${selectedChapter.title}". 
      Use emojis, bullet points, and simple language. Keep it very encouraging!`;
      
      const fullContext = part ? `${subjectName} (${part})` : subjectName;
      const response = await getGeminiResponse(prompt, `Subject: ${fullContext}. This is for an 8-12 year old student.`);
      setChapterNotes(response);
    } catch (err) {
      setChapterNotes("I couldn't generate the notes right now. Try again in a bit! 🤖");
    } finally {
      setIsGeneratingNotes(false);
    }
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAiTyping) return;
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAiTyping(true);
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputValue,
          context: {
            subject: part ? `${subjectName} (${part})` : subjectName,
            chapter: selectedChapter?.title,
            class: currentClass
          },
          history: messages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI Error');
      
      setMessages(prev => [...prev, { role: 'ai', content: data.text }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'ai', content: "Bhai, mera brain thoda thak gya hai. Ek baar try again? 🤖" }]);
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
        const questionPrompt = selectedChapter?.writtenQuestion || "Explain this answer and check if it is correct.";
        const result = await analyzeImage(base64Content, `The student is answering this specific question: "${questionPrompt}". Analyze their handwritten work and provide constructive feedback in simple Hinglish.`);
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
                {selectedChapter?.lessons?.every((l: any) => l.progress?.[0]?.videoCompleted) && <CheckCircle2 size={14} color="#4CAF50" style={{ marginLeft: '6px' }} />}
              </button>
              <button className={activeTab === 'quiz' ? styles.active : ''} onClick={() => setActiveTab('quiz')}>
                <CheckCircle size={18} /> Chapter Quiz
                {selectedChapter?.quizCompleted && <CheckCircle2 size={14} color="#4CAF50" style={{ marginLeft: '6px' }} />}
              </button>
              <button className={activeTab === 'practice' ? styles.active : ''} onClick={() => setActiveTab('practice')}>
                <ScanLine size={18} /> Written Practice
                {selectedChapter?.writtenCompleted && <CheckCircle2 size={14} color="#4CAF50" style={{ marginLeft: '6px' }} />}
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
                        chapters={availableContent.map((v: any, index: number) => ({
                          ...v,
                          // Use values from backend if present, fallback for safety
                          isCompleted: v.isCompleted || false,
                          isUnlocked: v.isUnlocked || false,
                          order: v.order || index + 1
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
                        {selectedLesson ? (
                          <CustomYTPlayer 
                            videoId={getYoutubeId(selectedLesson.videoUrl)} 
                            title={selectedLesson.title}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h2>{selectedChapter.title}</h2>
                          {selectedChapter.lessons?.length > 1 && (
                            <div className={styles.lessonSelector} style={{ display: 'flex', gap: '8px' }}>
                              {selectedChapter.lessons.map((lesson: any, idx: number) => (
                                <button 
                                  key={lesson.id}
                                  onClick={() => {
                                    setSelectedLesson(lesson);
                                    setVideoFinished(lesson.progress?.[0]?.videoCompleted || false);
                                  }}
                                  className={selectedLesson?.id === lesson.id ? styles.activeLessonBtn : styles.lessonBtn}
                                  style={{
                                    padding: '6px 15px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: selectedLesson?.id === lesson.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: 'white'
                                  }}
                                >
                                  {lesson.title.toLowerCase().includes('intro') ? 'Intro 🎬' : (lesson.title.toLowerCase().includes('main') ? 'Main 🚀' : `Video ${idx + 1}`)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={styles.videoMeta}>
                          <button onClick={() => handleComponentFinished('video')} className={styles.finishBtn}>
                            {videoFinished ? '✅ Finished!' : 'Mark as Finished'}
                          </button>

                          <button 
                            onClick={handleGenerateNotes} 
                            disabled={isGeneratingNotes}
                            className={styles.advanceBtn}
                            style={{
                              background: 'var(--accent)',
                              color: 'var(--foreground)',
                              padding: '0.8rem 1.5rem',
                              borderRadius: 'var(--radius)',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              opacity: isGeneratingNotes ? 0.7 : 1
                            }}
                          >
                            <Sparkles size={18} />
                            {isGeneratingNotes ? 'Generating...' : 'Advance (AI Notes) 🚀'}
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

                      {chapterNotes && (
                        <div className={styles.notesSection} style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'rgba(255, 230, 109, 0.05)' }}>
                          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Star size={20} color="var(--accent)" fill="var(--accent)" /> 
                            Fun Chapter Notes & Summary
                          </h3>
                          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6' }}>
                            {renderMarkdown(chapterNotes)}
                          </div>
                          <button 
                            onClick={() => window.print()}
                            className={styles.pdfBtn}
                            style={{ marginTop: '1.5rem', background: '#333' }}
                          >
                            <FileText size={18} /> Print as PDF (Beta)
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      <Video size={48} />
                      <p>No videos found for this class yet!</p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'quiz' ? (
                <div className={styles.quizArea}>
                  {!selectedChapter?.quiz?.questions || selectedChapter.quiz.questions.length === 0 ? (
                    <div className={styles.lockedState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
                      <Lock size={48} color="var(--border)" />
                      <p style={{ marginTop: '1rem', color: '#666', marginBottom: '1.5rem' }}>No quiz found for this chapter yet.</p>
                      <button 
                        onClick={handleGenerateQuiz}
                        disabled={isGeneratingQuiz}
                        className={styles.advanceBtn}
                        style={{
                          background: 'var(--primary)',
                          color: 'white',
                          padding: '0.8rem 1.5rem',
                          borderRadius: 'var(--radius)',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          opacity: isGeneratingQuiz ? 0.7 : 1
                        }}
                      >
                        <Sparkles size={18} />
                        {isGeneratingQuiz ? 'Generating...' : 'Start New Quiz AI ✨'}
                      </button>
                    </div>
                  ) : isQuizFinished ? (
                    <div className={styles.lockedState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
                      <Trophy size={64} style={{ color: "var(--accent)", marginBottom: '1.5rem' }} />
                      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{Math.round((quizScore / selectedChapter.quiz.questions.length) * 100)}% Mastery! 🏆</h2>
                      <p style={{ marginBottom: '2rem', color: '#666' }}>You got {quizScore} out of {selectedChapter.quiz.questions.length} correct!</p>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => { 
                          handleComponentFinished('quiz', Math.round((quizScore / selectedChapter.quiz.questions.length) * 100)); 
                          setActiveTab('index'); 
                        }} className={styles.finishBtn}>Finish & Save Progress</button>
                        <button onClick={() => { setCurrentQuizStep(0); setQuizScore(0); setIsQuizFinished(false); setSelectedQuizOption(null); setIsCorrect(null); }} style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Try Again</button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.activeQuiz}>
                      <div className={styles.quizHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontSize: '0.9rem', color: '#666' }}>Question {currentQuizStep + 1} of {selectedChapter.quiz.questions.length}</span>
                          <button 
                            onClick={handleGenerateQuiz}
                            disabled={isGeneratingQuiz}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: 'var(--primary)', 
                              fontSize: '0.85rem', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              opacity: isGeneratingQuiz ? 0.5 : 1
                            }}
                          >
                            <Sparkles size={14} /> {isGeneratingQuiz ? 'Generating...' : 'New Quiz AI ✨'}
                          </button>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', width: '200px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--primary)', width: `${((currentQuizStep + 1) / selectedChapter.quiz.questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
                        </div>
                      </div>

                      <div className={styles.questionCard}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>{selectedChapter.quiz.questions[currentQuizStep].text}</h2>
                        
                        {selectedChapter.quiz.questions[currentQuizStep].imageUrl && (
                          <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img src={selectedChapter.quiz.questions[currentQuizStep].imageUrl} alt="Quiz Visual" style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </div>
                        )}

                        <div className={styles.optionsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                          {selectedChapter.quiz.questions[currentQuizStep].options.map((option: string, idx: number) => {
                            let style: any = { padding: '1.2rem', borderRadius: '12px', borderStyle: 'solid', borderWidth: '2px', borderColor: 'var(--border)', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(255,255,255,0.5)', textAlign: 'left', fontSize: '1.05rem', color: 'inherit' };
                            
                            if (selectedQuizOption !== null) {
                              if (idx === selectedChapter.quiz.questions[currentQuizStep].correctAnswer) {
                                style.background = 'rgba(76, 175, 80, 0.1)';
                                style.borderColor = '#4CAF50';
                              } else if (idx === selectedQuizOption) {
                                style.background = 'rgba(244, 67, 54, 0.1)';
                                style.borderColor = '#F44336';
                              }
                            }

                            return (
                              <button 
                                key={idx} 
                                style={style} 
                                disabled={selectedQuizOption !== null}
                                onClick={() => {
                                  setSelectedQuizOption(idx);
                                  const correct = idx === selectedChapter.quiz.questions[currentQuizStep].correctAnswer;
                                  setIsCorrect(correct);
                                  if (correct) setQuizScore(prev => prev + 1);
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {selectedQuizOption !== null && (
                          <div className={`animate-fade-in`} style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: isCorrect ? 'rgba(76, 175, 80, 0.05)' : 'rgba(244, 67, 54, 0.05)', borderLeft: `5px solid ${isCorrect ? '#4CAF50' : '#F44336'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                              {isCorrect ? <Sparkles size={20} color="#4CAF50" /> : <div style={{ color: '#F44336', fontWeight: 'bold' }}>Oops!</div>}
                              <strong style={{ color: isCorrect ? '#2E7D32' : '#C62828' }}>{isCorrect ? "Shabash! That's correct!" : "Not quite right!"}</strong>
                            </div>
                            <p style={{ color: '#555', fontSize: '0.95rem' }}>{selectedChapter.quiz.questions[currentQuizStep].explanation}</p>
                            <button 
                              onClick={() => {
                                if (currentQuizStep + 1 < selectedChapter.quiz.questions.length) {
                                  setCurrentQuizStep(prev => prev + 1);
                                  setSelectedQuizOption(null);
                                  setIsCorrect(null);
                                } else {
                                  setIsQuizFinished(true);
                                }
                              }} 
                              className={styles.finishBtn} 
                              style={{ marginTop: '1.5rem', width: 'auto' }}
                            >
                              {currentQuizStep + 1 < selectedChapter.quiz.questions.length ? 'Next Question ➡️' : 'See Results 🏆'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.practiceArea}>
                  <h3>Teacher AI Checker 📝</h3>
                  <div style={{ background: 'rgba(255, 230, 109, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--accent)', marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Star size={18} fill="var(--accent)" color="var(--accent)" /> 
                        Chapter Challenge Set (5 Questions)
                      </h4>
                      <button 
                        onClick={handleGenerateQuestions}
                        disabled={isGeneratingQuestions}
                        className={styles.aiButton}
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '6px 12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          background: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: isGeneratingQuestions ? 0.6 : 1
                        }}
                      >
                        <Sparkles size={14} color="var(--accent)" />
                        {isGeneratingQuestions ? 'Generating...' : 'New Challenge AI ✨'}
                      </button>
                    </div>
                    
                    {isGeneratingQuestions ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        <div className={styles.pulseLoader}></div>
                        <p style={{ marginTop: '1rem' }}>Teacher AI is thinking of fresh challenges for you...</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {(selectedChapter?.writtenQuestion || "").split('\n').filter((q: string) => q.trim().match(/^\d+\./)).map((q: string, idx: number) => (
                          <div key={idx} style={{ background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: `4px solid ${q.includes('[Easy]') ? '#4CAF50' : q.includes('[Medium]') ? '#FF9800' : '#F44336'}` }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: q.includes('[Easy]') ? '#4CAF50' : q.includes('[Medium]') ? '#FF9800' : '#F44336', display: 'block', marginBottom: '4px' }}>
                              {q.includes('[Easy]') ? '🟢 Easy' : q.includes('[Medium]') ? '🟠 Medium' : '🔴 Hard'}
                            </span>
                            <p style={{ fontSize: '1rem', color: '#111', fontWeight: 500 }}>{q.replace(/^\d+\.\s*\[.*?\]\s*/, '')}</p>
                          </div>
                        ))}
                        {!(selectedChapter?.writtenQuestion || "").includes('1.') && (
                          <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#333' }}>
                            {selectedChapter?.writtenQuestion || "Write a summary of what you learned in this chapter."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ color: '#444', fontWeight: 600 }}>📝 Where to write?</p>
                    <ol style={{ marginLeft: '1.5rem', color: '#555', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      <li>Take a blank piece of paper or your notebook.</li>
                      <li>Write the answer to the challenge above by hand.</li>
                      <li>Click the box below to scan/upload a photo of your page!</li>
                    </ol>
                  </div>
                  
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
                      {m.role === 'ai' ? renderMarkdown(m.content) : m.content}
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
