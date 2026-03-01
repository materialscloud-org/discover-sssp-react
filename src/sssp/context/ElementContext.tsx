import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ElementInfo, ElementsInfo } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { FamilyContext } from "./FamilyContext";

type SsspPseudos = {
  efficiency: ElementInfo;
  precision: ElementInfo;
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
  const { activeFunctional } = useContext(FamilyContext);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [elementsInfo, setElementsInfo] = useState({} as ElementsInfo);
  const [element, setElement] = useState("");

  useEffect(() => {
    SsspDataService.fetchElementsInfo(activeFunctional)
      .then((info) => {
        setElementsInfo(info);
      })
      .catch((error) => {
        console.error("Error fetching elements info:", error);
      })
      .finally(() => {
        setLoadingInfo(false);
      });
  }, [activeFunctional]);

  const ssspPseudos = useMemo(
    () =>
      ({
        efficiency: elementsInfo?.efficiency?.[element],
        precision: elementsInfo?.precision?.[element],
      }) as SsspPseudos,
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
