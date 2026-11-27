import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { startHeadDedupe } from '@/lib/headDedupe';
import '@/index.css';
import '@/theme-mono.css';
import '@/styles/tz.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

startHeadDedupe();