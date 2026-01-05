export default interface BandsChessboardPlotsProps {
  element: string;
  setBandShift: (shift: number) => void;
  onTileClick: (tab: string) => void;
}
