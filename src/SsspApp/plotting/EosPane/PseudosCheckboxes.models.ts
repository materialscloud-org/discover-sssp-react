export default interface PseudosCheckboxesProps {
  pseudos: string[];
  activePseudos: string[];
  setActivePseudos: (newActivePseudos: string[]) => void;
}
