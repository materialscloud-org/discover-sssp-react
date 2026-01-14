import { createContext, useEffect, useState } from "react";

type PlottingContextType = {
  chessboardPseudos: string[];
  setChessboardPseudos: React.Dispatch<React.SetStateAction<string[]>>;
  chessboardBandShift: number;
  setChessboardBandShift: React.Dispatch<React.SetStateAction<number>>;
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
  const [chessboardPseudos, setChessboardPseudos] = useState<string[]>([]);
  const [chessboardBandShift, setChessboardBandShift] = useState(0);

  useEffect(() => {
    setChessboardPseudos([]);
    setChessboardBandShift(0);
  }, [element]);

  return (
    <PlottingContext.Provider
      value={{
        chessboardPseudos,
        setChessboardPseudos,
        chessboardBandShift,
        setChessboardBandShift,
      }}
    >
      {children}
    </PlottingContext.Provider>
  );
};
