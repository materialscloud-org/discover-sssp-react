import { createContext, useEffect, useMemo, useState } from "react";

import {
  BandsCalcUUIDsMap,
  PseudoFilenames,
  PseudosMetadata,
} from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type PseudosContextType = {
  loadingMetadata: boolean;
  loadingFiles: boolean;
  categories: string[];
  pseudosMetadata: PseudosMetadata;
  bandsCalcUUIDs: BandsCalcUUIDsMap;
  pseudoFilenames: PseudoFilenames;
  maxPseudoWidth: number;
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  getUpfUuid: (element: string, pseudoName: string, zVal: number) => string;
  getPseudoFilename: (
    element: string,
    pseudoName: string,
    zVal: number
  ) => string;
};

export const PseudosContext = createContext({} as PseudosContextType);

interface PseudosProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const PseudosProvider: React.FC<PseudosProviderProps> = ({
  children,
}) => {
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [categories, setCategories] = useState([] as string[]);
  const [pseudosMetadata, setPseudosMetadata] = useState({} as PseudosMetadata);
  const [activeCategories, setActiveCategories] = useState([] as string[]);
  const [bandsCalcUUIDs, setBandsCalcUUIDs] = useState({} as BandsCalcUUIDsMap);
  const [pseudoFilenames, setPseudoFilenames] = useState({} as PseudoFilenames);

  const maxPseudoWidth = useMemo(
    () =>
      Math.max(
        ...Object.keys(pseudosMetadata).map((pseudo) => pseudo.length * 12)
      ),
    [pseudosMetadata]
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

  const getUpfUuid = (element: string, pseudoName: string, zVal: number) => {
    const key = `${pseudoName}-${zVal}`;
    return bandsCalcUUIDs?.[element]?.[key]?.upf || "";
  };

  const getPseudoFilename = (
    element: string,
    pseudoName: string,
    zVal: number
  ) => {
    const key = `${pseudoName}-${zVal}`;
    return pseudoFilenames?.[element]?.[key] || "";
  };

  return (
    <PseudosContext.Provider
      value={{
        loadingMetadata,
        loadingFiles,
        categories,
        pseudosMetadata,
        bandsCalcUUIDs,
        pseudoFilenames,
        maxPseudoWidth,
        activeCategories,
        setActiveCategories,
        getUpfUuid,
        getPseudoFilename,
      }}
    >
      {children}
    </PseudosContext.Provider>
  );
};
