import React, { useState } from 'react';

interface TabSwitcherProps {
  text1: string
  text2: string
  isSwitch: boolean
  setIsSwitch: React.Dispatch<React.SetStateAction<boolean>>
}

const TabSwitcher = ({ text1, text2, isSwitch, setIsSwitch }: TabSwitcherProps) => {
  return (
    <div className="flex justify-center border-b-2 mb-6">
      <div className="flex max-w-xs w-full justify-around">
        <div
          className={`cursor-pointer py-2 flex-1 text-center ${!isSwitch ? 'border-b-4 border-blue-500' : ''}`}
          onClick={() => setIsSwitch(false)}
        >
          {text1}
        </div>
        <div
          className={`cursor-pointer py-2 flex-1 text-center ${isSwitch ? 'border-b-4 border-blue-500' : ''}`}
          onClick={() => setIsSwitch(true)}
        >
          {text2}
        </div>
      </div>
    </div>
  );
};

export default TabSwitcher;