/* eslint-disable import/order */
import './index.scss';
import './design-system.scss';
import 'react-18-image-lightbox/style.css';
import 'keen-slider/keen-slider.min.css';
import 'yet-another-react-lightbox/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { MantineProvider } from '@mantine/core';
import { App } from './App';
import { TitleBar } from '@/features/TitleBar/TitleBar';
import { ContextMenuProvider } from '@/hooks/useContextMenu';
import { API } from '@/api';
import { HotKeysProvider } from '@/context/HotKeys.provider';

await API.init();

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <TitleBar />
    <Toaster />
    <ContextMenuProvider />
    <HotKeysProvider />
    <MantineProvider withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
