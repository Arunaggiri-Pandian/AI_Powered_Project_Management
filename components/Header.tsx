import React from 'react';
import { HomeIcon, SunIcon, MoonIcon } from './icons';

interface HeaderProps {
  onHomeClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, theme, onThemeToggle }) => {
  return (
    <header className="bg-micron-blue dark:bg-gray-900 shadow-md text-white transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <button
              onClick={onHomeClick}
              className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-micron-blue dark:focus:ring-offset-gray-900 focus:ring-white"
              aria-label="Home"
            >
              <HomeIcon className="w-6 h-6" />
            </button>
            <span className="text-2xl font-bold">
                Micron AI PMO
            </span>
          </div>
          <div className="flex items-center">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-micron-blue dark:focus:ring-offset-gray-900 focus:ring-white"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;