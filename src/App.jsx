import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Play from './screens/Play';
import Chat from './screens/Chat';
import EmailCrimeUnit from './screens/EmailCrimeUnit';
import MissionIntroduction from './screens/MissionIntroduction';
import MissionInvestigation from './screens/MissionInvestigation';
import MissionComplete from './screens/MissionComplete';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/play" element={<Play />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/training/email-crimes" element={<EmailCrimeUnit />} />
        <Route path="/mission/:missionId/introduction" element={<MissionIntroduction />} />
        <Route path="/mission/:missionId/investigation" element={<MissionInvestigation />} />
        <Route path="/mission/:missionId/complete" element={<MissionComplete />} />
      </Routes>
    </Router>
  );
}

export default App;
