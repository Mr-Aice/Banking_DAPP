import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { loader } from '../assets';
import { CustomButton } from '../components';

const Payment = ({ isDarkMode }) => {
  const { contract, address, getCampaigns, getDonations } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignDetails, setCampaignDetails] = useState([]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      const userCampaigns = data.filter(campaign => campaign.owner === address);
      setCampaigns(userCampaigns);

      const details = await Promise.all(
        userCampaigns.map(async (campaign) => {
          const donations = await getDonations(campaign.pId);
          return {
            ...campaign,
            donations
          };
        })
      );
      setCampaignDetails(details);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchCampaigns();
    }
  }, [contract, address]);

  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-[#0a0b0d]'} text-left`}>Campaign Funding Details</h1>

      {isLoading && (
        <div className="flex justify-center items-center">
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        </div>
      )}

      {!isLoading && campaignDetails.length === 0 && (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          You haven't created any campaigns yet.
        </p>
      )}

      {!isLoading && campaignDetails.length > 0 && (
        <div className="flex flex-col gap-[20px]">
          {campaignDetails.map((campaign) => (
            <div key={campaign.pId} className="flex flex-col bg-[#1c1c24] rounded-[10px] p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-epilogue font-semibold text-[16px] text-white">{campaign.title}</h3>
                <div className="flex items-center gap-[12px]">
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd]">Target Amount</h4>
                    <p className="font-epilogue text-[12px] text-[#808191]">{campaign.target} ETH</p>
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd]">Collected Amount</h4>
                    <p className="font-epilogue text-[12px] text-[#808191]">{campaign.amountCollected} ETH</p>
                  </div>
                </div>
              </div>

              <div className="mt-[20px]">
                <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd]">Contributors</h4>
                {campaign.donations.length > 0 ? (
                  <div className="mt-[10px] flex flex-col gap-2">
                    {campaign.donations.map((donation, index) => (
                      <div key={`${donation.donator}-${index}`} className="flex justify-between items-center">
                        <p className="font-epilogue text-[12px] text-[#808191] break-all">{donation.donator}</p>
                        <p className="font-epilogue text-[12px] text-[#808191]">{donation.donation} ETH</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-[10px] font-epilogue text-[12px] text-[#808191]">
                    No contributions yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payment;