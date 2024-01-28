import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ImageProvider from "./context/ImageProvider";
import Gallery from './pages/Gallery';
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
  {
    path: "/gallery",
    element: <Gallery/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ImageProvider>
      <RouterProvider router = {router}/>
    </ImageProvider>
  </React.StrictMode>
);