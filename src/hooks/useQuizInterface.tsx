import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizData, Quiz, Question } from '@/hooks/useQuizData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useQuizInterface() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes, submitQuizResult } = useQuizData();
  const { toast } = useToast();

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find and set current quiz
  useEffect(() => {
    if (quizId && quizzes.length > 0) {
      const quiz = quizzes.find(q => q.id === quizId);
      if (quiz && quiz.is_published) {
        setCurrentQuiz(quiz);
        setTimeRemaining(quiz.time_limit);
        setAnswers(new Array(quiz.questions.length).fill(-1));
      } else {
        toast({
          title: "Quiz not found",
          description: "The quiz you're looking for doesn't exist or isn't published.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [quizId, quizzes, navigate, toast]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  const startQuiz = useCallback(() => {
    if (currentQuiz) {
      setIsQuizActive(true);
      setCurrentQuestionIndex(0);
      setAnswers(new Array(currentQuiz.questions.length).fill(-1));
      setTimeRemaining(currentQuiz.time_limit);
    }
  }, [currentQuiz]);

  const answerQuestion = useCallback((answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuiz, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const finishQuiz = useCallback(async () => {
    if (!currentQuiz || !user || isSubmitting) return;

    setIsSubmitting(true);
    setIsQuizActive(false);

    try {
      // Calculate score
      let score = 0;
      currentQuiz.questions.forEach((question: Question, index: number) => {
        if (answers[index] === question.correctAnswer) {
          score++;
        }
      });

      const timeSpent = currentQuiz.time_limit - timeRemaining;

      const { error } = await submitQuizResult({
        quiz_id: currentQuiz.id,
        answers,
        score,
        total_questions: currentQuiz.questions.length,
        time_spent: timeSpent,
      });

      if (!error) {
        toast({
          title: "Quiz completed!",
          description: `You scored ${score}/${currentQuiz.questions.length}`,
        });
        navigate('/analytics');
      }
    } catch (error) {
      toast({
        title: "Error submitting quiz",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuiz, user, answers, timeRemaining, submitQuizResult, toast, navigate, isSubmitting]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const progress = currentQuiz 
    ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 
    : 0;

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuiz 
    ? currentQuestionIndex === currentQuiz.questions.length - 1 
    : false;

  return {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isQuizActive,
    isSubmitting,
    progress,
    isLastQuestion,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    formatTime,
  };
}