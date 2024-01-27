import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ImageUploader from './pages/ImageUploader';

import './index.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export const UserContext = React.createContext(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  }, 
  {
    path: "/upload",
    element: <ImageUploader/>
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>
);