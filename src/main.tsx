import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@google/model-viewer';
import App from './App.tsx';
import './index.css';

// Handle unhandled errors gracefully to avoid uncaught cross-origin script errors
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.') {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register service worker for PWA support (skip in iframe environments to avoid cross-origin / script errors)
const isIframe = window.self !== window.top;
if ('serviceWorker' in navigator && !isIframe) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope: ', registration.scope);
      })
      .catch((err) => {
        console.error('Service Worker registration failed: ', err);
      });
  });
}

