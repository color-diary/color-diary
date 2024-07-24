export const formatFullDate = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

  return formattedDate;
};
