import { useContext } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { capitalize } from "@sssp/common/utils";
import { LibraryContext } from "@sssp/context";

import styles from "./LibraryToggle.module.scss";

const LibraryToggle: React.FC = () => {
  const navigate = useNavigate();
  const { libraries, activeLibrary } = useContext(LibraryContext);
  return (
    <ToggleButtonGroup
      id={styles["library-controls"]}
      type="radio"
      name="library"
      value={activeLibrary}
      onChange={(value) => navigate(`../${value}`)}
    >
      {libraries.map((library) => (
        <ToggleButton key={library} id={library} value={library}>
          {capitalize(library)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default LibraryToggle;
