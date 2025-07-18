import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { BrowserRouter as Router } from 'react-router-dom';
window.bootstrap = bootstrap;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
    <App />
      </Router>
    </Provider>
  </StrictMode>,
)
