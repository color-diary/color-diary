import React from 'react';
import SpringStamp from './season-stamp/SpringStamp';
import SummerStamp from './season-stamp/SummerStamp';
import FallStamp from './season-stamp/FallStamp';
import WinterStamp from './season-stamp/WinterStamp';
import SpringToday from './season-stamp/SpringToday';
import SummerToday from './season-stamp/SummerToday';
import FallToday from './season-stamp/FallToday';
import WinterToday from './season-stamp/WinterToday';
interface StampProps {
  petal: string;
  circle: string;
  month: number;
  isToday?: boolean;
}

const Stamp = ({ petal, circle, month, isToday }: StampProps) => {
  const handleShowSeason = () => {
    if (3 <= month && month <= 5) {
      return isToday ? (
        <div>
          <SpringToday />
        </div>
      ) : (
        <div>
          <SpringStamp petal={petal} circle={circle} />
        </div>
      );
    } else if (6 <= month && month <= 8) {
      return isToday ? (
        <div>
          <SummerToday />
        </div>
      ) : (
        <div>
          <SummerStamp petal={petal} circle={circle} />
        </div>
      );
    } else if (9 <= month && month <= 11) {
      return isToday ? (
        <div>
          <FallToday />
        </div>
      ) : (
        <div>
          <FallStamp petal={petal} circle={circle} />
        </div>
      );
    } else if (12 <= month || month <= 2) {
      return isToday ? (
        <div>
          <WinterToday />
        </div>
      ) : (
        <div>
          <WinterStamp petal={petal} circle={circle} />
        </div>
      );
    } else {
      return;
    }
  };

  return handleShowSeason();
};

export default Stamp;
