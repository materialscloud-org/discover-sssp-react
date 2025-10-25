import { useEffect, useState } from "react";

import { FormCheck } from "react-bootstrap";

import PseudosCheckboxesProps from "./PseudosCheckboxes.models";
import styles from "./PseudosCheckboxes.module.scss";

const PseudosCheckboxes: React.FC<PseudosCheckboxesProps> = ({
  pseudos,
  activePseudos,
  pseudosColormap,
  setActivePseudos,
}) => {
  const [allPseudosChecked, setAllPseudosChecked] = useState<boolean>(false);

  useEffect(() => {
    setAllPseudosChecked(activePseudos.length === pseudos.length);
  }, [activePseudos, pseudos.length]);

  return (
    <div className={styles["pseudos-checkboxes"]}>
      <FormCheck
        type="checkbox"
        id="all"
        label="Select all"
        checked={allPseudosChecked}
        className={styles["pseudo-checkbox"]}
        style={{ color: "black" }}
        onChange={(event) => {
          setActivePseudos(!event.target.checked ? ["REF"] : pseudos);
          setAllPseudosChecked(event.target.checked);
        }}
      />
      {pseudos.map((pseudo) => (
        <FormCheck
          key={pseudo}
          type="checkbox"
          id={pseudo}
          label={pseudo + (pseudo === "REF" ? " (AE average)" : "")}
          checked={activePseudos.includes(pseudo)}
          disabled={pseudo === "REF"}
          className={styles["pseudo-checkbox"]}
          style={{ color: pseudosColormap[pseudo] }}
          onChange={(event) => {
            setActivePseudos(
              !event.target.checked
                ? activePseudos.filter((p) => p !== pseudo)
                : [...activePseudos, pseudo]
            );
            setAllPseudosChecked(
              event.target.checked
                ? activePseudos.length + 1 === pseudos.length
                : false
            );
          }}
        />
      ))}
    </div>
  );
};

export default PseudosCheckboxes;
