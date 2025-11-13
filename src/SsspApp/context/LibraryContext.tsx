import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const libraries = ["efficiency", "precision"];
  const defaultLibrary = libraries[0];
  const initialLibrary = location?.pathname.split("/")[2] || defaultLibrary;
  const [activeLibrary, setActiveLibrary] = useState(initialLibrary);

  return (
    <LibraryContext.Provider
      value={{ defaultLibrary, libraries, activeLibrary, setActiveLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
