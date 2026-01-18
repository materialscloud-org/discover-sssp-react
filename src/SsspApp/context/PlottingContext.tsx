import { createContext, useEffect, useState } from "react";

type PlottingContextType = {
  chessboardPseudos: string[];
  setChessboardPseudos: (pseudos: string[]) => void;
  bandShift: number;
  setBandShift: (number: number) => void;
};

export const PlottingContext = createContext({} as PlottingContextType);

type PlottingProviderProps = {
  children: JSX.Element | JSX.Element[];
  element?: string;
};

export const PlottingProvider: React.FC<PlottingProviderProps> = ({
  children,
  element,
}) => {
  const [chessboardPseudos, setChessboardPseudos] = useState([] as string[]);
  const [bandShift, setBandShift] = useState(0);

  useEffect(() => {
    setChessboardPseudos([]);
    setBandShift(0);
  }, [element]);

  return (
    <PlottingContext.Provider
      value={{
        chessboardPseudos,
        setChessboardPseudos,
        bandShift: bandShift,
        setBandShift: setBandShift,
      }}
    >
      {children}
    </PlottingContext.Provider>
  );
};
