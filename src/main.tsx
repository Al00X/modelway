import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Toaster} from "react-hot-toast";
import './samples/node-api';

import './index.scss';
import './design-system.scss';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'react-18-image-lightbox/style.css';
import TitleBar from "@/features/TitleBar/TitleBar";
import {MantineProvider} from "@mantine/core";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <Toaster />
    <MantineProvider withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
