import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuizStore } from '@/store/useQuizStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  Timer,
  AlertCircle,
  CheckCircle2,
  X,
  Zap
} from 'lucide-react';

const QuizInterface = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentQuiz, 
    currentQuestionIndex, 
    answers, 
    timeRemaining, 
    isQuizActive,
    startQuiz, 
    answerQuestion, 
    nextQuestion, 
    finishQuiz, 
    setTimeRemaining 
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (quizId && !isQuizActive) {
      startQuiz(quizId);
    }
  }, [quizId, startQuiz, isQuizActive]);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (isQuizActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isQuizActive) {
      handleFinishQuiz();
    }
  }, [timeRemaining, isQuizActive, setTimeRemaining]);

  useEffect(() => {
    if (currentQuiz && answers[currentQuestionIndex] !== undefined) {
      setSelectedAnswer(answers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, answers, currentQuiz]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      nextQuestion();
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    finishQuiz();
    setShowResults(true);
    
    const score = calculateScore();
    const percentage = (score / (currentQuiz?.questions.length || 1)) * 100;
    
    if (percentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${currentQuiz?.questions.length} (${Math.round(percentage)}%)`,
    });
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining > 60) return 'text-green-600';
    if (timeRemaining > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / currentQuiz.questions.length) * 100;
    
    return (
      <div className="min-h-screen px-4 py-12">
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-maersk-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              {percentage >= 80 ? (
                <CheckCircle2 className="h-10 w-10 text-white" />
              ) : (
                <Flag className="h-10 w-10 text-white" />
              )}
            </div>
            
            <h1 className="font-heading text-4xl font-bold gradient-text mb-2">
              Quiz Completed!
            </h1>
            <p className="text-xl text-muted-foreground">
              {currentQuiz.title}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {score}/{currentQuiz.questions.length}
                </div>
                <p className="text-muted-foreground">Questions Correct</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {Math.round(percentage)}%
                </div>
                <p className="text-muted-foreground">Final Score</p>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {formatTime(currentQuiz.timeLimit - timeRemaining)}
                </div>
                <p className="text-muted-foreground">Time Taken</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-bold mb-4">Question Review</h3>
              <div className="space-y-4">
                {currentQuiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className="p-4 bg-background/50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-foreground flex-1">
                          {index + 1}. {question.question}
                        </h4>
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-3" />
                        ) : (
                          <X className="h-5 w-5 text-red-600 flex-shrink-0 ml-3" />
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Your answer:</span>
                          <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Correct answer:</span>
                            <span className="text-green-600">
                              {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="btn-glass"
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => {
                setShowResults(false);
                startQuiz(currentQuiz.id);
              }}
              className="btn-hero"
            >
              <Zap className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {currentQuiz.title}
              </h1>
              <p className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Badge variant="outline" className="px-3 py-1">
                {currentQuiz.difficulty}
              </Badge>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card mb-8">
              <CardContent className="p-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
                  {currentQuestion.question}
                </h2>
                
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 ${
                        selectedAnswer === index
                          ? 'border-maersk-blue bg-maersk-blue/10 text-maersk-blue'
                          : 'border-border bg-background/50 hover:border-maersk-light-blue hover:bg-maersk-light-blue/10'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                          selectedAnswer === index
                            ? 'border-maersk-blue bg-maersk-blue text-white'
                            : 'border-muted-foreground text-muted-foreground'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                // Add previous question functionality if needed
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="btn-glass"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleFinishQuiz}
              className="btn-glass text-red-600 hover:text-red-700"
            >
              <Flag className="h-4 w-4 mr-2" />
              Finish Quiz
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="btn-hero"
            >
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizInterface;