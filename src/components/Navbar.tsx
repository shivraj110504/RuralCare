
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Info, Bot, User, GraduationCap, Truck, Building, Menu, X, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const getUserInitials = () => {
    if (!currentUser) return "U";
    
    // Get user_metadata or use email as fallback
    const userData = currentUser.user_metadata || {};
    const name = userData.name || currentUser.email || '';
    
    if (!name) return "U";
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-teal-500">RuralCare</span>
        </Link>
        
        <button 
          className="md:hidden text-teal-500 hover:text-teal-400 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center text-teal-500 hover:text-teal-400 transition-colors duration-300">
            <Home className="mr-1 h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/ai-doctor" className="flex items-center text-teal-500 hover:text-teal-400 transition-colors duration-300">
            <Bot className="mr-1 h-4 w-4" />
            <span>AI Doctor</span>
          </Link>
          <Link to="/medicine-delivery" className="flex items-center text-teal-500 hover:text-teal-400 transition-colors duration-300">
            <Truck className="mr-1 h-4 w-4" />
            <span>Medicine Delivery</span>
          </Link>
          <Link to="/hospital-beds" className="flex items-center text-teal-500 hover:text-teal-400 transition-colors duration-300">
            <Building className="mr-1 h-4 w-4" />
            <span>Hospital Beds</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-teal-500 hover:text-teal-400 transition-colors duration-300 focus:outline-none">
              <span>More</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/training" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Training</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about" className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  <span>About</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                <Avatar className="h-8 w-8 bg-teal-200 hover:bg-teal-300 transition-colors duration-300">
                  <AvatarFallback className="bg-teal-500 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/medical-details')}>Medical Details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="flex items-center px-5 py-2 bg-white text-teal-500 rounded-full border border-teal-200 hover:bg-teal-100 transition-all duration-300 shadow-sm">
                <User className="mr-1 h-4 w-4" />
                <span>Log in</span>
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <Link to="/" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <Home className="mr-2 h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link to="/ai-doctor" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <Bot className="mr-2 h-5 w-5" />
                <span>AI Doctor</span>
              </Link>
              <Link to="/medicine-delivery" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <Truck className="mr-2 h-5 w-5" />
                <span>Medicine Delivery</span>
              </Link>
              <Link to="/hospital-beds" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <Building className="mr-2 h-5 w-5" />
                <span>Hospital Beds</span>
              </Link>
              <Link to="/training" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <GraduationCap className="mr-2 h-5 w-5" />
                <span>Training</span>
              </Link>
              <Link to="/about" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                <Info className="mr-2 h-5 w-5" />
                <span>About</span>
              </Link>
              {currentUser && (
                <>
                  <Link to="/profile" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                    <User className="mr-2 h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/medical-details" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                    <User className="mr-2 h-5 w-5" />
                    <span>Medical Details</span>
                  </Link>
                  <Link to="/settings" className="flex items-center py-2 text-teal-500 hover:text-teal-400" onClick={() => setMenuOpen(false)}>
                    <User className="mr-2 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </>
              )}
              <div className="pt-2 flex flex-col space-y-3">
                {currentUser ? (
                  <Button 
                    variant="destructive" 
                    className="flex items-center justify-center" 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="flex items-center justify-center px-5 py-2 bg-white text-teal-500 rounded-full border border-teal-200 hover:bg-teal-100 transition-all duration-300 shadow-sm">
                      <User className="mr-1 h-4 w-4" />
                      <span>Log in</span>
                    </Link>
                    <Link to="/signup" className="flex items-center justify-center px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
