import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizData, Quiz } from './useQuizData';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useQuizInterface = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getQuizById, submitQuizResult } = useQuizData();
  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (quizId) {
      const quiz = getQuizById(quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        setTimeRemaining(quiz.time_limit);
        setIsQuizActive(true);
        setAnswers([]);
        setCurrentQuestionIndex(0);
      }
    }
  }, [quizId, getQuizById]);

  useEffect(() => {
    if (currentQuiz && answers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(answers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, answers, currentQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    if (!currentQuiz || !user) return;

    const score = calculateScore();
    const timeSpent = currentQuiz.time_limit - timeRemaining;

    try {
      await submitQuizResult({
        quiz_id: currentQuiz.id,
        user_id: user.id,
        answers,
        score,
        total_questions: currentQuiz.questions.length,
        time_spent: timeSpent,
      });

      setIsQuizActive(false);
      setShowResults(true);

      const percentage = (score / currentQuiz.questions.length) * 100;
      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}/${currentQuiz.questions.length} (${Math.round(percentage)}%)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz results",
        variant: "destructive"
      });
    }
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    let score = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const startNewQuiz = () => {
    if (currentQuiz) {
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setTimeRemaining(currentQuiz.time_limit);
      setIsQuizActive(true);
      setShowResults(false);
      setSelectedAnswer(null);
    }
  };

  return {
    currentQuiz,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isQuizActive,
    selectedAnswer,
    showResults,
    setShowResults,
    setTimeRemaining,
    handleAnswerSelect,
    handleNext,
    handleFinishQuiz,
    calculateScore,
    startNewQuiz,
    navigate
  };
};