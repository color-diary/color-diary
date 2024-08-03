import { Stamp } from '@/types/stamp.type';

const SummerStamp = ({ petal, circle }: Stamp) => {
  return (
    <svg xmlns="http://www.w3.org/3000/svg" width="30" height="30" viewBox="0 0 20 20" fill="none">
      <path
        fill={petal}
        stroke="#F7CA87"
        strokeWidth=".2"
        d="m10.995 4.531.051.21.127-.174 2.491-3.414-.652 4.175-.033.213.184-.112 3.608-2.2-2.2 3.608-.112.184.213-.033 4.175-.652-3.414 2.49-.174.128.21.05 4.107.996-4.107.995-.21.051.174.127 3.414 2.491-4.175-.652-.213-.033.112.184 2.2 3.608-3.608-2.2-.184-.112.033.213.652 4.175-2.49-3.414-.128-.174-.05.21L10 19.576l-.995-4.107-.051-.21-.127.174-2.491 3.414.652-4.175.033-.213-.184.112-3.608 2.2 2.2-3.608.112-.184-.213.033-4.175.652 3.414-2.49.174-.128-.21-.05L.425 10l4.106-.995.21-.051-.174-.127-3.414-2.491 4.175.652.213.033-.112-.184-2.2-3.608 3.608 2.2.184.112-.033-.213-.652-4.175 2.49 3.414.128.174.05-.21L10 .425l.995 4.106Z"
      />
      <circle cx="10" cy="10" r="3.75" fill={circle} />
    </svg>
  );
};

export default SummerStamp;
