export default interface BandsChessboardPlotProps {
  which: string;
  chessboardPseudos: string[];
  ssspPseudoColors: Record<string, string>;
  values: number[][];
  zMax: number;
  onTileClick: (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => void;
}
