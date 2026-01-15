export const formatSubscripts = (text: string) => {
  return text
    .split(/(\d+)/)
    .map((part, i) => (/\d+/.test(part) ? <sub key={i}>{part}</sub> : part));
};

export const BM = (
  V: number[],
  V0: number,
  E0: number,
  B0: number,
  B1: number
) =>
  V.map((v) => {
    const eta = Math.pow(v / V0, 2 / 3);
    return (
      E0 +
      ((9 * B0 * V0) / 16) *
        (Math.pow(eta - 1, 3) * B1 + Math.pow(eta - 1, 2) * (6 - 4 * eta))
    );
  });
