import React, { useState } from 'react';

type MenuCardProps = {
  title: string;
  introduction: string;
  description: string;
  color: string;
};

const MenuCard: React.FC<MenuCardProps> = ({ title, introduction, description, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`text-white items-center mx-8 my-4 h-24 flex border bg-${color}-500 hover:bg-${color}-700 p-4 rounded-lg`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex-none w-1/5">
        <p className="text-center text-4xl">{title}</p>
      </div>
      <div className="flex-1 border-l pl-4 text-l">
        {isHovered ? <p>{description}</p> : <p>{introduction}</p>}
      </div>
    </div>
  );
};

export default MenuCard;
