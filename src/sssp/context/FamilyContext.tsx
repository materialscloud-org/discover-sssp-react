import { createContext, useState } from "react";

type FamilyContextType = {
  defaultLibrary: string;
  libraries: string[];
  activeLibrary: string;
  setActiveLibrary: React.Dispatch<React.SetStateAction<string>>;
  defaultFunctional: string;
  functionals: string[];
  activeFunctional: string;
  setActiveFunctional: React.Dispatch<React.SetStateAction<string>>;
};

export const FamilyContext = createContext({} as FamilyContextType);

type FamilyProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const libraries = ["efficiency", "precision"];
  const defaultLibrary = libraries[0];
  const [activeLibrary, setActiveLibrary] = useState(libraries[0]);

  const functionals = ["PBE"];
  const defaultFunctional = functionals[0];
  const [activeFunctional, setActiveFunctional] = useState(defaultFunctional);

  return (
    <FamilyContext.Provider
      value={{
        defaultLibrary,
        libraries,
        activeLibrary,
        setActiveLibrary,
        defaultFunctional,
        functionals,
        activeFunctional,
        setActiveFunctional,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};
