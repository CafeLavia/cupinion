import './App.css'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { useEffect, useState } from 'react';



function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App
