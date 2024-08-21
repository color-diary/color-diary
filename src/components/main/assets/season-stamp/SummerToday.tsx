const SummerToday = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 26 26" fill="none">
      <g filter="url(#a)">
        <circle cx="13" cy="13" r="9" fill="#F1A027" />
      </g>
      <path
        fill="#fff"
        stroke="#F7CA87"
        strokeWidth=".2"
        d="m13.995 7.531.051.21.127-.174 2.491-3.414-.652 4.175-.033.213.184-.112 3.608-2.2-2.2 3.608-.112.184.213-.033 4.175-.652-3.414 2.49-.174.128.21.05 4.107.996-4.107.995-.21.051.174.127 3.414 2.491-4.175-.652-.213-.033.112.184 2.2 3.608-3.608-2.2-.184-.112.033.213.652 4.175-2.49-3.414-.128-.174-.05.21L13 22.576l-.995-4.107-.051-.21-.127.174-2.491 3.414.652-4.175.033-.213-.184.112-3.608 2.2 2.2-3.608.112-.184-.213.033-4.175.652 3.414-2.49.174-.128-.21-.05L3.425 13l4.106-.995.21-.051-.174-.127-3.414-2.491 4.175.652.213.033-.112-.184-2.2-3.608 3.608 2.2.184.112-.033-.213-.652-4.175 2.49 3.414.128.174.05-.21L13 3.425l.995 4.106Z"
      />
      <circle cx="13" cy="13" r="3.75" fill="#D4D4D4" />
      <path
        fill="#080808"
        d="M13.25 10.438a.188.188 0 0 0-.375 0v2.437h-2.438a.188.188 0 0 0 0 .375h2.438v2.438a.188.188 0 0 0 .375 0V13.25h2.438a.188.188 0 0 0 0-.375H13.25v-2.438Z"
      />
      <defs>
        <filter id="a" width="26" height="26" x="0" y="0" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_2307_16882" stdDeviation="2" />
        </filter>
      </defs>
    </svg>
  );
};

export default SummerToday;
