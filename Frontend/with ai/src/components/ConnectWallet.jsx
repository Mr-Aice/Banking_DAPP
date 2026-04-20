import React from 'react';
import { ConnectWallet as ThirdwebConnectWallet } from '@thirdweb-dev/react';

const ConnectWallet = () => {
  return (
    <ThirdwebConnectWallet 
      btnTitle="Connect Wallet"
      modalTitle="Connect Your Wallet"
      modalSize="wide"
      welcomeScreen={{
        title: "Choose your preferred wallet",
        subtitle: "Connect with one of our available wallet providers"
      }}
      modalTitleIconUrl="/assets/logo.svg"
      className="!bg-[#4acd8d] !text-white !rounded-[10px] !font-epilogue !font-semibold !text-[16px] leading-[26px] !min-h-[52px]"
      detailsBtn={() => {
        return {
          className: "!bg-[#4acd8d] !text-white !rounded-[10px] !font-epilogue !font-semibold !text-[16px] leading-[26px] !min-h-[52px]"
        };
      }}
    />
  );
};

export default ConnectWallet;