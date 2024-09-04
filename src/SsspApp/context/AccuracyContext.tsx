import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

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
  defaultAccuracy: string;
}

export const AccuracyProvider: React.FC<AccuracyProviderProps> = ({
  children,
  defaultAccuracy,
}) => {
  const location = useLocation();
  const initialAccuracy = location?.pathname.split("/")[2] || defaultAccuracy;

  return (
    <AccuracyContext.Provider value={useAccuracy(initialAccuracy)}>
      {children}
    </AccuracyContext.Provider>
  );
};
