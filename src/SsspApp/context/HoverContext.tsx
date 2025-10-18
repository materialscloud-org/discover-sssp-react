import { createContext, useState } from "react";

import { ElementModel } from "@sssp/models";

const useHover = () => {
  const [hoveredPseudo, setHoveredPSeudo] = useState("");
  const [hoveredElement, setHoveredElement] = useState<ElementModel>();

  return {
    hoveredPseudo,
    setHoveredPSeudo,
    hoveredElement,
    setHoveredElement,
  };
};

export const HoverContext = createContext({} as ReturnType<typeof useHover>);

interface HoverProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => (
  <HoverContext.Provider value={useHover()}>{children}</HoverContext.Provider>
);
