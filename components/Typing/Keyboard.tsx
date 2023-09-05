import React from 'react';

interface KeyboardProps {
  nextKey: string | null;
}

const Keyboard: React.FC<KeyboardProps> = ({ nextKey }) => {

  const spaceKeySize = "w-40"
  const shiftKeySize = "w-20"

  // Define the keyboard layout
  const keyboardLayout = [
    // Row 1
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Back\nspace'],
    // Row 2
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    // Row 3
    ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
    // Row 4
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
    // Row 5
    ['Ctrl', 'Alt', ' ', 'Alt', 'Ctrl'],
  ];

  const getFingerIndicator = (rowIndex: number, keyIndex: number): number => {
    if (rowIndex === 0) {
      if (keyIndex < 6) return keyIndex + 1;
      if (keyIndex < 9) return keyIndex - 4;
      return 10;
    }
    if (rowIndex === 1 || rowIndex === 2) {
      if (keyIndex < 5) return keyIndex + 1;
      if (keyIndex < 9) return keyIndex - 3;
      return 10;
    }
    if (rowIndex === 3) {
      if (keyIndex < 6) return keyIndex + 1;
      if (keyIndex < 9) return keyIndex - 4;
      return 9;
    }
    return 0;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {row.map((key, keyIndex) => (
            <div
              key={keyIndex}
              className={`relative flex items-center justify-center h-10 border border-gray-300 rounded-md select-none${key === nextKey ? " bg-red-500 text-white" : ""
                } ${/^[a-zA-Z0-9]$/.test(key) ? "w-10" : key === "Shift" ? shiftKeySize : key === " " ? spaceKeySize : "w-10"}`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
