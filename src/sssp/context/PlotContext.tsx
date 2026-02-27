import { createContext, useContext, useEffect, useState } from "react";

import {
  BandsPseudosMap,
  EosPseudosMap,
  PseudoConvergenceData,
} from "@sssp/models";
import SsspDataService from "@sssp/services/data";

import { ElementContext } from "./ElementContext";

type PlotContextType = {
  // Convergence data
  loadingPlotData?: boolean;
  convergenceData: PseudoConvergenceData;
  // EoS data
  eosPseudosMap: EosPseudosMap;
  eosPseudos: string[];
  activeEosPseudos: string[];
  setActiveEosPseudos: (pseudos: string[]) => void;
  // Chessboard data
  chessboardPseudos: string[];
  etaV: number[][];
  etaV10: number[][];
  shifts: number[][][];
  // Bands data
  bandsPseudosMap: BandsPseudosMap;
  bandsPseudos: string[];
  activeBandsPseudos: string[];
  setActiveBandsPseudos: (pseudos: string[]) => void;
  // Cross-bands data
  activeChessboardPseudos: string[];
  setActiveChessboardPseudos: (pseudos: string[]) => void;
  bandShift: number;
  setBandShift: (number: number) => void;
};

export const PlotContext = createContext({} as PlotContextType);

type PlotProviderProps = {
  children: JSX.Element | JSX.Element[];
  element?: string;
};

export const PlotProvider: React.FC<PlotProviderProps> = ({ children }) => {
  const { element, ssspPseudos } = useContext(ElementContext);

  const [loadingPlotData, setLoadingPlotData] = useState(true);

  // Convergence data
  const [convergenceData, setConvergenceData] = useState(
    {} as PseudoConvergenceData,
  );

  // EoS data
  const [eosPseudosMap, setEosPseudosMap] = useState({} as EosPseudosMap);
  const [eosPseudos, setEosPseudos] = useState([] as string[]);
  const [activeEosPseudos, setActiveEosPseudos] = useState([] as string[]);

  // Chessboard data
  const [chessboardPseudos, setChessboardPseudos] = useState([] as string[]);
  const [etaV, setEtaV] = useState([] as number[][]);
  const [etaV10, setEtaV10] = useState([] as number[][]);
  const [shifts, setShifts] = useState([] as number[][][]);

  // Bands data
  const [bandsPseudosMap, setBandsPseudosMap] = useState({} as BandsPseudosMap);
  const [bandsPseudos, setBandsPseudos] = useState([] as string[]);
  const [activeBandsPseudos, setActiveBandsPseudos] = useState([] as string[]);

  // Cross-bands data
  const [activeChessboardPseudos, setActiveChessboardPseudos] = useState(
    [] as string[],
  );
  const [bandShift, setBandShift] = useState(0);

  useEffect(() => {
    if (!element) return;

    setLoadingPlotData(true);

    setConvergenceData({} as PseudoConvergenceData);

    setEosPseudosMap({} as EosPseudosMap);
    setEosPseudos([]);
    setActiveEosPseudos([]);

    setChessboardPseudos([]);
    setEtaV([]);
    setEtaV10([]);
    setShifts([]);

    setBandsPseudosMap({} as BandsPseudosMap);
    setBandsPseudos([]);
    setActiveBandsPseudos([]);

    setBandShift(0);

    const ssspPseudoLibraries = Object.values(ssspPseudos)
      .flat()
      .map((pseudo) => pseudo && `${pseudo.library}-Z=${pseudo.Z}`);

    Promise.all([
      SsspDataService.fetchPseudosConvergenceData(element),
      SsspDataService.fetchEosData(element),
      SsspDataService.fetchBandChessboardData(element),
      SsspDataService.fetchBandsData(element),
    ])
      .then(([convergenceData, eosData, chessboardData, bandsData]) => {
        setConvergenceData(convergenceData);

        setEosPseudosMap(eosData);
        const eosPseudos = Object.keys(eosData);
        setEosPseudos(eosPseudos);
        setActiveEosPseudos(ssspPseudoLibraries);

        setChessboardPseudos(chessboardData.pseudos);
        setEtaV(chessboardData.v_distance.eta);
        setEtaV10(chessboardData.v10_distance.eta);
        const bandShifts = [
          chessboardData.v_distance.shift,
          chessboardData.v10_distance.shift,
        ];
        setShifts(bandShifts);

        setBandsPseudosMap(bandsData);
        const bandsPseudos = Object.keys(bandsData);
        setBandsPseudos(bandsPseudos);
      })
      .catch((error) => {
        console.error("Error fetching plot data:", error);

        setConvergenceData({} as PseudoConvergenceData);

        setEosPseudosMap({} as EosPseudosMap);
        setEosPseudos([]);
        setActiveEosPseudos([]);

        setChessboardPseudos([]);
        setEtaV([]);
        setEtaV10([]);
        setShifts([]);

        setBandsPseudosMap({} as BandsPseudosMap);
        setBandsPseudos([]);
      })
      .finally(() => {
        setLoadingPlotData(false);
      });
  }, [element, ssspPseudos]);

  useEffect(() => {
    const isValidPair = (pair: string[]) =>
      pair.length === 2 && pair.every((p) => bandsPseudos.includes(p));

    const samePair = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    if (!bandsPseudos.length) {
      setActiveBandsPseudos((prev) => (prev.length ? [] : prev));
      return;
    }

    setActiveBandsPseudos((prev) => {
      let nextActive: string[] = [bandsPseudos[0], bandsPseudos[0]];

      if (isValidPair(activeChessboardPseudos))
        nextActive = activeChessboardPseudos;
      else if (isValidPair(prev)) nextActive = prev;

      return samePair(prev, nextActive) ? prev : nextActive;
    });
  }, [bandsPseudos, activeChessboardPseudos]);

  return (
    <PlotContext.Provider
      value={{
        // Convergence data
        loadingPlotData: loadingPlotData,
        convergenceData,
        // EoS data
        eosPseudosMap,
        eosPseudos,
        activeEosPseudos,
        setActiveEosPseudos,
        // Chessboard data
        chessboardPseudos,
        etaV,
        etaV10,
        shifts,
        // Bands data
        bandsPseudosMap,
        bandsPseudos,
        activeBandsPseudos,
        setActiveBandsPseudos,
        // Cross-bands data
        activeChessboardPseudos,
        setActiveChessboardPseudos,
        bandShift,
        setBandShift,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};
