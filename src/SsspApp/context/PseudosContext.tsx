import { createContext, useEffect, useState } from "react";

import { PseudosMetadata } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

type PseudosContextType = {
  loadingMetadata: boolean;
  pseudosMetadata: PseudosMetadata;
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
  const [pseudosMetadata, setPseudosMetadata] = useState<PseudosMetadata>({});
  const [activePseudos, setActivePseudos] = useState<string[]>([]);

  useEffect(() => {
    SsspDataService.fetchPseudosMetadata()
      .then((metadata) => {
        setPseudosMetadata(metadata);
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
        pseudosMetadata,
        activePseudos,
        setActivePseudos: alwaysIncludeRef,
      }}
    >
      {children}
    </PseudosContext.Provider>
  );
};
