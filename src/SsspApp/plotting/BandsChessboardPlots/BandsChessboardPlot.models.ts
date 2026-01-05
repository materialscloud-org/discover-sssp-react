export default interface BandsChessboardPlotProps {
  pseudoFilenames: string[];
  values: number[][];
  title: string;
  colorMax: number;
  tileClickHandler: (pseudos: string[]) => void;
}
