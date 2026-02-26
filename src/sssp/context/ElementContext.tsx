import { createContext, useEffect, useMemo, useState } from "react";

import { ElementsInfo } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type SsspPseudos = {
  efficiency?: string;
  precision?: string;
};

type ElementContextType = {
  loadingInfo: boolean;
  element: string;
  elementsInfo: ElementsInfo;
  setElement: (element: string) => void;
  ssspPseudos: SsspPseudos;
};

export const ElementContext = createContext({} as ElementContextType);

interface ElementProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ElementProvider: React.FC<ElementProviderProps> = ({
  children,
}) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [elementsInfo, setElementsInfo] = useState({} as ElementsInfo);
  const [element, setElement] = useState("");

  useEffect(() => {
    SsspDataService.fetchElementsInfo()
      .then((info) => {
        setElementsInfo(info);
      })
      .catch((error) => {
        console.error("Error fetching elements info:", error);
      })
      .finally(() => {
        setLoadingInfo(false);
      });
  }, []);

  const ssspPseudos = useMemo(
    () =>
      Object.keys(elementsInfo).length
        ? {
            efficiency: elementsInfo.efficiency[element]?.pseudopotential,
            precision: elementsInfo.precision[element]?.pseudopotential,
          }
        : ({} as SsspPseudos),
    [element, elementsInfo],
  );

  return (
    <ElementContext.Provider
      value={{
        loadingInfo,
        elementsInfo,
        element,
        setElement,
        ssspPseudos,
      }}
    >
      {children}
    </ElementContext.Provider>
  );
};
