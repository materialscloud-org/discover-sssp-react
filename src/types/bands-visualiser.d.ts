declare module "bands-visualiser" {
  export function BandsVisualiser(
    container: HTMLDivElement,
    options: {
      bandsDataArray: {
        bandsData: any;
        dosData?: any;
        traceFormat?: any;
      }[];
      settings?: {
        showlegend?: boolean;
      };
    }
  ): void;
}
