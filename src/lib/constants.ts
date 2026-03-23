import { Calculator, Microscope, Book, Languages, Globe, Music } from 'lucide-react';

export const CLASS_SUBJECTS: { [key: string]: string[] } = {
  'Class 7': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
  'Class 8': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
  'Class 9': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
  'Class 10': ['Math', 'Science', 'Social Science', 'English', 'Hindi'],
  'Class 11': ['Math', 'Science', 'English', 'Hindi', 'Musical World'],
  'Class 12': ['Math', 'Science', 'English', 'Hindi', 'Musical World'],
};

export const SUBJECT_METADATA: { [key: string]: { icon: any, color: string, id: string, name: string } } = {
  'Math': { id: 'math', name: 'Math', icon: Calculator, color: '#FF6B6B' },
  'Science': { id: 'science', name: 'Science', icon: Microscope, color: '#4ECDC4' },
  'Social Science': { id: 'social', name: 'Social Science', icon: Globe, color: '#FFE66D' },
  'English': { id: 'english', name: 'English', icon: Book, color: '#4D96FF' },
  'Hindi': { id: 'hindi', name: 'Hindi', icon: Languages, color: '#6BCB77' },
  'Musical World': { id: 'music', name: 'Musical World', icon: Music, color: '#9B59B6' },
};

export const getSubjectById = (id: string) => {
  return Object.values(SUBJECT_METADATA).find(s => s.id === id);
};

export const getSubjectKeyById = (id: string) => {
  return Object.keys(SUBJECT_METADATA).find(key => SUBJECT_METADATA[key].id === id) || 'Subject';
};

export const getSubjectsForClass = (className: string) => {
  const subjectNames = CLASS_SUBJECTS[className] || CLASS_SUBJECTS['Class 7'];
  return subjectNames.map(name => SUBJECT_METADATA[name]);
};
