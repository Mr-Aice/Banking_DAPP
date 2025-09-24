import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //AI ki help sy bni hy (improved layout)

import { Sidebar, Navbar, AgentWidget } from './components';
import { CampaignDetails, CreateCampaign, Home, Profile, Payment, Withdraw } from './pages';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className={`relative sm:-8 p-4 ${isDarkMode ? 'bg-[#0a0b0d]' : 'bg-[#C4D9FF]'} min-h-screen flex flex-row`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 container px-4 md:px-8 lg:px-16">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/payment" element={<Payment isDarkMode={isDarkMode} />} />
          <Route path="/withdraw" element={<Withdraw isDarkMode={isDarkMode} />} />
        </Routes>
      </div>
      <AgentWidget isDarkMode={isDarkMode} />
    </div>
  )
}

export default App