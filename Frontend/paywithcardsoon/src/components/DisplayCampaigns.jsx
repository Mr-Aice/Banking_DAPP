import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader, search } from '../assets';
import { daysLeft } from '../utils';

const DisplayCampaigns = ({ title, isLoading, campaigns, isDarkMode }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);

  const categorizedCampaigns = campaigns.map(campaign => ({
    ...campaign,
    isActive: daysLeft(campaign.deadline) > 0
  }));

  const filteredCampaigns = categorizedCampaigns.filter((campaign) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = campaign.title.toLowerCase().includes(searchTermLower) ||
      campaign.description.toLowerCase().includes(searchTermLower);
    return matchesSearch && (showActive ? campaign.isActive : !campaign.isActive);
  });

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign })
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-[20px]">
        <div className="flex items-center gap-4">
          <h1 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-[#0a0b0d]'} text-left`}>{title} ({filteredCampaigns.length})</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowActive(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${showActive
                ? 'bg-[#1dc071] text-white'
                : `${isDarkMode ? 'bg-[#1e293b] text-[#64748b]' : 'bg-[#f1f5f9] text-[#64748b]'}`
              }`}
            >
              Ongoing 
            </button>
            <button
              onClick={() => setShowActive(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${!showActive
                ? 'bg-[#1dc071] text-white'
                : `${isDarkMode ? 'bg-[#1e293b] text-[#64748b]' : 'bg-[#f1f5f9] text-[#64748b]'}`
              }`}
            >
              Ended
            </button>
          </div>
        </div>
        <div className={`flex items-center ${isDarkMode ? 'bg-[#111827]' : 'bg-[#f1f5f9]'} px-4 py-2 rounded-[100px] w-full sm:w-[458px] mt-4 sm:mt-0 shadow-lg border ${isDarkMode ? 'border-[#1e293b]' : 'border-[#cbd5e1]'}`}>
          <input 
            type="text"
            placeholder="Search campaigns by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex w-full font-epilogue font-normal text-[14px] ${isDarkMode ? 'placeholder:text-[#64748b] text-white' : 'placeholder:text-[#64748b] text-[#0f172a]'} bg-transparent outline-none`}
          />
          <img src={search} alt="search" className={`w-[15px] h-[15px] object-contain cursor-pointer ${!isDarkMode ? 'invert' : ''}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-[20px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && filteredCampaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns found matching your search criteria
          </p>
        )}

        {!isLoading && filteredCampaigns.length > 0 && filteredCampaigns.map((campaign) => <FundCard 
          key={uuidv4()}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns