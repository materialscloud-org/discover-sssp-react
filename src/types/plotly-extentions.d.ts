import "plotly.js";

declare module "plotly.js" {
  interface Axis {
    ticklabelstandoff?: number;
  }
}
