import React from "react";

import { PeriodicTableProps } from "./PeriodicTable.models";

import Details from "./Details";
import ElementsGenerator from "./utils";

import styles from "./PeriodicTable.module.scss";

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  ssspData,
  pseudoMetadata,
}) => (
  <div id={styles["periodic-table"]}>
    <Details />
    <Table elements={new ElementsGenerator(ssspData, pseudoMetadata)} />
  </div>
);

const Table = ({ elements }: { elements: ElementsGenerator }) => {
  const placeholder = (n: number) => (
    <span className={styles["star-placeholder"]}>{"★".repeat(n)}</span>
  );

  return (
    <div id={styles["table"]}>
      <div className={styles["elements"]}>
        {elements.make(1, 56)}
        {placeholder(1)}
        {elements.make(72, 88)}
        {placeholder(2)}
        {elements.make(104, 118)}
      </div>
      <div className={styles["elements"]} id="rare-earth">
        {placeholder(1)}
        {elements.make(57, 71)}
        {placeholder(2)}
        {elements.make(89, 103)}
      </div>
    </div>
  );
};

export default PeriodicTable;
