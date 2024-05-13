import { Element } from "./element";
import { PTableProps } from "./models";
import element_symbols from "./symbols.json";

import "./index.css";

export const PTable = ({ ssspData, pseudoMetadata }: PTableProps) => {
  const makeElements = (start: number, end: number) => {
    const items = [];
    for (let i = start; i <= end; i++) {
      const symbol = element_symbols[i];
      const elemInfo = ssspData[symbol];
      const color = elemInfo
        ? pseudoMetadata[elemInfo.pseudopotential].background_color
        : "#dddddd";

      items.push(
        <Element
          key={i}
          num={i}
          symbol={symbol}
          color={color}
          elemInfo={elemInfo}
        />
      );
    }
    return items;
  };

  return (
    <div className="ptable_outer">
      <div className="ptable">
        {makeElements(1, 57)}
        {makeElements(72, 89)}
        {makeElements(104, 118)}
        {makeElements(58, 71)}
        {makeElements(90, 103)}
      </div>
    </div>
  );
};
