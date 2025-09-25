import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useQuizData } from '@/hooks/useQuizData';
import { 
  Play, 
  Clock, 
  Users, 
  Trophy, 
  BookOpen, 
  TrendingUp,
  Star,
  Timer,
  Target,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { quizzes, getUserResults } = useQuizData();
  const userResults = getUserResults();
  
  const publishedQuizzes = quizzes.filter(quiz => quiz.is_published);
  
  const stats = {
    totalQuizzes: publishedQuizzes.length,
    completedQuizzes: userResults.length,
    averageScore: userResults.length > 0 
      ? Math.round(userResults.reduce((acc, result) => acc + (result.score / result.total_questions * 100), 0) / userResults.length)
      : 0,
    totalTime: userResults.reduce((acc, result) => acc + result.time_spent, 0)
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-maersk-light-blue/20 text-maersk-blue border-maersk-blue/30';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold gradient-text mb-2">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey with our latest quizzes
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</p>
                </div>
                <div className="p-3 bg-maersk-gradient rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{stats.completedQuizzes}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                  <p className="text-2xl font-bold text-foreground">{formatTime(stats.totalTime)}</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Performance */}
        {userResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-maersk-blue" />
                  <span>Recent Performance</span>
                </CardTitle>
                <CardDescription>Your latest quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userResults.slice(-3).reverse().map((result) => {
                    const quiz = quizzes.find(q => q.id === result.quiz_id);
                    const scorePercentage = (result.score / result.total_questions) * 100;
                    
                    return (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{quiz?.title}</h4>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>{result.score}/{result.total_questions}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Timer className="h-4 w-4" />
                              <span>{formatTime(result.time_spent)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{Math.round(scorePercentage)}%</div>
                          <Progress value={scorePercentage} className="w-20 mt-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Available Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-foreground">Available Quizzes</h2>
            <Badge variant="secondary" className="px-3 py-1">
              {publishedQuizzes.length} Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedQuizzes.map((quiz, index) => {
              const userResult = userResults.find(result => result.quiz_id === quiz.id);
              const isCompleted = !!userResult;
              const scorePercentage = userResult ? (userResult.score / userResult.total_questions) * 100 : 0;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass-card h-full hover:shadow-xl hover:shadow-maersk-blue/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-maersk-gradient opacity-10 rounded-full blur-2xl" />
                    
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-foreground mb-2">
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {quiz.description}
                          </CardDescription>
                        </div>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{Math.round(scorePercentage)}%</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{quiz.questions.length}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(quiz.time_limit)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {quiz.category}
                        </div>
                        
                        <Button asChild className="btn-hero group">
                          <Link to={`/quiz/${quiz.id}`} className="flex items-center space-x-2">
                            {isCompleted ? (
                              <>
                                <Zap className="h-4 w-4" />
                                <span>Retake</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Start</span>
                              </>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;