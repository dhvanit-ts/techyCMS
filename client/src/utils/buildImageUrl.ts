const baseUrl = "http://localhost:8000/uploads/";

const buildImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith(baseUrl)) return imagePath;
  return `${baseUrl}${imagePath}`;
};

export const normalizeImageUrl = (path: string) => {
  return path.replace(baseUrl, "");
}

export default buildImageUrl;
