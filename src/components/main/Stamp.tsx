import React from 'react';
import FlowerStamp from './FlowerStamp';
interface StampProps {
  color: string;
  month: number;
}

const Stamp = ({ color, month }: StampProps) => {
  const handleShowSeason = () => {
    if (3 <= month && month <= 5) {
      return; //spring
    } else if (6 <= month && month <= 8) {
      return (
        <div>
          <FlowerStamp color={color} />
        </div>
      ); //summer
    } else if (9 <= month && month <= 11) {
      return; //fall
    } else {
      return; //winter
    }
  };

  return handleShowSeason();
};

export default Stamp;
