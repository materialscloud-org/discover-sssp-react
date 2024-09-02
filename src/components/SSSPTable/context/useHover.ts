import { useState } from "react";

import { ElementModel } from "components/SSSPTable/PeriodicTable/Element/Element.models";

const useAccuracy = () => {
  const [hoveredPseudo, setHoveredPSeudo] = useState("");
  const [hoveredElement, setHoveredElement] = useState<ElementModel>();

  return {
    hoveredPseudo,
    setHoveredPSeudo,
    hoveredElement,
    setHoveredElement,
  };
};

export default useAccuracy;
