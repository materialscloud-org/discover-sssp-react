import { createContext, useEffect, useMemo, useState } from "react";

import { CategorizedPseudosMetadata } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type PseudosContextType = {
  loadingMetadata: boolean;
  categories: string[];
  categorizedPseudosMetadata: CategorizedPseudosMetadata;
  allPseudos: string[];
  maxPseudoWidth: number;
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
  activePseudos: string[];
  setActivePseudos: (pseudos: string[]) => void;
};

export const PseudosContext = createContext({} as PseudosContextType);

interface PseudosProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const PseudosProvider: React.FC<PseudosProviderProps> = ({
  children,
}) => {
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorizedPseudosMetadata, setCategorizedPseudosMetadata] =
    useState<CategorizedPseudosMetadata>({});
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activePseudos, setActivePseudos] = useState<string[]>(["REF"]);

  const allPseudos = useMemo(
    () => Object.values(categorizedPseudosMetadata).flatMap(Object.keys),
    [categorizedPseudosMetadata]
  );

  const maxPseudoWidth = useMemo(
    () => Math.max(...allPseudos.map((pseudo) => pseudo.length * 12)),
    [allPseudos]
  );

  useEffect(() => {
    SsspDataService.fetchPseudosMetadata()
      .then((metadata) => {
        setCategorizedPseudosMetadata(metadata);
        setCategories(Object.keys(metadata));
        setActiveCategories(Object.keys(metadata));
      })
      .catch((error) => {
        console.error("Error fetching pseudos metadata:", error);
      })
      .finally(() => {
        setLoadingMetadata(false);
      });
  }, []);

  const alwaysIncludeRef = (pseudos: string[]) => {
    setActivePseudos(!pseudos.includes("REF") ? ["REF", ...pseudos] : pseudos);
  };

  return (
    <PseudosContext.Provider
      value={{
        loadingMetadata,
        categories,
        categorizedPseudosMetadata,
        allPseudos,
        maxPseudoWidth,
        activeCategories,
        setActiveCategories,
        activePseudos,
        setActivePseudos: alwaysIncludeRef,
      }}
    >
      {children}
    </PseudosContext.Provider>
  );
};
