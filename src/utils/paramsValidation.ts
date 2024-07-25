import { validate as uuidValidate } from 'uuid';

export const isValidDate = (id: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(id);
};

export const isValidUUID = (id: string) => {
  return uuidValidate(id);
};
