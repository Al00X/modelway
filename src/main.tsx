import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './samples/node-api';
import './index.scss';
import 'swiper/css';
import 'swiper/css/scrollbar';
import {Toaster} from "react-hot-toast";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster />
    <App />
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
