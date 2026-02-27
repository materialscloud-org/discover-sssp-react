import { useContext } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";
import { FamilyContext } from "@sssp/context";

import styles from "./LibraryToggle.module.scss";

const LibraryToggle: React.FC = () => {
  const navigate = useNavigate();
  const { libraries, activeLibrary } = useContext(FamilyContext);
  return (
    <ToggleButtonGroup
      id={styles.libraryToggles}
      type="radio"
      name="library"
      value={activeLibrary}
      onChange={(value) => navigate(`../${value}`)}
    >
      {libraries.map((library) => (
        <ToggleButton
          id={library}
          key={library}
          value={library}
          variant="secondary"
          className={styles.libraryToggle}
          style={{
            boxShadow:
              library === activeLibrary
                ? "0 0 0 0.25rem rgba(0,0,0,0.25)"
                : "none",
          }}
        >
          {capitalize(library)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LibraryToggle;
