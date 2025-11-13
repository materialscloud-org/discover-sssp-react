import { createContext, useState } from "react";

type LibraryContextType = {
  defaultLibrary: string;
  libraries: string[];
  activeLibrary: string;
  setActiveLibrary: React.Dispatch<React.SetStateAction<string>>;
};

export const LibraryContext = createContext({} as LibraryContextType);

type LibraryProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
}) => {
  const libraries = ["efficiency", "precision"];
  const defaultLibrary = libraries[0];
  const [activeLibrary, setActiveLibrary] = useState(libraries[0]);

  return (
    <LibraryContext.Provider
      value={{ defaultLibrary, libraries, activeLibrary, setActiveLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
