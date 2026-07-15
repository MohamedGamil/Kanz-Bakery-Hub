import { createRoot } from 'react-dom/client';

// Initialize i18next before the app renders
import './i18n/index';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
