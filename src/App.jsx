import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Play from './screens/Play';
import Chat from './screens/Chat';
import QuickScamScan from './screens/QuickScamScan';

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
        <Route path="/quick-scam-scan" element={<QuickScamScan />} />
      </Routes>
    </Router>
  );
}

export default App;
