import React from 'react';

interface FingersProps {
  nextKey: string | null;
}

interface FingerProps {
  height: string;
  coloredHeight: string;
  color?: string;
  className?: string;
}

const Finger: React.FC<FingerProps> = ({ height, color, className }) => (
  <div className={`${className} relative w-8`} style={{ height: height }}>
    <div className="h-full w-5 bg-transparent">
      <div className={`mt-5 w-8 rounded-full overflow-hidden h-20`} style={{ backgroundColor: color }}></div>
    </div>
    <div className="absolute bottom-0 w-8 h-12 bg-white"></div>
  </div>
);

const Fingers: React.FC<FingersProps> = ({ nextKey }) => {
  const basicColor = "#00b4d8";
  const highlightColor = "#ff6363";

  // 修正後: 指とキーの対応を正確に定義
  const getFingerIndexForKey = (key: string | null): number => {
    if (!key) return -1;
    // 左手の指
    if (key.match(/[1qaz!QA~Z`]/)) return 0; // 小指
    if (key.match(/[2wsxWSX]/)) return 1; // 薬指
    if (key.match(/[3edcEDC@#]/)) return 2; // 中指
    if (key.match(/[4rfvRFV5tgbTGB]/)) return 3; // 人差し指
    if (key.match(/[ ]/)) return 4; // 親指
    // 右手の指
    if (key.match(/[ ]/)) return 5; // 親指
    if (key.match(/[6yhnYHN7ujmUJM]/)) return 6; // 人差し指
    if (key.match(/[8ik,IK<]/)) return 7; // 中指
    if (key.match(/[9ol\.OL>]/)) return 8; // 薬指
    if (key.match(/[0pP\-\=+\[\]{}\\:;'"<>?]/)) return 9; // 小指
    return -1;
  };

  const nextFingerIndex = getFingerIndexForKey(nextKey);

  return (
    <div className="relative flex flex-row justify-center items-end">
      {/* 左手 */}
      <div className="lefthand mr-8 flex flex-row items-end">
        <Finger height="120px" coloredHeight="20" color={nextFingerIndex === 0 ? highlightColor : basicColor} />
        <Finger height="130px" coloredHeight="20" color={nextFingerIndex === 1 ? highlightColor : basicColor} />
        <Finger height="135px" coloredHeight="20" color={nextFingerIndex === 2 ? highlightColor : basicColor} />
        <Finger height="130px" coloredHeight="20" color={nextFingerIndex === 3 ? highlightColor : basicColor} />
        <Finger height="100px" coloredHeight="20" color={nextFingerIndex === 4 ? highlightColor : basicColor} />
      </div>
      {/* 右手 */}
      <div className="righthand ml-8 flex flex-row items-end">
        <Finger height="100px" coloredHeight="20" color={nextFingerIndex === 5 ? highlightColor : basicColor} />
        <Finger height="130px" coloredHeight="20" color={nextFingerIndex === 6 ? highlightColor : basicColor} />
        <Finger height="135px" coloredHeight="20" color={nextFingerIndex === 7 ? highlightColor : basicColor} />
        <Finger height="130px" coloredHeight="20" color={nextFingerIndex === 8 ? highlightColor : basicColor} />
        <Finger height="120px" coloredHeight="20" color={nextFingerIndex === 9 ? highlightColor : basicColor} />
      </div>
    </div>
  );
};

export default Fingers;
