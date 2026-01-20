import { useContext, useState } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";

import { PseudoContext } from "@sssp/context";

import PseudosCheckboxesProps from "./PseudosCheckboxes.models";
import styles from "./PseudosCheckboxes.module.scss";

const PseudosCheckboxes: React.FC<PseudosCheckboxesProps> = ({
  pseudos,
  activePseudos,
  setActivePseudos,
}) => {
  const { pseudosMetadata } = useContext(PseudoContext);
  const [allPseudosChecked, setAllPseudosChecked] = useState(
    activePseudos.length === pseudos.length,
  );

  return (
    <div className={styles["pseudos-checkboxes"]}>
      <Form.Check
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
      {pseudos.map((pseudo) => {
        const label = pseudo + (pseudo === "REF" ? " (AE average)" : "");
        const pseudoName = pseudo.split("-Z=")[0];
        return (
          <Form.Check
            key={pseudo}
            type="checkbox"
            id={pseudo}
            label={
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 100 }}
                offset={[0, 10]}
                overlay={<Tooltip>{label}</Tooltip>}
              >
                <span>{label}</span>
              </OverlayTrigger>
            }
            checked={activePseudos.includes(pseudo)}
            disabled={pseudo === "REF"}
            className={styles["pseudo-checkbox"]}
            style={{
              color: pseudosMetadata[pseudoName]?.color || "black",
            }}
            onChange={(event) => {
              setActivePseudos(
                !event.target.checked
                  ? activePseudos.filter((p) => p !== pseudo)
                  : [...activePseudos, pseudo],
              );
              setAllPseudosChecked(
                event.target.checked
                  ? activePseudos.length + 1 === pseudos.length
                  : false,
              );
            }}
          />
        );
      })}
    </div>
  );
};

export default PseudosCheckboxes;
