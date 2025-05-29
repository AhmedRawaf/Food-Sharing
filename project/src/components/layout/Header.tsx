import React, { useState, useRef, useEffect } from 'react';
import { Menu, Heart, UserCircle, LogOut, Search, X, Package, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

/**
 * User Interface
 * Defines the structure of user data used in the header
 */
interface User {
  name: string;
  email: string;
}

/**
 * Header Component
 * 
 * This component provides the main navigation for the application with:
 * - Mobile-responsive design with bottom navigation on mobile and top navigation on desktop
 * - User authentication state handling
 * - Search functionality
 * - User profile dropdown
 * - Navigation links
 * 
 * The header adapts its layout based on screen size:
 * - Mobile: Bottom navigation bar with icons and labels
 * - Desktop: Top navigation bar with full menu items and search
 */
const Header: React.FC = () => {
  // Get authentication state and logout function from context
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // State management for various UI elements
  const [isMenuOpen, setIsMenuOpen] = useState(false);        // Controls mobile menu visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);    // Controls search bar visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controls user profile dropdown
  const [searchQuery, setSearchQuery] = useState('');         // Stores search input value

  // Ref for handling click outside dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle functions for various UI elements
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery(''); // Reset search query when toggling
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  /**
   * Effect hook to handle clicks outside the dropdown
   * Closes the dropdown when clicking outside
   * Uses event delegation to improve performance
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle logout process
   * - Closes dropdown
   * - Calls logout function from auth context
   * - Navigates to login page
   * - Handles any errors during logout
   */
  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Handle profile navigation
   * Closes all open menus and navigates to specified path
   * @param path - The route to navigate to
   */
  const handleProfileClick = (path: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    navigate(path);
  };

  /**
   * Handle search form submission
   * - Prevents default form submission
   * - Navigates to find page with search query
   * - Closes search bar and resets query
   * @param e - Form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm fixed bottom-0 left-0 right-0 md:sticky md:top-0 md:bottom-auto z-50">
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden flex justify-around items-center h-16 border-t border-gray-200">
        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          type="button"
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>

        {/* Find Food Button */}
        <button
          onClick={() => navigate('/find')}
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          type="button"
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Find</span>
        </button>

        {/* Donate Button */}
        <button
          onClick={() => navigate('/donate')}
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          type="button"
        >
          <Package className="h-6 w-6" />
          <span className="text-xs mt-1">Donate</span>
        </button>

        {/* Chats Button */}
        <button
          onClick={() => navigate('/chats')}
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          type="button"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs mt-1">Chats</span>
        </button>

        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          type="button"
        >
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </nav>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center cursor-pointer"
              type="button"
            >
              <Heart className="h-8 w-8 text-green-600" />
              <span className="ml-2 font-bold text-xl text-gray-900">FoodShare</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/donate"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Donate
              </Link>
              <Link
                to="/find"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Find Food
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/chats"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                Chats
              </Link>
            </nav>

            {/* Desktop Right Section - Search and User Profile */}
            <div className="flex items-center space-x-4">
              {/* Search Form */}
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for food..."
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="ml-2 text-gray-700 hover:text-green-600"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="ml-2 text-gray-700 hover:text-green-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={toggleSearch}
                  className="text-gray-700 hover:text-green-600"
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}

              {/* User Profile Section */}
              {currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center text-gray-700 hover:text-green-600 focus:outline-none"
                    type="button"
                  >
                    <UserCircle className="h-8 w-8" />
                  </button>
                  {/* User Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => handleProfileClick('/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleProfileClick('/dashboard')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-green-600" />
                <span className="ml-2 font-bold text-xl text-gray-900">FoodShare</span>
              </div>
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Mobile Menu Navigation Links */}
            <nav className="space-y-4">
              <Link
                to="/"
                className="block text-gray-700 hover:text-green-600 py-2"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/donate"
                className="block text-gray-700 hover:text-green-600 py-2"
                onClick={toggleMenu}
              >
                Donate
              </Link>
              <Link
                to="/find"
                className="block text-gray-700 hover:text-green-600 py-2"
                onClick={toggleMenu}
              >
                Find Food
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-green-600 py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-green-600 py-2"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-green-600 py-2"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-green-600 py-2"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-green-600 py-2"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;