import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify'; //Side pr jo option aata hain pop up waly
import { Web3Button } from '@thirdweb-dev/react'; //In case SDK change krni prti hy toh yeh km kry gi
import QRCode from 'qrcode';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, getCampaigns } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [ownerCampaignCount, setOwnerCampaignCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCardPaymentProcessing, setIsCardPaymentProcessing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  const fetchOwnerCampaignCount = async () => {
    const allCampaigns = await getCampaigns();
    const ownerCampaigns = allCampaigns.filter(campaign => campaign.owner === state.owner);
    setOwnerCampaignCount(ownerCampaigns.length);
  };

  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchOwnerCampaignCount();
    }
  }, [contract, address]);

  const handleDirectWalletPayment = async () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!address) {
      toast.error('Please connect your wallet to make a donation');
      return;
    }
    setIsLoading(true);
    try {
      await donate(state.pId, amount); 
      navigate('/');
      toast.success('Thank you for your donation!');
    } catch (error) {
      if (error.message.includes('rejected')) {
        toast.error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds in your wallet');
      } else if (error.message.includes('requires a connected wallet')) {
        toast.error('Please connect your wallet to sign the transaction');
      } else {
        toast.error('Transaction failed. Please try again.');
      }
      console.error('Donation error:', error);
    } finally {
      setIsLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleDonate = () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px] max-w-[1280px] mx-auto">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-8 max-w-[1280px] mx-auto">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {ownerCampaignCount} Campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you believe in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Support the project for no reward, just because it speaks to you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />

              {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-[#1c1c24] p-6 rounded-[10px] w-96">
                    <h3 className="font-epilogue font-semibold text-[18px] text-white mb-4">
                      Choose Payment Method
                    </h3>
                    <div className="space-y-4">
                      <button
                        className="w-full py-3 px-4 bg-[#8c6dfd] rounded-[10px] font-epilogue font-semibold text-white"
                        onClick={handleDirectWalletPayment}
                      >
                        Pay with Wallet
                      </button>
                      <button
                        className="w-full py-3 px-4 bg-[#8c6dfd] rounded-[10px] font-epilogue font-semibold text-white"
                        onClick={async () => {
                          if (!amount || amount <= 0) {
                            toast.error('Please enter a valid amount');
                            return;
                          }
                          try {
                            const ethAmount = amount.toString();
                            // Direct Campaign creator ky wallet address ky saath QR code bnaya hy idhr.
                            const paymentUrl = `ethereum:${state.owner}@17000?value=${ethers.utils.parseEther(ethAmount).toString()}`;
                            // Removed browser wallet interaction
                            setIsVerifying(false);
                            setTransactionStatus('waiting');
                            const qrCode = await QRCode.toDataURL(paymentUrl, { width: 300, margin: 2 });
                            setQrCodeUrl(qrCode);
                            setTransactionStatus('waiting');
                            setIsVerifying(true);

                            const startBlock = await provider.getBlockNumber();
                            
                            const checkInterval = setInterval(async () => {
                              try {
                                const currentBlock = await provider.getBlockNumber();
                                const events = await contract.queryFilter('DonationReceived', startBlock, currentBlock);
                                
                                const matchingEvent = events.find(event => 
                                  event.args.campaignId.toString() === state.pId &&
                                  event.args.amount.toString() === ethers.utils.parseEther(ethAmount).toString()
                                );

                                if (matchingEvent) {
                                  setTransactionHash(matchingEvent.transactionHash);
                                  setTransactionStatus('success');
                                  clearInterval(checkInterval);
                                  setIsVerifying(false);
                                  toast.success('Payment verified successfully!');
                                  await fetchDonators();
                                  // Calculate total from donators array
                                  const totalDonated = donators.reduce((sum, donator) => {
                                    return sum + parseFloat(ethers.utils.formatEther(donator.donation));
                                  }, 0);
                                  state.amountCollected = totalDonated.toString();
                                }
                              } catch (error) {
                                console.error('Error checking transaction:', error);
                              }
                            }, 5000);

                            // Clear interval after 5 mins.
                            setTimeout(() => {
                              if (transactionStatus !== 'success') {
                                clearInterval(checkInterval);
                                setIsVerifying(false);
                                setTransactionStatus('timeout');
                                toast.error('Transaction verification timed out');
                              }
                            }, 300000);
                          } catch (error) {
                            console.error('Error generating QR code:', error);
                          
                          }
                        }}
                      >
                        Pay with QR Code
                      </button>
                      {qrCodeUrl && (
                        <div className="mt-4 flex flex-col items-center">
                          <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48" />
                          <p className="mt-2 text-sm text-[#808191]">
                            {transactionStatus === 'waiting' && 'Scan to Send Directly to Campaign Owner'}
                            {transactionStatus === 'success' && (
                              <span className="text-green-500">Payment verified successfully!</span>
                            )}
                            {transactionStatus === 'timeout' && (
                              <span className="text-red-500">Transaction verification timed out</span>
                            )}
                          </p>
                          {isVerifying && (
                            <div className="mt-2 text-sm text-[#808191]">
                              <p>Verifying transaction...</p>
                              
                            </div>
                          )}
                          {transactionHash && (
                            <a
                              href={`https://etherscan.io/tx/${transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-sm text-[#8c6dfd] hover:underline"
                            >
                              View transaction on Etherscan
                            </a>
                          )}
                        </div>
                      )}
                      <button
                        className="w-full py-3 px-4 bg-[#3a3a43] rounded-[10px] font-epilogue font-semibold text-white mt-4"
                        onClick={() => {
                          setShowPaymentModal(false);
                          setQrCodeUrl('');
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;