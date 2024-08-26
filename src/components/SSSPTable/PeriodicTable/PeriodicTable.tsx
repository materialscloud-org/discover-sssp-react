import React, { useState } from "react";

import { ElementModel } from "./Element/Element.models";
import { PeriodicTableProps } from "./PeriodicTable.models";

import Details from "./Details";
import ElementsGenerator from "./utils";

import styles from "./PeriodicTable.module.scss";

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  ssspData,
  pseudoMetadata,
}) => {
  const [hovered_element, setHoveredElement] = useState<ElementModel | null>(
    null
  );

  const on_element_hover = (element_data: ElementModel | null) => {
    setHoveredElement(element_data);
  };

  const elements = new ElementsGenerator(
    ssspData,
    pseudoMetadata,
    on_element_hover
  );

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
    <div className={styles["ptable"]}>
      <Details element={hovered_element} />
      <Table />
    </div>
  );
};

export default PeriodicTable;
