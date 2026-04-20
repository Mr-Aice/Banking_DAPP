import React from 'react';

import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }) => {
  const remainingDays = daysLeft(deadline);
  
  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-[#111827] cursor-pointer shadow-lg border border-[#1e293b] hover:border-[#374151] transition-all duration-200" onClick={handleClick}>
      <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-[15px]"/>

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#64748b]">PUGC Campaigns</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#64748b] text-left leading-[18px] truncate">{description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#94a3b8] leading-[22px]">{amountCollected}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#64748b] sm:max-w-[120px] truncate">Raised of {target}</p>
          </div>
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${Number(amountCollected) >= Number(target) ? 'text-[#1dc071]' : remainingDays > 0 ? 'text-[#94a3b8]' : 'text-[#ef4444]'} leading-[22px] flex flex-col`}>
              {Number(amountCollected) >= Number(target) ? 'Target Achieved' : remainingDays > 0 ? `${remainingDays} Days Left` : (
                <>
                  <span className="text-[#ef4444] mb-1">Campaign Ended</span>
                  <span className="text-[13px] text-[#94a3b8] font-medium">Ended on {new Date(deadline).toLocaleDateString()}</span>
                </>)}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#64748b] sm:max-w-[120px] truncate">
              {Number(amountCollected) >= Number(target) ? 'Successfully Funded' : remainingDays > 0 ? 'Campaign Active' : 'Campaign Closed'}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#0a0b0d]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain"/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#64748b] truncate">by <span className="text-[#94a3b8]">{owner}</span></p>
        </div>
      </div>
    </div>
  )
}

export default FundCard