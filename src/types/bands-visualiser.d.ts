declare module "bands-visualiser" {
  import { Layout } from "plotly.js";

  export function BandsVisualiser(
    container: HTMLDivElement,
    options: {
      bandsDataArray: {
        bandsData: any;
        dosData?: any;
        traceFormat?: any;
      }[];
      settings?: Partial<Layout>;
    },
  ): void;
}
