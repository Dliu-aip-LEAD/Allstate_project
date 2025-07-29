import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Onboarding from './screens/Onboarding';
import Home from './screens/Home';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}

export default App;
