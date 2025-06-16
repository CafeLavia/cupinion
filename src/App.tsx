import './App.css'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GoodFeedbackPage from './pages/GoodFeedbackPage';
import BadFeedbackPage from './pages/BadFeedbackPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/good-feedback" element={<GoodFeedbackPage />} />
      <Route path="/bad-feedback" element={<BadFeedbackPage />} />
    </Routes>
  );
}

export default App
