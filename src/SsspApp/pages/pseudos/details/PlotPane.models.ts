export default interface PlotPaneProps {
  type: string;
  element: string;
  chessboardPseudos: string[];
  bandShift: number;
  setChessboardPseudos: React.Dispatch<React.SetStateAction<string[]>>;
  setBandShift: React.Dispatch<React.SetStateAction<number>>;
  onSelectTab: (tab: string) => void;
}
