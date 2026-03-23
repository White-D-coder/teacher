// Mock Prisma client to allow development without a live MongoDB connection
// It uses localStorage to simulate database persistence

const getStore = (key: string) => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const setStore = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const prismaMock = {
  user: {
    findFirst: async (args: any) => {
      const users = getStore('db_users');
      return users.find((u: any) => u.name === args.where.name && u.secretCode === args.where.secretCode);
    },
    create: async (args: any) => {
      const users = getStore('db_users');
      const newUser = { id: Math.random().toString(36).substr(2, 9), ...args.data };
      users.push(newUser);
      setStore('db_users', users);
      return newUser;
    }
  },
  lesson: {
    findMany: async (args: any) => {
      const lessons = getStore('uploaded_content');
      return lessons.filter((l: any) => l.targetClass === args.where.targetClass && l.subject === args.where.subject);
    },
    create: async (args: any) => {
      const lessons = getStore('uploaded_content');
      const newLesson = { id: Math.random().toString(36).substr(2, 9), ...args.data };
      lessons.push(newLesson);
      setStore('uploaded_content', lessons);
      return newLesson;
    }
  },
  userProgress: {
    findUnique: async (args: any) => {
      const progress = getStore('db_progress');
      return progress.find((p: any) => p.userId === args.where.userId_lessonId.userId && p.lessonId === args.where.userId_lessonId.lessonId);
    },
    upsert: async (args: any) => {
      let progress = getStore('db_progress');
      const index = progress.findIndex((p: any) => p.userId === args.where.userId_lessonId.userId && p.lessonId === args.where.userId_lessonId.lessonId);
      const data = index > -1 ? { ...progress[index], ...args.update } : { id: Math.random().toString(36).substr(2, 9), ...args.create };
      
      if (index > -1) progress[index] = data;
      else progress.push(data);
      
      setStore('db_progress', progress);
      return data;
    }
  }
};
