export default interface BandStructureControlsProps {
  pseudos: string[];
  activePseudos: string[];
  bandShift: number;
  onPseudoSelect: React.Dispatch<React.SetStateAction<string[]>>;
  onBandShiftChange: React.Dispatch<React.SetStateAction<number>>;
}
