import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStateContext } from '../context';

import { logo, sun, moon } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive === name && 'bg-[#1e293b]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles} hover:bg-[#1e293b] transition-colors duration-200`} onClick={handleClick}>
    <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
  </div>
)

const Sidebar = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState('dashboard');

  useEffect(() => {
    const currentPath = location.pathname;
    const activeLink = navlinks.find(link => link.link === currentPath);
    if (activeLink) {
      setIsActive(activeLink.name);
    }
  }, [location]);
  const { disconnect, address } = useStateContext();

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className={`flex-1 flex flex-col justify-between items-center ${isDarkMode ? 'bg-[#111827]' : 'bg-[#f1f5f9]'} rounded-[20px] w-[76px] py-4 mt-12 shadow-lg`}>
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            ((link.name === 'logout' || link.name === 'profile') && !address) ? null : (
              <Icon 
                key={link.name}
                {...link}
                isActive={isActive}
                handleClick={() => {
                  if(!link.disabled) {
                    if (link.name === 'logout' && disconnect) {
                      disconnect();
                      setIsActive('dashboard');
                      navigate('/');
                      toast.success('Successfully logged out!');
                    } else {
                      setIsActive(link.name);
                      navigate(link.link);
                    }
                  }
                }}
              />
            )
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={isDarkMode ? sun : moon} handleClick={() => setIsDarkMode(!isDarkMode)} />
      </div>
    </div>
  )
}

export default Sidebar;