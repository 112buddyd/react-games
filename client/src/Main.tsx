import { applyMode, Mode } from '@cloudscape-design/global-styles';
import '@cloudscape-design/global-styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import Router from './Router';

window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  ? applyMode(Mode.Dark)
  : applyMode(Mode.Light);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);
