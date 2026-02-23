import { createContext, useState } from "react";

import { ElementModel } from "@sssp/models";

type HoverContextType = {
  hoveredPseudo: string;
  setHoveredPseudo: (value: string) => void;
  hoveredElement?: ElementModel;
  setHoveredElement: (value?: ElementModel) => void;
};

export const HoverContext = createContext({} as HoverContextType);

type HoverProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredPseudo, setHoveredPseudo] = useState("");
  const [hoveredElement, setHoveredElement] = useState<ElementModel>();

  return (
    <HoverContext.Provider
      value={{
        hoveredPseudo,
        setHoveredPseudo,
        hoveredElement,
        setHoveredElement,
      }}
    >
      {children}
    </HoverContext.Provider>
  );
};
