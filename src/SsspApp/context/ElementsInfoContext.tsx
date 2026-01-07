import { createContext, useEffect, useMemo, useState } from "react";

import { ElementsInfo } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type ElementsInfoContextType = {
  loadingInfo: boolean;
  elementsList: string[];
  elementsInfo: ElementsInfo;
};

export const ElementsInfoContext = createContext({} as ElementsInfoContextType);

interface ElementsInfoProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ElementsInfoProvider: React.FC<ElementsInfoProviderProps> = ({
  children,
}) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [elementsInfo, setElementsInfo] = useState({} as ElementsInfo);

  const elementsList = useMemo(
    () => Object.values(elementsInfo).flatMap(Object.keys),
    [elementsInfo]
  );

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

  return (
    <ElementsInfoContext.Provider
      value={{
        loadingInfo,
        elementsList,
        elementsInfo,
      }}
    >
      {children}
    </ElementsInfoContext.Provider>
  );
};
