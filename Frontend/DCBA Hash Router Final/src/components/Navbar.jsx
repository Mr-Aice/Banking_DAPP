import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useStateContext } from '../context';
import { CustomButton, ConnectWallet } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, disconnect } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 max-w-[1280px] mx-auto w-full">
      <div className="flex-1"></div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        {!address && (
          <ConnectWallet />
        )}
        {address && (
          <CustomButton 
            btnType="button"
            title="Create a campaign"
            styles="bg-[#1dc071]"
            handleClick={() => navigate('create-campaign')}
          />
        )}

        {address && (
          <Link to="/profile">
            <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
            </div>
          </Link>
        )}
      </div>

      {/* Small screen navigation */}
        <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#111827] flex justify-center items-center cursor-pointer border border-[#1e293b]">
            <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>

          <img 
            src={menu}
            alt="menu"
            className="w-[34px] h-[34px] object-contain cursor-pointer"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />

          <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
            <ul className="mb-4">
              {navlinks.map((link) => (
                ((link.name === 'logout' || link.name === 'profile') && !address) ? null : (
                  <li
                    key={link.name}
                    className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                    onClick={() => {
                      if (link.name === 'logout') {
                        if (disconnect) {
                          disconnect();
                          setIsActive('dashboard');
                          navigate('/');
                          toast.success('Successfully logged out!');
                        }
                      } else {
                        setIsActive(link.name);
                        setToggleDrawer(false);
                        navigate(link.link);
                      }
                    }}
                  >
                    <img 
                      src={link.imgUrl}
                      alt={link.name}
                      className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                    />
                    <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                      {link.name}
                    </p>
                  </li>
                )
              ))}
            </ul>

            <div className="flex mx-4">
            {!address && (
              <ConnectWallet />
            )}
            {address && (
              <CustomButton 
                btnType="button"
                title="Create a campaign"
                styles="bg-[#1dc071]"
                handleClick={() => navigate('create-campaign')}
              />
            )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Navbar