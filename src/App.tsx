import './App.css'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
