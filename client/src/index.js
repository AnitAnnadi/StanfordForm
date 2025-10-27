import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './index.css';
import App from './App';
import './i18n';
import { AppProvider } from './context/appContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      {/* <div
        role="alert"
        style={{
          backgroundColor: "#fee2e2",
          borderLeft: "4px solid #ef4444", 
          color: "#b91c1c",
          padding: "1rem",
          borderRadius: "0.375rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        The website is currently under maintenance. Please visit back in a few
        hours. The team sincerely apologizes for the inconvenience.
      </div> */}
      <App />
    </AppProvider>
  </React.StrictMode>
);
