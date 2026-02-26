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
  loadingConvergenceData?: boolean;
  convergenceData: PseudoConvergenceData;
  // EoS data
  loadingEosData: boolean;
  eosPseudosMap: EosPseudosMap;
  eosPseudos: string[];
  activeEosPseudos: string[];
  setActiveEosPseudos: (pseudos: string[]) => void;
  // Chessboard data
  loadingChessboardData: boolean;
  chessboardPseudos: string[];
  etaV: number[][];
  etaV10: number[][];
  shifts: number[][][];
  // Bands data
  loadingBandsData: boolean;
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
  const { element } = useContext(ElementContext);

  // Convergence data
  const [loadingConvergenceData, setLoadingConvergenceData] = useState(true);
  const [convergenceData, setConvergenceData] = useState(
    {} as PseudoConvergenceData,
  );

  // EoS data
  const [loadingEosData, setLoadingEosData] = useState(true);
  const [eosPseudosMap, setEosPseudosMap] = useState({} as EosPseudosMap);
  const [eosPseudos, setEosPseudos] = useState([] as string[]);
  const [activeEosPseudos, setActiveEosPseudos] = useState([] as string[]);

  // Chessboard data
  const [loadingChessboardData, setLoadingChessboardData] = useState(true);
  const [chessboardPseudos, setChessboardPseudos] = useState([] as string[]);
  const [etaV, setEtaV] = useState([] as number[][]);
  const [etaV10, setEtaV10] = useState([] as number[][]);
  const [shifts, setShifts] = useState([] as number[][][]);

  // Bands data
  const [loadingBandsData, setLoadingBandsData] = useState(true);
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

    setLoadingConvergenceData(true);
    setConvergenceData({} as PseudoConvergenceData);

    // console.log("fetching convergence");

    SsspDataService.fetchPseudosConvergenceData(element)
      .then((data) => {
        setConvergenceData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setConvergenceData({} as PseudoConvergenceData);
      })
      .finally(() => {
        setLoadingConvergenceData(false);
      });
  }, [element]);

  useEffect(() => {
    if (!element) return;

    setLoadingEosData(true);
    setEosPseudosMap({} as EosPseudosMap);
    setEosPseudos([]);
    setActiveEosPseudos([]);

    // console.log("fetching eos");

    SsspDataService.fetchEosData(element)
      .then((data) => {
        setEosPseudosMap(data);
        const pseudos = Object.keys(data);
        setEosPseudos(pseudos);
        setActiveEosPseudos(pseudos);
      })
      .catch((error) => {
        console.error("Error fetching EOS data:", error);
        setEosPseudosMap({} as EosPseudosMap);
        setEosPseudos([]);
        setActiveEosPseudos([]);
      })
      .finally(() => setLoadingEosData(false));
  }, [element]);

  useEffect(() => {
    if (!element) return;

    setLoadingChessboardData(true);
    setChessboardPseudos([]);
    setEtaV([]);
    setEtaV10([]);
    setShifts([]);

    // console.log("fetching chessboards");

    SsspDataService.fetchBandChessboardData(element)
      .then((data) => {
        setChessboardPseudos(data.pseudos);
        setEtaV(data.v_distance.eta);
        setEtaV10(data.v10_distance.eta);
        const bandShifts = [data.v_distance.shift, data.v10_distance.shift];
        setShifts(bandShifts);
      })
      .catch((error) => {
        console.error("Error fetching band chessboard data:", error);
        setChessboardPseudos([]);
        setEtaV([]);
        setEtaV10([]);
        setShifts([]);
      })
      .finally(() => {
        setLoadingChessboardData(false);
      });
  }, [element]);

  useEffect(() => {
    if (!element) return;

    setLoadingBandsData(true);
    setBandsPseudosMap({} as BandsPseudosMap);
    setBandsPseudos([]);
    setActiveBandsPseudos([]);

    // console.log("fetching bands");

    SsspDataService.fetchBandsData(element)
      .then((data) => {
        setBandsPseudosMap(data);
        const pseudos = data && Object.keys(data);
        setBandsPseudos(pseudos);
      })
      .catch((error) => {
        console.error("Error fetching bands data:", error);
        setBandsPseudosMap({} as BandsPseudosMap);
        setBandsPseudos([]);
      })
      .finally(() => {
        setLoadingBandsData(false);
      });
  }, [element]);

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
        loadingConvergenceData,
        convergenceData,
        // EoS data
        loadingEosData,
        eosPseudosMap,
        eosPseudos,
        activeEosPseudos,
        setActiveEosPseudos,
        // Chessboard data
        loadingChessboardData,
        chessboardPseudos,
        etaV,
        etaV10,
        shifts,
        // Bands data
        loadingBandsData,
        bandsPseudosMap,
        bandsPseudos,
        activeBandsPseudos,
        setActiveBandsPseudos,
        // Cross-bands data
        activeChessboardPseudos,
        setActiveChessboardPseudos,
        bandShift: bandShift,
        setBandShift: setBandShift,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};
