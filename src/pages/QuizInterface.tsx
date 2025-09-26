import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuizInterface } from '@/hooks/useQuizInterface';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  Timer,
  CheckCircle2,
  X,
  Zap,
  Play
} from 'lucide-react';

const QuizInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isQuizActive,
    isSubmitting,
    isLastQuestion,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    formatTime,
  } = useQuizInterface();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update selected answer when question changes
  React.useEffect(() => {
    if (currentQuestion && answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] !== -1) {
      setSelectedAnswer(answers[currentQuestionIndex]);
    } else {
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, answers, currentQuestion]);

  // Window size effect for confetti
  React.useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    answerQuestion(answerIndex);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      nextQuestion();
    }
  };

  const handleFinishQuiz = async () => {
    await finishQuiz();
    setShowResults(true);
    
    const score = calculateScore();
    const percentage = (score / (currentQuiz?.questions.length || 1)) * 100;
    
    if (percentage >= 80) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
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

  const getTimeColor = () => {
    if (timeRemaining > 60) return 'text-green-600';
    if (timeRemaining > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading state
  if (!currentQuiz && !showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maersk-blue"></div>
      </div>
    );
  }

  // Show quiz not started state
  if (currentQuiz && !isQuizActive && !showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass-card max-w-2xl w-full text-center">
          <CardContent className="p-8">
            <h1 className="font-heading text-3xl font-bold gradient-text mb-4">
              {currentQuiz.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {currentQuiz.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-foreground">{currentQuiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-foreground">{formatTime(currentQuiz.time_limit)}</div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
              <div className="p-4 bg-background/50 rounded-xl">
                <div className="text-2xl font-bold text-foreground">{currentQuiz.difficulty}</div>
                <div className="text-sm text-muted-foreground">Difficulty</div>
              </div>
            </div>
            
            <Button onClick={startQuiz} className="btn-hero text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Start Quiz
            </Button>
          </CardContent>
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
                startQuiz();
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

  // Active quiz interface
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maersk-blue"></div>
      </div>
    );
  }

  const questionProgress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

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
          
          <Progress value={questionProgress} className="h-2" />
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
            onClick={previousQuestion}
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
              disabled={selectedAnswer === null || isSubmitting}
              className="btn-hero"
            >
              {isLastQuestion ? 'Finish' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizInterface;