import { useLocation } from "react-router-dom";

import { urlBase } from "common/config";

const useSSSPTypeLocation = (): string => {
  const location = useLocation();
  return location.pathname.split(urlBase)[1].split("/")[1];
};

export default useSSSPTypeLocation;
