import element_symbols from "./symbols.json";

import { makeTransparent } from "common/utils";

import { ElementModel } from "./Element/Element.models";
import { ElementInfo, Metadata } from "./PeriodicTable.models";

import Element from "./Element";

class ElementsGenerator {
  private ssspData: { [key: string]: ElementInfo };
  private pseudoMetadata: { [key: string]: Metadata };
  private hoveredPseudo: string | null;
  private hoverCallback: (element: ElementModel | null) => void;

  constructor(
    ssspData: { [key: string]: ElementInfo },
    pseudoMetadata: { [key: string]: Metadata },
    hoveredPseudo: string | null,
    onElementHover: (element: ElementModel | null) => void
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

        if (elemInfo) {
          const { pseudopotential } = elemInfo;
          const bg = this.pseudoMetadata[pseudopotential].background_color;
          color =
            this.hoveredPseudo && this.hoveredPseudo !== pseudopotential
              ? makeTransparent(bg, 0.25)
              : bg;
        }

        return (
          <Element
            key={i}
            number={i}
            symbol={symbol}
            color={color}
            info={elemInfo}
            onHover={this.hoverCallback}
          />
        );
      }
    );
  }
}

export default ElementsGenerator;
