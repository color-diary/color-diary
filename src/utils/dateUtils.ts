export const formatFullDate = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

  return formattedDate;
};

export const getQueryStringDate = (type: string) => {
  if (typeof window !== 'undefined') {
    const YYMM = localStorage.getItem('queryString')?.slice(-6);
    if (YYMM) {
      return type === 'year' ? YYMM.slice(0, 4) : YYMM.slice(4, 6);
    }
  }
};
