import React from 'react';

interface TimeButtonProps {
  time: string;
}

const TimeButton: React.FC<TimeButtonProps> = ({ time }) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2">
      {time}
    </button>
  );
};

interface TextMenuProps {
  text: string;
}

const TextMenu: React.FC<TextMenuProps> = ({ text }) => {
  const times = ['1min', '2min', '3min', '5min'];
  return (
    <div className="flex bg-gray-200 p-4 rounded-lg">
      <div className="font-bold text-xl mr-4">{text}</div>
      <div className="flex">
        {times.map((time, index) => (
          <TimeButton key={index} time={time} />
        ))}
      </div>
    </div>
  );
};

export default TextMenu;