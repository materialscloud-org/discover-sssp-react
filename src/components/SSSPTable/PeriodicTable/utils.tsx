import element_symbols from "./symbols.json";

import { ElementModel } from "./Element/Element.models";
import { ElementInfo, Metadata } from "./PeriodicTable.models";

import Element from "./Element";

class ElementsGenerator {
  private ssspData: { [key: string]: ElementInfo };
  private pseudoMetadata: { [key: string]: Metadata };
  private hoveredPseudo: string;
  private hoverCallback: (element?: ElementModel) => void;

  constructor(
    ssspData: { [key: string]: ElementInfo },
    pseudoMetadata: { [key: string]: Metadata },
    hoveredPseudo: string,
    onElementHover: (element?: ElementModel) => void
  ) {
    this.ssspData = ssspData;
    this.pseudoMetadata = pseudoMetadata;
    this.hoveredPseudo = hoveredPseudo;
    this.hoverCallback = onElementHover;
  }

  public make(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
      (i) => {
        const symbol = element_symbols[i];
        const elemInfo = this.ssspData[symbol];

        let color = "#dddddd";
        let isTransparent = false;

        if (elemInfo) {
          const { pseudopotential } = elemInfo;
          const bg = this.pseudoMetadata[pseudopotential].background_color;
          color = bg;
          if (this.hoveredPseudo) {
            isTransparent = this.hoveredPseudo !== pseudopotential;
          }
        }

        return (
          <Element
            key={i}
            number={i}
            symbol={symbol}
            color={color}
            info={elemInfo}
            isTransparent={isTransparent}
            onHover={this.hoverCallback}
          />
        );
      }
    );
  }
}

export default ElementsGenerator;
