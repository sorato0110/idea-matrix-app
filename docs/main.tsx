import React from 'https://esm.sh/react@18?dev&jsx=automatic';
import { createRoot } from 'https://esm.sh/react-dom@18/client?dev';
import { App } from './App.tsx';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
