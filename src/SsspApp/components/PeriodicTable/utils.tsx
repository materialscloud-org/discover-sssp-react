import elementSymbols from "./symbols.json";

import { PseudoMetadata, SsspData } from "@sssp/models";

import Element from "./Element";

class ElementsGenerator {
  private ssspData: SsspData;
  private pseudoMetadata: PseudoMetadata;

  constructor(ssspData: SsspData, pseudoMetadata: PseudoMetadata) {
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
