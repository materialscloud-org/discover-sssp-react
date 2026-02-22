export default interface BandsChessboardPlotProps {
  title: string;
  pseudoFilenames: string[];
  values: number[][];
  zMax: number;
  onTileClick: (
    plotIndex: number,
    pseudos: string[],
    pointIndex: number[]
  ) => void;
}
