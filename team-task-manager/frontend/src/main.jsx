import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#fff',
              color: '#0F172A',
              border: '1px solid #E6EEFE',
              boxShadow: '0 10px 25px -5px rgba(37,99,235,0.12), 0 4px 8px -2px rgba(15,23,42,0.05)',
              fontSize: '14px',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#2563EB', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#E11D48', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
