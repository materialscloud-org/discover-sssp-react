import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import { capitalize } from "@sssp/common/utils";

import styles from "./Toggle.module.scss";

interface ToggleProps {
  name: string;
  items: string[];
  activeItem: string;
  onChange?: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  name,
  items,
  activeItem,
  onChange,
}) => {
  return (
    <ToggleButtonGroup
      className={styles.toggleButtonGroup}
      type="radio"
      name={name}
      value={activeItem}
      onChange={onChange}
    >
      {items.map((item) => (
        <ToggleButton
          id={`${item}-toggle`}
          className={styles.toggleButton}
          key={item}
          value={item}
          variant="secondary"
          style={{
            boxShadow:
              item === activeItem ? "0 0 0 0.25rem rgba(0,0,0,0.25)" : "none",
          }}
        >
          {capitalize(item)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default Toggle;
