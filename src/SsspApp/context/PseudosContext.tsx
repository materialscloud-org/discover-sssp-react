import { createContext, useEffect, useMemo, useState } from "react";

import { PseudosMetadata } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type PseudosContextType = {
  loadingMetadata: boolean;
  categories: string[];
  pseudosMetadata: PseudosMetadata;
  maxPseudoWidth: number;
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export const PseudosContext = createContext({} as PseudosContextType);

interface PseudosProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const PseudosProvider: React.FC<PseudosProviderProps> = ({
  children,
}) => {
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [categories, setCategories] = useState([] as string[]);
  const [pseudosMetadata, setPseudosMetadata] = useState({} as PseudosMetadata);
  const [activeCategories, setActiveCategories] = useState([] as string[]);

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

  return (
    <PseudosContext.Provider
      value={{
        loadingMetadata,
        categories,
        pseudosMetadata,
        maxPseudoWidth,
        activeCategories,
        setActiveCategories,
      }}
    >
      {children}
    </PseudosContext.Provider>
  );
};
