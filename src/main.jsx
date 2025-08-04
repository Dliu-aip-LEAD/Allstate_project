import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Onboarding from './screens/Onboarding';
import DetectiveIntro from './screens/DetectiveIntro';
import OnboardingFlow from './screens/OnboardingFlow';
import OnboardingComplete from './screens/OnboardingComplete';
import Register from './screens/Register';
import OnboardingQuestions from './screens/OnboardingQuestions';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Play from './screens/Play';
import Chat from './screens/Chat';
import QuickScamScan from './screens/QuickScamScan';
import './index.css';
import './App.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/detective-intro" element={<DetectiveIntro />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/onboarding-questions" element={<OnboardingQuestions />} />
        <Route path="/onboarding-complete" element={<OnboardingComplete />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/play" element={<Play />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/quick-scam-scan" element={<QuickScamScan />} />
        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
