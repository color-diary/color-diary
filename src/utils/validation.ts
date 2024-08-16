export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export const validateNicknameNull = (nickname: string): boolean => {
  return nickname !== null && nickname !== undefined && nickname.trim() !== '';
};

export const validateNickname = (nickname: string): boolean => {
  return nickname.length >= 3 && nickname.length <= 8;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};
