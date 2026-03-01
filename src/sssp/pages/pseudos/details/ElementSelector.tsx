import React, { useContext, useMemo } from "react";
import { Dropdown } from "react-bootstrap";

import { elementSymbols } from "@sssp/common/symbols";
import { ElementContext, FamilyContext } from "@sssp/context";

import ElementSelectorProps from "./ElementSelector.models";
import styles from "./ElementSelector.module.scss";

const ElementSelector: React.FC<ElementSelectorProps> = ({
  navigate,
  activeTab,
}) => {
  const { element } = useContext(ElementContext);
  const { activeFunctional } = useContext(FamilyContext);

  const selectorSymbols = useMemo(() => {
    return elementSymbols.slice(1).sort();
  }, []);

  return (
    <Dropdown>
      <Dropdown.Toggle
        id={styles.elementDropdownToggle}
        variant="success"
        size="lg"
      >
        {element || "None provided"}
      </Dropdown.Toggle>
      <Dropdown.Menu id={styles.elementDropdownMenu}>
        {selectorSymbols.map((el) => (
          <Dropdown.Item
            key={el}
            onClick={() =>
              navigate(
                `/pseudopotentials/${activeFunctional}/${el}/${activeTab}`,
              )
            }
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
