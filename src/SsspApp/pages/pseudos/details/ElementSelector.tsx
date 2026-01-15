import React, { useMemo } from "react";
import { Dropdown } from "react-bootstrap";

import { elementSymbols } from "@sssp/common/symbols";

import ElementSelectorProps from "./ElementSelector.models";
import styles from "./ElementSelector.module.scss";

const ElementSelector: React.FC<ElementSelectorProps> = ({
  element,
  navigate,
  activeTab,
}) => {
  const selectorSymbols = useMemo(() => {
    return elementSymbols.slice(1).sort();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle
        id={styles["element-dropdown-toggle"]}
        variant="success"
        size="lg"
      >
        {element || "None provided"}
      </Dropdown.Toggle>
      <Dropdown.Menu id={styles["element-dropdown-menu"]}>
        {selectorSymbols.map((el) => (
          <Dropdown.Item
            key={el}
            onClick={() => navigate(`/pseudopotentials/${el}/${activeTab}`)}
            active={el === element}
          >
            {el}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ElementSelector;
