const buildImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  return `http://localhost:8000/uploads/${imagePath}`;
};

export default buildImageUrl;