// Import necessary dependencies from React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Import the main App component and global styles
import App from './App.tsx';
import './index.css';

// Create a root React element and render the application
// The '!' operator asserts that the element exists
createRoot(document.getElementById('root')!).render(
  // StrictMode helps identify potential problems in the application
  // It enables additional development checks and warnings
  <StrictMode>
    <App />
  </StrictMode>
);
