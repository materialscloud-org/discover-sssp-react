import element_symbols from "./symbols.json";

import { ElementModel } from "./Element/Element.models";
import { ElementInfo, Metadata } from "./PeriodicTable.models";

import Element from "./Element";

class ElementsGenerator {
  private ssspData: { [key: string]: ElementInfo };
  private pseudoMetadata: { [key: string]: Metadata };
  private hover_callback: (element: ElementModel | null) => void;

  constructor(
    ssspData: { [key: string]: ElementInfo },
    pseudoMetadata: { [key: string]: Metadata },
    on_element_hover: (element: ElementModel | null) => void
  ) {
    this.ssspData = ssspData;
    this.pseudoMetadata = pseudoMetadata;
    this.hover_callback = on_element_hover;
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
            on_hover={this.hover_callback}
          />
        );
      }
    );
  }
}

export default ElementsGenerator;
