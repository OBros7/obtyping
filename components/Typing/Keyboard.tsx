import React from 'react';

interface KeyboardProps {
  nextKey: string | null;
}

const Keyboard: React.FC<KeyboardProps> = ({ nextKey }) => {

  const baseKeyClass = "relative flex items-center justify-center border border-gray-300 rounded-md select-none h-10";
  const highlightedKeyClass = "bg-red-500 text-white";
  const normalKeyClass = "bg-white text-black";
  const inactiveKeyClass = "border-gray-200 bg-gray-100";

  // キーボードレイアウト
  const keyboardLayout = [
    { paddingLeft: 'pl-6', alignment: 'justify-start', keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '***', '***', '***'] },
    { paddingLeft: 'pl-12', alignment: 'justify-start', keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '@', '['] },
    { paddingLeft: 'pl-16', alignment: 'justify-start', keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', ':', ']'] },
    { paddingLeft: 'pl-0', alignment: 'justify-start', keys: ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '***', 'shift'] },
    { paddingLeft: 'pl-0', alignment: 'justify-center', keys: [' '] },
  ];

  const getKeySize = (key: string): string => {
    if (key === ' ') return "w-40"; // スペースキー
    if (key.toLowerCase() === 'shift') return "w-20"; // Shiftキー
    if (key === '***') return "w-10 h-10"; // Windows/Macで変わるキー
    return "w-10 h-10";
  };

  const isKeyHighlighted = (key: string): boolean => {
    if (!nextKey) return false;
    return key.toUpperCase() === nextKey.toUpperCase();
  };

  const isShiftHighlighted = (): boolean => {
    if (!nextKey) return false;
    return nextKey === nextKey.toUpperCase() && /[A-Z]/.test(nextKey);
  };

  const getKeyClass = (key: string): string => {
    if (isKeyHighlighted(key)) return `${baseKeyClass} ${highlightedKeyClass}`;
    if (isShiftHighlighted() && key.toLowerCase() === 'shift') return `${baseKeyClass} ${highlightedKeyClass}`;
    if (key === '***') return `${baseKeyClass} ${inactiveKeyClass}`;
    return `${baseKeyClass} ${normalKeyClass}`;
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex ${row.alignment} ${row.paddingLeft} space-x-2 w-full`}
          >
            {row.keys.map((key, keyIndex) => (
              <div
                key={keyIndex}
                className={`${getKeyClass(key)} ${getKeySize(key)}`}
              >
                {key === ' ' ? 'Space' : key === '***' ? '' : key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
