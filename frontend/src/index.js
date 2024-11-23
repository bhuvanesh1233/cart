import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import App from './App';
import store from './store';
import {Provider} from 'react-redux'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
     <Provider store={store}>
      <App />
      </Provider>
  </React.StrictMode>
);
