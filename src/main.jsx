import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import DetectiveIntro from './screens/DetectiveIntro';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detective-intro" element={<DetectiveIntro />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
