import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import App from './components/App';

import theme from './styles/theme';

const appElement = document.getElementById('root');

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  appElement
);
