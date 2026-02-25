import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  BandsCalcUUIDsMap,
  Citation,
  MethodMetadata,
  PseudoFilenames,
  PseudoLibraryMetadata,
  PseudosMetadata,
} from "@sssp/models";
import { SsspDataService } from "@sssp/services";
import { ElementContext } from "./ElementContext";

type PseudoContextType = {
  loadingMetadata: boolean;
  loadingFiles: boolean;
  verificationMetadata: Record<string, Citation>;
  libraryMetadata: Record<string, PseudoLibraryMetadata>;
  methodsMetadata: Record<string, MethodMetadata>;
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
  const [verificationMetadata, setVerificationMetadata] = useState(
    {} as Record<string, Citation>,
  );
  const [libraryMetadata, setLibraryMetadata] = useState(
    {} as Record<string, PseudoLibraryMetadata>,
  );
  const [methodsMetadata, setMethodsMetadata] = useState(
    {} as Record<string, MethodMetadata>,
  );
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
    setLoadingMetadata(true);

    Promise.all([
      SsspDataService.fetchPseudosVerificationMetadata(),
      SsspDataService.fetchPseudoslibraryMetadata(),
      SsspDataService.fetchPseudosMethodsMetadata(),
      SsspDataService.fetchPseudosMetadata(),
    ])
      .then(([verificationMeta, libraryMeta, methodsMeta, pseudosMeta]) => {
        setVerificationMetadata(verificationMeta || {});
        setLibraryMetadata(libraryMeta || {});
        setMethodsMetadata(methodsMeta || {});
        setPseudosMetadata(pseudosMeta || {});
        const uniqueCategories = new Set<string>();
        Object.values(pseudosMeta || {}).forEach((meta) => {
          uniqueCategories.add(meta.category);
        });
        setCategories([...uniqueCategories]);
      })
      .catch((error) => {
        console.error("Error fetching pseudos metadata:", error);
        setVerificationMetadata({});
        setLibraryMetadata({});
        setMethodsMetadata({});
        setPseudosMetadata({});
        setCategories([]);
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
  }, [categories, element]);

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
        verificationMetadata,
        libraryMetadata,
        methodsMetadata,
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
