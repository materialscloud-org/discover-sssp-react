const REST_API_ELEMENTS =
  "https://dev-www.materialscloud.org/mcloud/api/v2/discover/sssp/elements";

export const fetchElementData = async (symbol: string) => {
  const response = await fetch(`${REST_API_ELEMENTS}/${symbol}`);
  const data = await response.json();
  return data;
};
