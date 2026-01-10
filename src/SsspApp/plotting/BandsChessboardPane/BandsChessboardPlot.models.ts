export default interface BandsChessboardPlotProps {
  pseudoFilenames: string[];
  values: number[][];
  title: string;
  colorMax: number;
  onTileClick: (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[]
  ) => void;
}
