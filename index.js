
// Polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

// Main application
import React from 'react';
import ReactDOM from 'react-dom';
import './src/index.css';
import './src/styles/global.css';
import App from './src/App';

// No JSX here, using React.createElement directly
ReactDOM.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  ),
  document.getElementById('root')
);
