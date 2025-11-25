import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AuthProvider from "./context/AuthProvider.jsx";
import { CartProvider } from "./context/CartContext.jsx"; // IMPORT BARU
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <AuthProvider>
    <CartProvider> {/* WRAPPER BARU */}
      <App />
    </CartProvider>
  </AuthProvider>
)