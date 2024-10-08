import FallStamp from './assets/season-stamp/FallStamp';
import FallToday from './assets/season-stamp/FallToday';
import SpringStamp from './assets/season-stamp/SpringStamp';
import SpringToday from './assets/season-stamp/SpringToday';
import SummerStamp from './assets/season-stamp/SummerStamp';
import SummerToday from './assets/season-stamp/SummerToday';
import WinterStamp from './assets/season-stamp/WinterStamp';
import WinterToday from './assets/season-stamp/WinterToday';

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
