import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  BandsCalcUUIDsMap,
  PseudoFilenames,
  PseudosMetadata,
} from "@sssp/models";
import { SsspDataService } from "@sssp/services";
import { ElementContext } from "./ElementContext";

type PseudoContextType = {
  loadingMetadata: boolean;
  loadingFiles: boolean;
  pseudosMetadata: PseudosMetadata;
  categories: string[];
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  bandsCalcUUIDs: BandsCalcUUIDsMap;
  pseudoFilenames: PseudoFilenames;
  maxPseudoWidth: number;
  getUpfUuid: (element: string, pseudoName: string, zVal: number) => string;
  getPseudoFilename: (
    element: string,
    pseudoName: string,
    zVal: number,
  ) => string;
};

export const PseudoContext = createContext({} as PseudoContextType);

interface PseudoProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const PseudoProvider: React.FC<PseudoProviderProps> = ({ children }) => {
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const { element } = useContext(ElementContext);
  const [pseudosMetadata, setPseudosMetadata] = useState({} as PseudosMetadata);
  const [categories, setCategories] = useState([] as string[]);
  const [activeCategories, setActiveCategories] = useState(categories);
  const [bandsCalcUUIDs, setBandsCalcUUIDs] = useState({} as BandsCalcUUIDsMap);
  const [pseudoFilenames, setPseudoFilenames] = useState({} as PseudoFilenames);

  const maxPseudoWidth = useMemo(
    () =>
      Math.max(
        ...Object.keys(pseudosMetadata).map((pseudo) => pseudo.length * 12),
      ),
    [pseudosMetadata],
  );

  useEffect(() => {
    SsspDataService.fetchPseudosMetadata()
      .then((metadata) => {
        setPseudosMetadata(metadata);
        const uniqueCategories = new Set<string>();
        Object.values(metadata).forEach((meta) => {
          uniqueCategories.add(meta.category);
        });
        setCategories([...uniqueCategories]);
        setActiveCategories([...uniqueCategories]);
      })
      .catch((error) => {
        console.error("Error fetching pseudos metadata:", error);
      })
      .finally(() => {
        setLoadingMetadata(false);
      });
  }, []);

  useEffect(() => {
    setLoadingFiles(true);

    Promise.all([
      SsspDataService.fetchBandsCalcUUIDsAll(),
      SsspDataService.fetchPseudoFilenames(),
    ])
      .then(([bands, filenames]) => {
        setBandsCalcUUIDs(bands || {});
        setPseudoFilenames(filenames || {});
      })
      .catch((error) => {
        console.error("Error fetching pseudo-related files:", error);
        setBandsCalcUUIDs({});
        setPseudoFilenames({});
      })
      .finally(() => {
        setLoadingFiles(false);
      });
  }, []);

  useEffect(() => {
    setActiveCategories(categories);
  }, [element]);

  const getUpfUuid = (element: string, pseudoName: string, zVal: number) => {
    const key = `${pseudoName}-${zVal}`;
    return bandsCalcUUIDs?.[element]?.[key]?.upf || "";
  };

  const getPseudoFilename = (
    element: string,
    pseudoName: string,
    zVal: number,
  ) => {
    const key = `${pseudoName}-${zVal}`;
    return pseudoFilenames?.[element]?.[key] || "";
  };

  return (
    <PseudoContext.Provider
      value={{
        loadingMetadata,
        loadingFiles,
        pseudosMetadata,
        categories,
        activeCategories,
        setActiveCategories,
        bandsCalcUUIDs,
        pseudoFilenames,
        maxPseudoWidth,
        getUpfUuid,
        getPseudoFilename,
      }}
    >
      {children}
    </PseudoContext.Provider>
  );
};
