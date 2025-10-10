import postcss from "postcss";

export const validateCss = (css: string): boolean => {
  try {
    postcss.parse(css);
    return true;
  } catch {
    return false;
  }
};
