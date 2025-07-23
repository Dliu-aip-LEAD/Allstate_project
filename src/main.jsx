import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import DetectiveIntro from './screens/DetectiveIntro';
import OnboardingQuestion1 from './screens/OnboardingQuestion1';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detective-intro" element={<DetectiveIntro />} />
        <Route path="/onboarding-question-1" element={<OnboardingQuestion1 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
