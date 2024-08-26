export const makeTransparent = (color: string, alpha: number): string => {
  const hex = color.slice(1);
  const rgb = parseInt(hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
