import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  time_limit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  created_at: string;
  is_published: boolean;
  created_by: string;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: number[];
  score: number;
  total_questions: number;
  time_spent: number;
  completed_at: string;
}

export const useQuizData = () => {
  const { user, profile } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_published', true);

      if (error) throw error;
      setQuizzes((data || []).map(quiz => ({
        ...quiz,
        questions: Array.isArray(quiz.questions) ? quiz.questions as unknown as Question[] : []
      })) as unknown as Quiz[]);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setResults((data || []).map(result => ({
        ...result,
        answers: Array.isArray(result.answers) ? result.answers as unknown as number[] : []
      })) as unknown as QuizResult[]);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const createQuiz = async (quizData: Omit<Quiz, 'id' | 'created_at' | 'created_by'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quizData,
          created_by: user.id,
          questions: quizData.questions as any
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh quizzes if it's published
      if (data.is_published) {
        await fetchQuizzes();
      }
      
      return data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };

  const updateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates as any)
        .eq('id', quizId)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh quizzes
      await fetchQuizzes();
      
      return data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;
      
      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  };

  const submitQuizResult = async (result: Omit<QuizResult, 'id' | 'completed_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          ...result,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh user results
      await fetchUserResults();
      
      return data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  };

  const getQuizById = (quizId: string) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const getUserResults = () => {
    return results;
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserResults();
    }
  }, [user]);

  return {
    quizzes,
    results,
    loading,
    fetchQuizzes,
    fetchUserResults,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizResult,
    getQuizById,
    getUserResults,
  };
};