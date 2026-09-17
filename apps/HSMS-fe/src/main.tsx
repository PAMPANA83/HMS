import { StrictMode } from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app/app';
import Login from "./app/pages/Login";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
