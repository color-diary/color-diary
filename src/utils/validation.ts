export const validateNickname = (nickname: string): boolean => {
  return nickname.length >= 3 && nickname.length <= 8;
};
