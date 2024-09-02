import elementSymbols from "./symbols.json";

import { ElementInfo, Metadata } from "./PeriodicTable.models";

import Element from "./Element";

class ElementsGenerator {
  private ssspData: { [key: string]: ElementInfo };
  private pseudoMetadata: { [key: string]: Metadata };

  constructor(
    ssspData: { [key: string]: ElementInfo },
    pseudoMetadata: { [key: string]: Metadata }
  ) {
    this.ssspData = ssspData;
    this.pseudoMetadata = pseudoMetadata;
  }

  public make(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => {
        const symbol = elementSymbols[i];
        const info = this.ssspData[symbol];
        const color = info
          ? this.pseudoMetadata[info.pseudopotential].background_color
          : "#dddddd";

        return (
          <Element
            key={i}
            number={i}
            symbol={symbol}
            color={color}
            info={info}
          />
        );
      }
    );
  }
}

export default ElementsGenerator;
