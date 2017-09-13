import { injectGlobal } from 'styled-components';

injectGlobal`
  html {
    box-sizing: border-box;
    font-size: 12px;
  }
  body {
    font-size: 12px;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;
