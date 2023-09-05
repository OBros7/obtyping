import React from 'react';

interface ToggleButtonProps {
  flag: boolean | undefined;
  text1: string;
  text2: string;
  color: string;
  toggleFlag: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ flag, text1, text2, color, toggleFlag }) => {
  return (
    <button
      className={`${flag ? 'bg-' + color + '-500 hover:bg-' + color + '-700' : 'bg-gray-500 hover:bg-gray-700'}  text-white font-bold py-2 px-4 rounded-full mr-2`}
      onClick={toggleFlag}
    >
      {flag ? text1 : text2}
    </button>
  );
};

export default ToggleButton;
