export default interface BandsChessboardPlotProps {
  which: string;
  chessboardPseudos: string[];
  values: number[][];
  zMax: number;
  onTileClick: (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[],
  ) => void;
}
