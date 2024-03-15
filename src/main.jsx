import React from 'react'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { StyleSheetManager } from 'styled-components';
import isValidProp from '@emotion/is-prop-valid';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={isValidProp}>
      <App />
    </StyleSheetManager>
  </React.StrictMode>,
)
