import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

const useLibrary = (initialLibrary: string) => {
  const [activeLibrary, setActiveLibrary] = useState(initialLibrary);

  return {
    activeLibrary,
    setActiveLibrary,
  };
};

export const LibraryContext = createContext(
  {} as ReturnType<typeof useLibrary>
);

interface LibraryProviderProps {
  children: JSX.Element | JSX.Element[];
  defaultLibrary: string;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({
  children,
  defaultLibrary,
}) => {
  const location = useLocation();
  const initialLibrary = location?.pathname.split("/")[2] || defaultLibrary;

  return (
    <LibraryContext.Provider value={useLibrary(initialLibrary)}>
      {children}
    </LibraryContext.Provider>
  );
};
