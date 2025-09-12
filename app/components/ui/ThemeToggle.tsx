import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-lg bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="w-6 h-6 text-white transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 text-white transition-transform duration-300" />
      )}
    </button>
  );
};
