export default interface BandsChessboardPlotsProps {
  element: string;
  setChessboardPseudos: (pseudos: string[]) => void;
  setBandShift: (shift: number) => void;
  onTileClick: (tab: string) => void;
}
