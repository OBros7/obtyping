import React from 'react';

interface UnderConstructionOverlayProps {
  isReady?: boolean;
  message?: string;
  children: React.ReactNode;
  alertMessage?: string;
}

const PreparationCard: React.FC<UnderConstructionOverlayProps> = ({
  isReady = true,
  message = "現在準備中です。リリースまでもうしばらくお待ちください",
  children,
  alertMessage = "現在準備中です"
}) => {

  const handleClick = () => {
    if (!isReady) {
      alert(alertMessage);
    }
  }

  return (
    <div className="relative">
      {children}
      {!isReady && (
        <div
          className="absolute inset-0 bg-white bg-opacity-80 z-10 flex flex-col items-center justify-center pointer-events-auto cursor-not-allowed"
          onClick={handleClick}
        >
          <div className="p-4 bg-gray-100 border border-gray-300 rounded text-gray-700 font-bold text-center max-w-sm">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreparationCard;
