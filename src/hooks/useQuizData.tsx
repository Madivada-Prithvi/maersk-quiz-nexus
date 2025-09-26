import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  time_limit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
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

export function useQuizData() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading quizzes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch user results
  const fetchResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading results",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Create quiz (admin only)
  const createQuiz = async (quizData: Omit<Quiz, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user || profile?.role !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only admins can create quizzes",
        variant: "destructive",
      });
      return { error: new Error('Permission denied') };
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert([{
          ...quizData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setQuizzes(prev => [data, ...prev]);
      toast({
        title: "Quiz created",
        description: "Your quiz has been created successfully",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  // Update quiz (admin only)
  const updateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
    if (!user || profile?.role !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only admins can update quizzes",
        variant: "destructive",
      });
      return { error: new Error('Permission denied') };
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', quizId)
        .select()
        .single();

      if (error) throw error;

      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, ...data } : quiz
      ));

      toast({
        title: "Quiz updated",
        description: "Quiz has been updated successfully",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating quiz",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  // Delete quiz (admin only)
  const deleteQuiz = async (quizId: string) => {
    if (!user || profile?.role !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only admins can delete quizzes",
        variant: "destructive",
      });
      return { error: new Error('Permission denied') };
    }

    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      toast({
        title: "Quiz deleted",
        description: "Quiz has been deleted successfully",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error deleting quiz",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  // Submit quiz result
  const submitQuizResult = async (resultData: Omit<QuizResult, 'id' | 'user_id' | 'completed_at'>) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([{
          ...resultData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setResults(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error submitting result",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchQuizzes();
      if (user) {
        await fetchResults();
      }
      setLoading(false);
    };

    loadInitialData();
  }, [user]);

  return {
    quizzes,
    results,
    loading,
    fetchQuizzes,
    fetchResults,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuizResult,
  };
}