export const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.split('/').slice(-1)[0];
  const extension = filename.split('.').slice(-1)[0];
  const metadata = { type: `image/${extension}` };
  return new File([blob], filename, metadata);
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
