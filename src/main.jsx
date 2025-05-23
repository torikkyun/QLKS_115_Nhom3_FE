import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store'; 
import App from './App';
import './index.css';
import './config/i18next';
import { BrowserRouter } from 'react-router-dom';       

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />

  </Provider>
);