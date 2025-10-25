export default interface PseudosCheckboxesProps {
  pseudos: string[];
  activePseudos: string[];
  pseudosColormap: { [key: string]: string };
  setActivePseudos: (newActivePseudos: string[]) => void;
}
