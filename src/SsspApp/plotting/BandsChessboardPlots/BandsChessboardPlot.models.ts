export default interface BandsChessboardPlotProps {
  pseudos: string[];
  values: number[][];
  title: string;
  colorMax: number;
  tileClickHandler: (pseudos: string[]) => void;
}
