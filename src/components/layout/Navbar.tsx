import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Shield,
  Anchor
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50 mx-4 mt-4 mb-8"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-maersk-gradient rounded-xl"
          >
            <Anchor className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="font-heading text-xl font-bold gradient-text">
              Maersk Quiz Pro
            </h1>
            <p className="text-xs text-muted-foreground">Enterprise Learning Platform</p>
          </div>
        </Link>

        {/* Navigation Links */}
        {user && profile && (
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              asChild
              className="rounded-xl"
            >
              <Link to="/dashboard" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Quizzes</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive('/analytics') ? 'default' : 'ghost'}
              asChild
              className="rounded-xl"
            >
              <Link to="/analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </Button>
            
            {profile.role === 'admin' && (
              <Button
                variant={isActive('/admin') ? 'default' : 'ghost'}
                asChild
                className="rounded-xl"
              >
                <Link to="/admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* User Menu or Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 ring-2 ring-maersk-blue/20">
                    <AvatarImage src={profile.avatar_url} alt={profile.name} />
                    <AvatarFallback className="bg-maersk-gradient text-white font-semibold">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{profile.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile.role === 'admin' 
                        ? 'bg-maersk-blue text-white' 
                        : 'bg-maersk-light-blue text-maersk-navy'
                    }`}>
                      {profile.role.toUpperCase()}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild className="rounded-xl">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="btn-hero">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;