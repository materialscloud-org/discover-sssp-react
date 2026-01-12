export default interface BandsChessboardPlotProps {
  pseudoFilenames: string[];
  values: number[][];
  title: string;
  onTileClick: (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[]
  ) => void;
}
