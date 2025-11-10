import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

type LibraryContextType = {
  activeLibrary: string;
  setActiveLibrary: React.Dispatch<React.SetStateAction<string>>;
};

export const LibraryContext = createContext({} as LibraryContextType);

type LibraryProviderProps = {
  children: JSX.Element | JSX.Element[];
  defaultLibrary: string;
};

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
  defaultLibrary,
}) => {
  const location = useLocation();
  const initialLibrary = location?.pathname.split("/")[2] || defaultLibrary;
  const [activeLibrary, setActiveLibrary] = useState(initialLibrary);

  return (
    <LibraryContext.Provider value={{ activeLibrary, setActiveLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};
