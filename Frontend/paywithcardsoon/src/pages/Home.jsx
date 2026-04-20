import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = ({ isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div className="flex flex-col max-w-[1280px] mx-auto">
      <div className="w-full px-4 md:px-0">
        <DisplayCampaigns 
          title="Campaigns"
          isLoading={isLoading}
          campaigns={campaigns}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
}

export default Home