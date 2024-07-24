export const formatDate = (): string => {
  const date = new Date();
  const formattedDate = `${String(date.getFullYear()).slice(-2)}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;

  return formattedDate;
};
