export const validateNickname = (nickname: string) => {
  return nickname.length >= 3 && nickname.length <= 8;
};
