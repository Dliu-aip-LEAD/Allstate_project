import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Profile from './screens/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
