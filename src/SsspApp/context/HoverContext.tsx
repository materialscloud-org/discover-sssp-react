import { createContext, useRef, useState } from "react";

import { ElementModel } from "@sssp/models";

type HoverContextType = {
  hoveredPseudo: string;
  setHoveredPseudo: React.Dispatch<React.SetStateAction<string>>;
  hoveredElement?: ElementModel;
  setHoveredElement: React.Dispatch<
    React.SetStateAction<ElementModel | undefined>
  >;
};

export const HoverContext = createContext({} as HoverContextType);

type HoverProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredPseudo, setHoveredPseudo] = useState("");
  const [hoveredElement, setHoveredElement] = useState<ElementModel>();
  const timeoutRef = useRef<number | undefined>();

  const debounceHoverHandler = (handler: React.Dispatch<any>) => {
    return (value: any) => {
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
