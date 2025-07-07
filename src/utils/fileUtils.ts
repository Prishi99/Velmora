export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: "Please upload an image file (JPG, PNG, etc.)"
    };
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return {
      isValid: false,
      error: "Please upload an image smaller than 10MB"
    };
  }

  return { isValid: true };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.onerror = error => reject(error);
  });
};