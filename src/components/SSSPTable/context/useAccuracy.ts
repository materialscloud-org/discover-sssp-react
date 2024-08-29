import { useState } from "react";

const useAccuracy = (initialAccuracy: string) => {
  const [activeAccuracy, setActiveAccuracy] = useState(initialAccuracy);

  return {
    activeAccuracy,
    setActiveAccuracy,
  };
};

export default useAccuracy;
