import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in seconds
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  createdAt: Date;
  isPublished: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface QuizState {
  user: User | null;
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  isQuizActive: boolean;
  results: QuizResult[];
  isLoading: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  
  // Quiz actions
  setQuizzes: (quizzes: Quiz[]) => void;
  startQuiz: (quizId: string) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  setTimeRemaining: (time: number) => void;
  
  // Admin actions
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => void;
  updateQuiz: (quizId: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (quizId: string) => void;
  publishQuiz: (quizId: string) => void;
  
  // Results actions
  addResult: (result: Omit<QuizResult, 'id'>) => void;
  getResultsByUser: (userId: string) => QuizResult[];
}

const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Maersk Maritime Knowledge',
    description: 'Test your knowledge about maritime operations and Maersk history',
    difficulty: 'Medium',
    category: 'Maritime',
    timeLimit: 300,
    isPublished: true,
    createdAt: new Date(),
    questions: [
      {
        id: '1',
        question: 'In what year was A.P. Moller - Maersk founded?',
        options: ['1904', '1912', '1920', '1928'],
        correctAnswer: 0
      },
      {
        id: '2',
        question: 'What is the largest container ship class operated by Maersk?',
        options: ['Triple E Class', 'Ultra Large Container Vessel', 'Emma Maersk Class', 'MSC Gülsün Class'],
        correctAnswer: 0
      },
      {
        id: '3',
        question: 'Which color is associated with Maersk containers?',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correctAnswer: 1
      },
      {
        id: '4',
        question: 'What does TEU stand for in shipping?',
        options: ['Total Equipment Unit', 'Twenty-foot Equivalent Unit', 'Transport Efficiency Unit', 'Terminal Exchange Unit'],
        correctAnswer: 1
      },
      {
        id: '5',
        question: 'Where is Maersk headquarters located?',
        options: ['Oslo, Norway', 'Hamburg, Germany', 'Copenhagen, Denmark', 'Stockholm, Sweden'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: '2',
    title: 'Supply Chain Fundamentals',
    description: 'Essential concepts in modern supply chain management',
    difficulty: 'Easy',
    category: 'Logistics',
    timeLimit: 240,
    isPublished: true,
    createdAt: new Date(),
    questions: [
      {
        id: '6',
        question: 'What is the primary goal of supply chain management?',
        options: ['Minimize costs', 'Maximize efficiency', 'Optimize end-to-end value delivery', 'Reduce inventory'],
        correctAnswer: 2
      },
      {
        id: '7',
        question: 'Which term describes goods in process of being transported?',
        options: ['Inventory', 'Stock', 'Cargo', 'Freight'],
        correctAnswer: 3
      },
      {
        id: '8',
        question: 'What does JIT stand for in logistics?',
        options: ['Just In Time', 'Joint Inventory Tracking', 'Journey Integration Technology', 'Job Information Terminal'],
        correctAnswer: 0
      }
    ]
  }
];

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      user: null,
      quizzes: sampleQuizzes,
      currentQuiz: null,
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 0,
      isQuizActive: false,
      results: [],
      isLoading: false,
      
      // Auth actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const isAdmin = email.includes('admin');
        const user: User = {
          id: Math.random().toString(36),
          email,
          name: isAdmin ? 'Admin User' : 'Test User',
          role: isAdmin ? 'admin' : 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        
        set({ user, isLoading: false });
      },
      
      logout: () => {
        set({ 
          user: null, 
          currentQuiz: null, 
          isQuizActive: false, 
          answers: [], 
          currentQuestionIndex: 0 
        });
      },
      
      setUser: (user: User) => set({ user }),
      
      // Quiz actions
      setQuizzes: (quizzes: Quiz[]) => set({ quizzes }),
      
      startQuiz: (quizId: string) => {
        const quiz = get().quizzes.find(q => q.id === quizId);
        if (quiz) {
          set({
            currentQuiz: quiz,
            currentQuestionIndex: 0,
            answers: [],
            timeRemaining: quiz.timeLimit,
            isQuizActive: true
          });
        }
      },
      
      answerQuestion: (answerIndex: number) => {
        const { answers, currentQuestionIndex } = get();
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answerIndex;
        set({ answers: newAnswers });
      },
      
      nextQuestion: () => {
        const { currentQuestionIndex, currentQuiz } = get();
        if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },
      
      finishQuiz: () => {
        const { currentQuiz, answers, user, timeRemaining } = get();
        if (currentQuiz && user) {
          let score = 0;
          currentQuiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
              score++;
            }
          });
          
          const result: QuizResult = {
            id: Math.random().toString(36),
            quizId: currentQuiz.id,
            userId: user.id,
            answers,
            score,
            totalQuestions: currentQuiz.questions.length,
            timeSpent: currentQuiz.timeLimit - timeRemaining,
            completedAt: new Date()
          };
          
          set(state => ({
            results: [...state.results, result],
            isQuizActive: false,
            currentQuiz: null,
            currentQuestionIndex: 0,
            answers: []
          }));
        }
      },
      
      setTimeRemaining: (time: number) => set({ timeRemaining: time }),
      
      // Admin actions
      createQuiz: (quizData) => {
        const newQuiz: Quiz = {
          ...quizData,
          id: Math.random().toString(36),
          createdAt: new Date()
        };
        set(state => ({ quizzes: [...state.quizzes, newQuiz] }));
      },
      
      updateQuiz: (quizId: string, updates: Partial<Quiz>) => {
        set(state => ({
          quizzes: state.quizzes.map(quiz =>
            quiz.id === quizId ? { ...quiz, ...updates } : quiz
          )
        }));
      },
      
      deleteQuiz: (quizId: string) => {
        set(state => ({
          quizzes: state.quizzes.filter(quiz => quiz.id !== quizId)
        }));
      },
      
      publishQuiz: (quizId: string) => {
        set(state => ({
          quizzes: state.quizzes.map(quiz =>
            quiz.id === quizId ? { ...quiz, isPublished: !quiz.isPublished } : quiz
          )
        }));
      },
      
      // Results actions
      addResult: (resultData) => {
        const result: QuizResult = {
          ...resultData,
          id: Math.random().toString(36)
        };
        set(state => ({ results: [...state.results, result] }));
      },
      
      getResultsByUser: (userId: string) => {
        return get().results.filter(result => result.userId === userId);
      }
    }),
    {
      name: 'quiz-store',
    }
  )
);