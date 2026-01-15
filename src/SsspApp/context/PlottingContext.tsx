import { PseudoConvergenceData } from "@sssp/models";
import { SsspDataService } from "@sssp/services";

import { createContext, useEffect, useState } from "react";

type PlottingContextType = {
  chessboardPseudos: string[];
  setChessboardPseudos: (pseudos: string[]) => void;
  chessboardBandShift: number;
  setChessboardBandShift: (number: number) => void;
  loadingConvergenceData: boolean;
  summaryData: PseudoConvergenceData;
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
  const [chessboardBandShift, setChessboardBandShift] = useState(0);
  const [loadingConvergenceData, setLoadingConvergenceData] = useState(true);
  const [summaryData, setSummaryData] = useState({} as PseudoConvergenceData);

  useEffect(() => {
    if (!element) return;

    setLoadingConvergenceData(true);
    setSummaryData({} as PseudoConvergenceData);
    setChessboardPseudos([]);
    setChessboardBandShift(0);

    SsspDataService.fetchPseudosSummaryData(element)
      .then((data) => {
        setSummaryData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSummaryData({} as PseudoConvergenceData);
      })
      .finally(() => {
        setLoadingConvergenceData(false);
      });
  }, [element]);

  return (
    <PlottingContext.Provider
      value={{
        chessboardPseudos,
        setChessboardPseudos,
        chessboardBandShift,
        setChessboardBandShift,
        loadingConvergenceData,
        summaryData,
      }}
    >
      {children}
    </PlottingContext.Provider>
  );
};
