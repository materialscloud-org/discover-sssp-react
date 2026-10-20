import { Button, ButtonGroup } from "react-bootstrap";

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
}) => (
  <ButtonGroup className={styles.toggleButtonGroup} aria-label={name}>
    {items.map((item) => (
      <Button
        key={item}
        type="button"
        variant="secondary"
        className={styles.toggleButton}
        aria-pressed={item === activeItem}
        onClick={() => onChange?.(item)}
        style={{
          boxShadow:
            item === activeItem ? "0 0 0 0.25rem rgba(0,0,0,0.25)" : "none",
        }}
      >
        {capitalize(item)}
      </Button>
    ))}
  </ButtonGroup>
);
export default Toggle;
