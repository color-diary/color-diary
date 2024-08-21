'use clinet';

import { useState } from 'react';

const useMakeQueryString = () => {
  const [queryString, setQueryString] = useState<string>();

  const makeQueryString = (form: String, date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (form === 'YYMM') {
      if (String(date.getMonth() + 1).length === 1) {
        return Number(String(year) + String(0) + String(month));
      } else {
        return Number(String(year) + String(month));
      }
    } else {
      if (String(date.getMonth() + 1).length === 1) {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(0) + String(month)}`);
      } else {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(month)}`);
      }
    }
  };

  return {
    queryString,
    makeQueryString
  };
};
export default useMakeQueryString;
