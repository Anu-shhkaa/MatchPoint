import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the provider component (this is what you imported in main.jsx)
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme, checking localStorage for a saved preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light'; // Default to light mode
  });

  // This effect runs when 'theme' changes
  useEffect(() => {
    const root = window.document.documentElement; // This is the <html> tag
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save the user's choice in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Only re-run if 'theme' changes

  // The function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the current theme and the toggle function to all child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a custom hook for easy access
// This lets you just type `const { theme, toggleTheme } = useTheme();`
// in any component instead of a bunch of extra code.
export const useTheme = () => {
  return useContext(ThemeContext);
};

