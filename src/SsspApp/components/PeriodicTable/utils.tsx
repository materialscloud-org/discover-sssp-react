import { LibraryElementsInfo, PseudosMetadata } from "@sssp/models";

import Element from "./Element";

class ElementsGenerator {
  private elementsList: string[];
  private libraryElementsInfo: LibraryElementsInfo;
  private pseudosMetadata: PseudosMetadata;

  constructor(
    elementsList: string[],
    libraryElementsInfo: LibraryElementsInfo,
    pseudosMetadata: PseudosMetadata
  ) {
    this.elementsList = elementsList;
    this.libraryElementsInfo = libraryElementsInfo;
    this.pseudosMetadata = pseudosMetadata;
  }

  public make(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => {
        const symbol = this.elementsList[i - 1];
        const info = this.libraryElementsInfo[symbol];
        const color = info
          ? info.pseudopotential in this.pseudosMetadata
            ? this.pseudosMetadata[info.pseudopotential].color
            : "#ddd"
          : "#fff";

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
