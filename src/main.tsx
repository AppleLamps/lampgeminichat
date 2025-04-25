import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Imagen3Provider } from './context/Imagen3Context';

createRoot(document.getElementById("root")!).render(
  <Imagen3Provider>
    <App />
  </Imagen3Provider>
);
