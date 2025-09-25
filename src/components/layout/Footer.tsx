import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Anchor, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="glass-card mx-4 mb-4 mt-20"
    >
      <div className="px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-maersk-gradient rounded-xl">
                <Anchor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold gradient-text">
                  Maersk Quiz Pro
                </h3>
                <p className="text-sm text-muted-foreground">Enterprise Learning Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Empowering maritime professionals with cutting-edge quiz technology. 
              Built for enterprise-scale learning and assessment.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 bg-maersk-light-blue/20 rounded-lg text-maersk-blue hover:bg-maersk-blue hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 bg-maersk-light-blue/20 rounded-lg text-maersk-blue hover:bg-maersk-blue hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 bg-maersk-light-blue/20 rounded-lg text-maersk-blue hover:bg-maersk-blue hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Quiz Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-maersk-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 A.P. Moller - Maersk. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Built with precision for maritime excellence
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;