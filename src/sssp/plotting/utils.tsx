export const formatSubscripts = (text: string) =>
  text.replace(/(\d+)/g, "<sub>$1</sub>");
