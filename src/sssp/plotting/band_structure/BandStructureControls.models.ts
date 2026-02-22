export default interface BandStructureControlsProps {
  pseudos: string[];
  activePseudos: string[];
  onPseudoSelect: (pseudos: string[]) => void;
  bandShift: number;
  onBandShiftChange: (shift: number) => void;
}
