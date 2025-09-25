import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useQuizStore } from '@/store/useQuizStore';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Download
} from 'lucide-react';

const Analytics = () => {
  const { user, quizzes, results, getResultsByUser } = useQuizStore();
  const userResults = user ? getResultsByUser(user.id) : [];

  // Calculate analytics data
  const totalQuizzes = quizzes.filter(q => q.isPublished).length;
  const completedQuizzes = userResults.length;
  const averageScore = userResults.length > 0 
    ? userResults.reduce((acc, result) => acc + (result.score / result.totalQuestions * 100), 0) / userResults.length
    : 0;
  const totalTimeSpent = userResults.reduce((acc, result) => acc + result.timeSpent, 0);

  // Performance over time data
  const performanceData = userResults.map((result, index) => {
    const quiz = quizzes.find(q => q.id === result.quizId);
    return {
      name: quiz ? quiz.title.substring(0, 15) + '...' : 'Quiz',
      score: Math.round((result.score / result.totalQuestions) * 100),
      timeSpent: Math.round(result.timeSpent / 60), // in minutes
      attempt: index + 1
    };
  }).slice(-10); // Last 10 attempts

  // Score distribution data
  const scoreRanges = [
    { range: '90-100%', count: 0, color: '#22c55e' },
    { range: '80-89%', count: 0, color: '#84cc16' },
    { range: '70-79%', count: 0, color: '#eab308' },
    { range: '60-69%', count: 0, color: '#f59e0b' },
    { range: '<60%', count: 0, color: '#ef4444' }
  ];

  userResults.forEach(result => {
    const percentage = (result.score / result.totalQuestions) * 100;
    if (percentage >= 90) scoreRanges[0].count++;
    else if (percentage >= 80) scoreRanges[1].count++;
    else if (percentage >= 70) scoreRanges[2].count++;
    else if (percentage >= 60) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });

  // Category performance
  const categoryPerformance = quizzes.reduce((acc: any[], quiz) => {
    const categoryResults = userResults.filter(result => result.quizId === quiz.id);
    if (categoryResults.length > 0) {
      const avgScore = categoryResults.reduce((sum, result) => 
        sum + (result.score / result.totalQuestions * 100), 0) / categoryResults.length;
      
      const existingCategory = acc.find(item => item.category === quiz.category);
      if (existingCategory) {
        existingCategory.totalScore += avgScore;
        existingCategory.count++;
        existingCategory.avgScore = existingCategory.totalScore / existingCategory.count;
      } else {
        acc.push({
          category: quiz.category,
          avgScore: avgScore,
          totalScore: avgScore,
          count: 1,
          fill: quiz.category === 'Maritime' ? '#1686bd' : '#a1d1e8'
        });
      }
    }
    return acc;
  }, []);

  const stats = [
    {
      title: 'Total Completed',
      value: completedQuizzes,
      change: '+12%',
      icon: <Award className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Average Score',
      value: `${Math.round(averageScore)}%`,
      change: '+5%',
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Time Spent',
      value: `${Math.round(totalTimeSpent / 60)}h`,
      change: '+18%',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((completedQuizzes / totalQuizzes) * 100)}%`,
      change: '+8%',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-emerald-600'
    }
  ];

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
                Performance Analytics
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your learning progress and identify improvement areas
              </p>
            </div>
            <Button className="btn-hero">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className={`text-xs ${stat.color} mt-1`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-maersk-gradient`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-maersk-blue" />
                  <span>Performance Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="attempt" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--maersk-blue))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--maersk-blue))', strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: 'hsl(var(--maersk-blue))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5 text-maersk-blue" />
                  <span>Score Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreRanges.filter(range => range.count > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="range"
                      >
                        {scoreRanges.filter(range => range.count > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {scoreRanges.filter(range => range.count > 0).map((range) => (
                    <div key={range.range} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: range.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {range.range}: {range.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Category Performance & Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-maersk-blue" />
                  <span>Category Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="avgScore" 
                        radius={[4, 4, 0, 0]}
                        fill="hsl(var(--maersk-blue))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-maersk-blue" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userResults.slice(-5).reverse().map((result) => {
                    const quiz = quizzes.find(q => q.id === result.quizId);
                    const scorePercentage = (result.score / result.totalQuestions) * 100;
                    
                    return (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {quiz?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              scorePercentage >= 80 
                                ? 'bg-green-500/20 text-green-700 border-green-500/30'
                                : scorePercentage >= 60
                                ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-700 border-red-500/30'
                            }
                          >
                            {Math.round(scorePercentage)}%
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(result.timeSpent / 60)}m
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;