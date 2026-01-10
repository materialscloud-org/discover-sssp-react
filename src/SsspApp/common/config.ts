// get the base url subpath from vite.config.ts (base:)
export const BASE_URL = import.meta.env.BASE_URL || "/";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const DATA_URL = isLocal
  ? `${BASE_URL}/data`
  : "https://raw.githubusercontent.com/materialscloud-org/discover-sssp-react/refs/heads/main/public/data";

export const API_URL = import.meta.env.VITE_API_URL;
