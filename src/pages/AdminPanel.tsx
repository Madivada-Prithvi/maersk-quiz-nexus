import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQuizStore, Quiz, Question } from '@/store/useQuizStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Settings,
  Users,
  BarChart3,
  BookOpen,
  Clock,
  Target
} from 'lucide-react';

const AdminPanel = () => {
  const { quizzes, createQuiz, updateQuiz, deleteQuiz, publishQuiz, results } = useQuizStore();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    category: '',
    timeLimit: 300,
    isPublished: false,
    questions: [] as Omit<Question, 'id'>[]
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const handleCreateQuiz = () => {
    if (!newQuiz.title || !newQuiz.description || !newQuiz.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (newQuiz.questions.length === 0) {
      toast({
        title: "No Questions",
        description: "Please add at least one question to the quiz",
        variant: "destructive"
      });
      return;
    }

    const questionsWithIds = newQuiz.questions.map((q, index) => ({
      ...q,
      id: (Date.now() + index).toString()
    }));

    createQuiz({
      ...newQuiz,
      questions: questionsWithIds
    });

    toast({
      title: "Quiz Created",
      description: `${newQuiz.title} has been created successfully`,
    });

    // Reset form
    setNewQuiz({
      title: '',
      description: '',
      difficulty: 'Medium',
      category: '',
      timeLimit: 300,
      isPublished: false,
      questions: []
    });
    setIsCreateModalOpen(false);
  };

  const addQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: "Incomplete Question",
        description: "Please fill in the question and all options",
        variant: "destructive"
      });
      return;
    }

    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion }]
    }));

    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });

    toast({
      title: "Question Added",
      description: "Question has been added to the quiz",
    });
  };

  const removeQuestion = (index: number) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handlePublishToggle = (quizId: string) => {
    publishQuiz(quizId);
    const quiz = quizzes.find(q => q.id === quizId);
    toast({
      title: quiz?.isPublished ? "Quiz Unpublished" : "Quiz Published",
      description: quiz?.isPublished 
        ? "Quiz is now hidden from users" 
        : "Quiz is now available to users",
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    deleteQuiz(quizId);
    toast({
      title: "Quiz Deleted",
      description: `${quiz?.title} has been deleted`,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const getQuizStats = (quizId: string) => {
    const quizResults = results.filter(result => result.quizId === quizId);
    const averageScore = quizResults.length > 0 
      ? quizResults.reduce((acc, result) => acc + (result.score / result.totalQuestions * 100), 0) / quizResults.length
      : 0;
    
    return {
      attempts: quizResults.length,
      averageScore: Math.round(averageScore)
    };
  };

  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter(q => q.isPublished).length;
  const totalAttempts = results.length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, result) => acc + (result.score / result.totalQuestions * 100), 0) / results.length)
    : 0;

  return (
    <div className="min-h-screen px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold gradient-text mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage quizzes, monitor performance, and control platform settings
              </p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl gradient-text">
                    Create New Quiz
                  </DialogTitle>
                  <DialogDescription>
                    Build a comprehensive quiz with multiple questions and customizable settings
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Quiz Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Quiz Title</Label>
                      <Input
                        id="title"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter quiz title"
                        className="glass"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newQuiz.category}
                        onChange={(e) => setNewQuiz(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Maritime, Logistics"
                        className="glass"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newQuiz.description}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this quiz covers"
                      className="glass"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={newQuiz.difficulty}
                        onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => 
                          setNewQuiz(prev => ({ ...prev, difficulty: value }))
                        }
                      >
                        <SelectTrigger className="glass">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        value={newQuiz.timeLimit / 60}
                        onChange={(e) => setNewQuiz(prev => ({ 
                          ...prev, 
                          timeLimit: parseInt(e.target.value) * 60 
                        }))}
                        min="1"
                        max="120"
                        className="glass"
                      />
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-heading text-xl font-bold mb-4">Questions</h3>
                    
                    {/* Add Question Form */}
                    <Card className="glass-card mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Add Question</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="question">Question</Label>
                          <Textarea
                            id="question"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion(prev => ({ 
                              ...prev, 
                              question: e.target.value 
                            }))}
                            placeholder="Enter your question here"
                            className="glass"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {newQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="correctAnswer"
                                  checked={newQuestion.correctAnswer === index}
                                  onChange={() => setNewQuestion(prev => ({ 
                                    ...prev, 
                                    correctAnswer: index 
                                  }))}
                                  className="text-maersk-blue"
                                />
                                <Label className="text-sm">
                                  {String.fromCharCode(65 + index)}
                                </Label>
                              </div>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newQuestion.options];
                                  newOptions[index] = e.target.value;
                                  setNewQuestion(prev => ({ 
                                    ...prev, 
                                    options: newOptions 
                                  }));
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                className="glass"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <Button onClick={addQuestion} className="btn-hero">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Questions List */}
                    {newQuiz.questions.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added Questions ({newQuiz.questions.length})</Label>
                        {newQuiz.questions.map((question, index) => (
                          <Card key={index} className="glass-card">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground mb-2">
                                    {index + 1}. {question.question}
                                  </h4>
                                  <div className="text-sm text-muted-foreground">
                                    Correct: {String.fromCharCode(65 + question.correctAnswer)} - {question.options[question.correctAnswer]}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeQuestion(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 border-t pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="btn-glass"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateQuiz} className="btn-hero">
                      <Save className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
                  <p className="text-2xl font-bold text-foreground">{totalQuizzes}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold text-foreground">{publishedQuizzes}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
                  <p className="text-2xl font-bold text-foreground">{totalAttempts}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quiz Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-maersk-blue" />
                <span>Quiz Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizzes.map((quiz) => {
                  const stats = getQuizStats(quiz.id);
                  
                  return (
                    <div key={quiz.id} className="p-6 bg-background/50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-heading text-lg font-bold text-foreground">
                              {quiz.title}
                            </h3>
                            <Badge className={
                              quiz.difficulty === 'Easy' 
                                ? 'bg-green-500/20 text-green-700 border-green-500/30'
                                : quiz.difficulty === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-700 border-red-500/30'
                            }>
                              {quiz.difficulty}
                            </Badge>
                            <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
                              {quiz.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{quiz.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{quiz.questions.length} questions</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(quiz.timeLimit)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{stats.attempts} attempts</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="h-4 w-4" />
                              <span>{stats.averageScore}% avg</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublishToggle(quiz.id)}
                            className="btn-glass"
                          >
                            {quiz.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingQuiz(quiz)}
                            className="btn-glass"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="btn-glass text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {quizzes.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                      No Quizzes Created
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first quiz to get started
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="btn-hero">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Quiz
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;