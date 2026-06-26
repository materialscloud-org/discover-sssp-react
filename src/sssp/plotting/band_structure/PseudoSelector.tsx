import React, { useContext, useMemo } from "react";
import { Form } from "react-bootstrap";

import { capitalize } from "@sssp/common/utils";
import { ElementContext, PseudoContext } from "@sssp/context";

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
  const { ssspPseudos } = useContext(ElementContext);
  const { pseudosMetadata } = useContext(PseudoContext);

  const [efficiencyPseudo, precisionPseudo] = useMemo(() => {
    return [
      [ssspPseudos?.efficiency?.library, ssspPseudos?.efficiency?.Z].join("-"),
      [ssspPseudos?.precision?.library, ssspPseudos?.precision?.Z].join("-"),
    ];
  }, [ssspPseudos]);

  const getStyle = (pseudo: string) => {
    const isEfficiency = pseudo === efficiencyPseudo;
    const isPrecision = pseudo === precisionPseudo;

    const isSSSP = isEfficiency || isPrecision;

    let [color, weight] = ["black", "normal"];
    if (isSSSP) {
      color =
        pseudosMetadata[
          isEfficiency
            ? ssspPseudos.efficiency.library
            : ssspPseudos.precision.library
        ]?.color || "black";
      weight = "bold";
    }
    return { color: color, fontWeight: weight };
  };

  return (
    <Form.Group id={id}>
      <Form.Label htmlFor={`${which}-select`}>{capitalize(which)}:</Form.Label>
      <Form.Select
        id={`${which}-select`}
        name={`${which}-select`}
        value={value}
        onChange={(e) => onSelect(e.target.value)}
      >
        {pseudos.map((pseudo) => (
          <option key={pseudo} value={pseudo} style={getStyle(pseudo)}>
            {pseudo}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default PseudoSelector;
