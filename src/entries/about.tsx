import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AboutPage } from '../pages/AboutPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
