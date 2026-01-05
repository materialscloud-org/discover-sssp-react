export default interface BandsChessboardPlotProps {
  pseudoFilenames: string[];
  values: number[][];
  title: string;
  colorMax: number;
  onTileClick: (pseudos: string[], pointIndex: number[]) => void;
}
