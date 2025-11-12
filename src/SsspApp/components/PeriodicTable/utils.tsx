import elementSymbols from "./symbols.json";

import { PseudosMetadata, LibraryElementsInfo } from "@sssp/models";

import Element from "./Element";

class ElementsGenerator {
  private libraryElementsInfo: LibraryElementsInfo;
  private pseudosMetadata: PseudosMetadata;

  constructor(
    libraryElementsInfo: LibraryElementsInfo,
    pseudosMetadata: PseudosMetadata
  ) {
    this.libraryElementsInfo = libraryElementsInfo;
    this.pseudosMetadata = pseudosMetadata;
  }

  public make(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => {
        const symbol = elementSymbols[i];
        const info = this.libraryElementsInfo[symbol];
        const color = info
          ? info.pseudopotential in this.pseudosMetadata
            ? this.pseudosMetadata[info.pseudopotential].color
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
