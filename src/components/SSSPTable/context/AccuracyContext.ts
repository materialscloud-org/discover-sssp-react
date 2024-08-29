import { createContext } from "react";

import useAccuracy from "./useAccuracy";

const AccuracyContext = createContext({} as ReturnType<typeof useAccuracy>);

export default AccuracyContext;
