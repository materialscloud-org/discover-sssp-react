import Element from "./Element";
import { ElementInfo, Metadata } from "./PeriodicTable.models";

import element_symbols from "./symbols.json";

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
        const symbol = element_symbols[i];
        const elemInfo = this.ssspData[symbol];
        const color = elemInfo
          ? this.pseudoMetadata[elemInfo.pseudopotential].background_color
          : "#dddddd";

        return (
          <Element
            key={i}
            number={i}
            symbol={symbol}
            color={color}
            info={elemInfo}
          />
        );
      }
    );
  }
}

export default ElementsGenerator;
