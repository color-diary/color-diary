import axios from 'axios';

export const fetchDiary = async (id: string) => {
  const response = await axios.get(`/api/diaries/${id}`);
  return response.data;
};

export const fetchDiaryDate = async (id: string): Promise<string> => {
  const response = await axios.get(`/api/diaries/${id}`);
  return String(response.data.date);
};
