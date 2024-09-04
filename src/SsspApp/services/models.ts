interface ApiElementInfo {
  elementClass: string;
  filename: string;
  md5: string;
  rho_cutoff: number;
  sub1: number;
  sub2: number;
}

export type ApiPseudosResponseType = { [key: string]: ApiElementInfo };
