import { createContext } from "react";

import useHover from "./useHover";

const HoverContext = createContext({} as ReturnType<typeof useHover>);

export default HoverContext;
