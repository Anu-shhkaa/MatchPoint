import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-blue-100 dark:bg-secondary text-center flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-primary">
        🏆 MatchPoint
      </h1>
      <p className="text-green-500 dark:text-gray-300 mt-3">
        Your One-Stop Sports Results Platform
      </p>
      <button 
        className="mt-5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default App;



