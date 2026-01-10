import React from "react";
import { Form } from "react-bootstrap";

import { capitalize } from "@sssp/common/utils";

interface PseudoSelectorProps {
  id?: string;
  which: string;
  pseudos: string[];
  value: string;
  onSelect: (pseudo: string) => void;
}

const PseudoSelector: React.FC<PseudoSelectorProps> = ({
  id,
  which,
  pseudos,
  value,
  onSelect,
}) => {
  return (
    <Form.Group id={id}>
      <Form.Label htmlFor={`${which}-select`}>{capitalize(which)}:</Form.Label>
      <Form.Select
        id={`${which}-select`}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        {pseudos.map((pseudo) => (
          <option key={pseudo} value={pseudo}>
            {pseudo}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default PseudoSelector;
