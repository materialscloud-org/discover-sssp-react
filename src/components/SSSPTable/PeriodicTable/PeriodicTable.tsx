import React from "react";

import { PeriodicTableProps } from "./PeriodicTable.models";
import ElementsGenerator from "./utils";

import styles from "./PeriodicTable.module.scss";

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  ssspData,
  pseudoMetadata,
}) => {
  const elements = new ElementsGenerator(ssspData, pseudoMetadata);

  const placeholder = (n: number) => {
    return <span className={styles["star-placeholder"]}>{"★".repeat(n)}</span>;
  };

  const NonRareEarthElements = () => (
    <div className={styles["elements"]}>
      {elements.make(1, 56)}
      {placeholder(1)}
      {elements.make(72, 88)}
      {placeholder(2)}
      {elements.make(104, 118)}
    </div>
  );

  const RareEarthElements = () => (
    <div className={`${styles["elements"]} ${styles["rare-earth"]}`}>
      {placeholder(1)}
      {elements.make(57, 71)}
      {placeholder(2)}
      {elements.make(89, 103)}
    </div>
  );

  const Table = () => (
    <>
      <NonRareEarthElements />
      <RareEarthElements />
    </>
  );

  return (
    <div className={styles["ptable-outer"]}>
      <div className={styles["ptable"]}>
        <Table />
      </div>
    </div>
  );
};

export default PeriodicTable;
