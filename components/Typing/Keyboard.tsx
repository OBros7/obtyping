import React from 'react';

interface KeyboardProps {
  nextKey: string | null;
}

const Keyboard: React.FC<KeyboardProps> = ({ nextKey }) => {
  const keySize = "w-10 h-10";

  // 必要なキーのみを含むキーボードレイアウト
  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
    [' '], // Space キー
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {row.map((key, keyIndex) => (
            <div
              key={keyIndex}
              className={`relative flex items-center justify-center border border-gray-300 rounded-md select-none ${key === nextKey ? "bg-red-500 text-white" : "bg-white text-black"} ${key === ' ' ? "w-40" : "w-10 h-10"}`}
            >
              {key === ' ' ? 'Space' : key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;