import { createContext, useRef, useState } from "react";

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
  const timeoutRef = useRef<number>();

  const debounceHoverHandler = <T,>(handler: (value: T) => void) => {
    return (value: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        handler(value);
      }, 10);
    };
  };

  return (
    <HoverContext.Provider
      value={{
        hoveredPseudo,
        setHoveredPseudo: debounceHoverHandler(setHoveredPseudo),
        hoveredElement,
        setHoveredElement: debounceHoverHandler(setHoveredElement),
      }}
    >
      {children}
    </HoverContext.Provider>
  );
};
