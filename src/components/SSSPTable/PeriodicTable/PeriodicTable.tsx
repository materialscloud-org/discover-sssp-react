import React from "react";

import Element from "./Element";
import { PeriodicTableProps } from "./PeriodicTable.models";
import element_symbols from "./symbols.json";

import styles from "./PeriodicTable.module.scss";

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  ssspData,
  pseudoMetadata,
}) => {
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

  const placeholder = (n: number) => {
    return <span className={styles["star-placeholder"]}>{"*".repeat(n)}</span>;
  };

  return (
    <div className={styles["ptable-outer"]}>
      <div className={styles["ptable"]}>
        {makeElements(1, 56)}
        {placeholder(1)}
        {makeElements(72, 88)}
        {placeholder(2)}
        {makeElements(104, 118)}
        {placeholder(1)}
        {makeElements(57, 71)}
        {placeholder(2)}
        {makeElements(89, 103)}
      </div>
    </div>
  );
};

export default PeriodicTable;
