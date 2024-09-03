import { createContext, useState } from "react";

const useAccuracy = (initialAccuracy: string) => {
  const [activeAccuracy, setActiveAccuracy] = useState(initialAccuracy);

  return {
    activeAccuracy,
    setActiveAccuracy,
  };
};

export const AccuracyContext = createContext(
  {} as ReturnType<typeof useAccuracy>
);

interface AccuracyProviderProps {
  children: JSX.Element | JSX.Element[];
  initialAccuracy: string;
}

export const AccuracyProvider: React.FC<AccuracyProviderProps> = ({
  children,
  initialAccuracy,
}) => (
  <AccuracyContext.Provider value={useAccuracy(initialAccuracy)}>
    {children}
  </AccuracyContext.Provider>
);
