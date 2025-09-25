import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Clock, 
  Star,
  Play,
  CheckCircle,
  TrendingUp,
  Globe,
  Award
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-time Scoring',
      description: 'Instant feedback with animated results and detailed explanations'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Role-based Access',
      description: 'Separate admin and user interfaces with advanced permissions'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Advanced Analytics',
      description: 'Deep insights into performance trends and learning patterns'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC2 compliance and data encryption'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Timed Assessments',
      description: 'Configurable time limits with smooth countdown animations'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Gamification',
      description: 'Achievement systems, badges, and competitive leaderboards'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Users', icon: <Users className="h-5 w-5" /> },
    { number: '500+', label: 'Quiz Categories', icon: <Globe className="h-5 w-5" /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <Star className="h-5 w-5" /> },
    { number: '24/7', label: 'Support Available', icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cosmic opacity-10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-maersk-blue/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-maersk-light-blue/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 px-6 py-2 bg-maersk-light-blue/20 text-maersk-blue border-maersk-blue/30">
              <Award className="h-4 w-4 mr-2" />
              Enterprise-Grade Learning Platform
            </Badge>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-shadow">
              <span className="gradient-text">Maersk Quiz Pro</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The future of maritime assessment. Stunning interface meets enterprise functionality 
              with real-time analytics and role-based management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="btn-hero group">
                <Link to="/auth" className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Start Learning</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="btn-glass">
                <Link to="/demo" className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>View Demo</span>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="glass-card text-center"
              >
                <div className="flex items-center justify-center mb-2 text-maersk-blue">
                  {stat.icon}
                </div>
                <div className="font-heading text-2xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, designed for delight. Every feature crafted with enterprise needs in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="glass-card h-full hover:shadow-xl hover:shadow-maersk-blue/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-maersk-gradient rounded-xl text-white">
                        {feature.icon}
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card text-center p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-maersk-gradient opacity-5" />
            <div className="relative">
              <h2 className="font-heading text-4xl font-bold mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of maritime professionals using Maersk Quiz Pro to enhance their skills and knowledge.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-hero group">
                  <Link to="/auth" className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="btn-glass">
                  <Link to="/contact" className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Schedule Demo</span>
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required. Setup in under 2 minutes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;