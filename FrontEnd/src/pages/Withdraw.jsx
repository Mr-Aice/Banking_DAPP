import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { toast } from "react-toastify";
import { useStateContext } from "../context";
import { CustomButton, Loader } from "../components";
import { daysLeft } from '../utils';
import { thirdweb } from '../assets';
import { format } from 'date-fns';

const Withdraw = ({ isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [withdrawalData, setWithdrawalData] = useState({});
  const { address, contract, getCampaigns } = useStateContext();

const { mutateAsync: withdrawFunds } = useContractWrite(contract, "withdrawFunds");

// Iss SDK mein contract.call hy. Purani mein useContractRead thi.
const getAvailableWithdrawableAmount = async (pId) => {
  return await contract.call("getAvailableWithdrawableAmount", [pId]);
};

const getWithdrawals = async (pId) => {
  return await contract.call("getWithdrawals", [pId]);
};

const getDonators = async (pId) => {
  return await contract.call("getDonators", [pId]);
};

const fetchCampaigns = async () => {
  setIsLoading(true);
  try {
    const data = await getCampaigns();
    const userCampaigns = data.filter(campaign => campaign.owner === address);
    const campaignsWithDetails = await Promise.all(
      userCampaigns.map(async (campaign) => {
        const donators = await getDonators(campaign.pId);
        const availableBalanceBN = await getAvailableWithdrawableAmount(campaign.pId);
        const availableBalance = ethers.utils.formatEther(availableBalanceBN);
        const withdrawalHistory = await getWithdrawals(campaign.pId);
        return {
          ...campaign,
          donators,
          availableBalance,
          withdrawalHistory,
          expanded: false
        };
      })
    );
    setCampaigns(campaignsWithDetails);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    toast.error('Failed to fetch campaigns');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (contract && address) {
      fetchCampaigns();
    }
  }, [contract, address]);

  const handleWithdraw = async (campaign) => {
    const data = withdrawalData[campaign.pId] || {};
    const { amount, toAddress } = data;

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!toAddress || !ethers.utils.isAddress(toAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      const amountInWei = ethers.utils.parseEther(amount.toString());
      await withdrawFunds({
        args: [campaign.pId, amountInWei, toAddress]
      });
      toast.success('Funds withdrawn successfully!');
      setWithdrawalData(prev => ({
        ...prev,
        [campaign.pId]: { ...prev[campaign.pId], amount: '' }
      }));
      fetchCampaigns();
    } catch (error) {
      if (error.message.includes('rejected')) {
        toast.error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds in campaign');
      } else {
        toast.error('Failed to withdraw funds. Please try again.');
        console.error('Withdrawal error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandCard = (pId) => {
    setExpandedCard(expandedCard === pId ? null : pId);
  };

  const handleAmountChange = (pId, value) => {
    setWithdrawalData(prev => ({
      ...prev,
      [pId]: { ...prev[pId], amount: value }
    }));
  };

  const handleAddressChange = (pId, value) => {
    setWithdrawalData(prev => ({
      ...prev,
      [pId]: { ...prev[pId], toAddress: value }
    }));
  };

  return (
    <div className="flex flex-col gap-[30px]">
      <h1 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-[#0a0b0d]'} text-left`}>Your Campaign Funds</h1>

      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      )}

      {!isLoading && campaigns.length === 0 && (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          You haven't created any campaigns yet.
        </p>
      )}

      {!isLoading && campaigns.length > 0 && (
        <div className="flex flex-col gap-[20px]">
          {campaigns.map((campaign) => (
            <div key={campaign.pId} className="bg-[#1c1c24] rounded-[10px] p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32]">
                    <img src={thirdweb} alt="campaign" className="w-[60%] h-[60%] object-contain"/>
                  </div>
                  <div>
                    <h3 className="font-epilogue font-semibold text-[16px] text-white">{campaign.title}</h3>
                    <p className="font-epilogue text-[12px] text-[#808191]">{daysLeft(campaign.deadline)} days left</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-[12px]">
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd]">Total Raised</h4>
                    <p className="font-epilogue text-[12px] text-[#808191]">{campaign.amountCollected} ETH</p>
                  </div>
                  <div>
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd]">Available Balance</h4>
                    <p className="font-epilogue text-[12px] text-[#808191]">{Number(campaign.availableBalance).toFixed(4)} ETH</p>
                  </div>
                  <CustomButton 
                    btnType="button"
                    title={expandedCard === campaign.pId ? "Hide" : "Withdraw"}
                    styles={`bg-[#8c6dfd] px-4 py-2 rounded-[10px] ${expandedCard === campaign.pId ? 'bg-opacity-80' : ''}`}
                    handleClick={() => handleExpandCard(campaign.pId)}
                  />
                </div>
              </div>

              {expandedCard === campaign.pId && (
                <div className="mt-[20px] border-t border-[#3a3a43] pt-[20px]">
                  <div className="flex flex-col gap-[15px]">
                    <div className="flex flex-col gap-[15px]">
                      <input 
                        type="number"
                        placeholder="ETH 0.1"
                        step="0.01"
                        className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] leading-[22px] placeholder:text-[#4b5264] rounded-[10px]"
                        value={withdrawalData[campaign.pId]?.amount || ''}
                        onChange={(e) => handleAmountChange(campaign.pId, e.target.value)}
                      />
                      <input 
                        type="text"
                        placeholder="Enter withdrawal address (0x...)"
                        className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] leading-[22px] placeholder:text-[#4b5264] rounded-[10px]"
                        value={withdrawalData[campaign.pId]?.toAddress || ''}
                        onChange={(e) => handleAddressChange(campaign.pId, e.target.value)}
                      />
                    </div>
                    <CustomButton 
                      btnType="button"
                      title="Confirm Withdrawal"
                      styles="w-full bg-[#1dc071]"
                      handleClick={() => handleWithdraw(campaign)}
                    />
                    
                    {campaign.withdrawalHistory && campaign.withdrawalHistory.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] mb-2">Recent Withdrawals</h4>
                        <div className="max-h-[200px] overflow-y-auto">
                          {campaign.withdrawalHistory.map((withdrawal, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-[#3a3a43] last:border-b-0">
                              <div className="flex flex-col">
                                <p className="font-epilogue text-[12px] text-[#808191]">
                                  To: {withdrawal.to.slice(0, 6)}...{withdrawal.to.slice(-4)}
                                </p>
                                <p className="font-epilogue text-[12px] text-[#808191]">
                                  {format(new Date(withdrawal.timestamp * 1000), 'MMM dd, yyyy HH:mm')}
                                </p>
                              </div>
                              <p className="font-epilogue text-[12px] text-[#808191]">{Number(ethers.utils.formatEther(withdrawal.amount)).toFixed(4)} ETH</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Withdraw;