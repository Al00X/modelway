import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Toaster} from "react-hot-toast";
import './api';

import './index.scss';
import './design-system.scss';
import 'react-18-image-lightbox/style.css';
import 'keen-slider/keen-slider.min.css'
import "yet-another-react-lightbox/styles.css";

import TitleBar from "@/features/TitleBar/TitleBar";
import {MantineProvider} from "@mantine/core";
import {ContextMenuProvider} from "@/hooks/useContextMenu";
import {Provider as JotaiProvider} from "jotai";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <Toaster />
    <ContextMenuProvider />
    <MantineProvider withNormalizeCSS>
      <JotaiProvider>
        <App />
      </JotaiProvider>
    </MantineProvider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
