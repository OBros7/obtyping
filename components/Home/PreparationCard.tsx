import React from 'react';
import { useTranslation } from '@/MyCustomHooks'
import langDict from './langDict'

interface UnderConstructionOverlayProps {
  isReady?: boolean;
  viewMessage?: string;
  children: React.ReactNode;
  onclickMessage?: string;
}

const PreparationCard: React.FC<UnderConstructionOverlayProps> = ({
  isReady = true,
  viewMessage,
  children,
  onclickMessage
}) => {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  // デフォルト値を設定
  const defaultViewMessage = translater.viewMessage;
  const defaultOnclickMessage = translater.onclickMessage;

  const handleClick = () => {
    if (!isReady) {
      alert(onclickMessage || defaultOnclickMessage);
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
            {viewMessage || defaultViewMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreparationCard;
