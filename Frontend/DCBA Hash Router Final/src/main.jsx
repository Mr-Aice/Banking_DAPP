import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom'; //IP address ki jgh jb CID use krty hain toh yeh use krna lazmi hy wrna pages pr switch nahi hota

import ThirdwebProviderV4 from "./ThirdwebProviderV4";

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProviderV4> 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProviderV4> 
)