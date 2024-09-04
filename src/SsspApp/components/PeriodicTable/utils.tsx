import elementSymbols from "./symbols.json";

import { PseudosMetadata, ElementsInfo } from "@sssp/models";

import Element from "./Element";

class ElementsGenerator {
  private elementsInfo: ElementsInfo;
  private pseudosMetadata: PseudosMetadata;

  constructor(elementsInfo: ElementsInfo, pseudosMetadata: PseudosMetadata) {
    this.elementsInfo = elementsInfo;
    this.pseudosMetadata = pseudosMetadata;
  }

  public make(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => {
        const symbol = elementSymbols[i];
        const info = this.elementsInfo[symbol];
        const color = info
          ? info.pseudopotential in this.pseudosMetadata
            ? this.pseudosMetadata[info.pseudopotential].background_color
            : "#66b3b3"
          : "#ddd";

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
