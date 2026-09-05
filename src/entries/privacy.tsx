import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import { ThemeProvider } from '../context/ThemeContext';
import { PrivacyPage } from '../pages/PrivacyPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <PrivacyPage />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
