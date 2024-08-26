import React, { useState } from "react";

import { ElementModel } from "./Element/Element.models";
import { PeriodicTableProps } from "./PeriodicTable.models";

import Details from "./Details";
import ElementsGenerator from "./utils";

import styles from "./PeriodicTable.module.scss";

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  ssspData,
  pseudoMetadata,
  hoveredPseudo,
}) => {
  const [hoveredElement, setHoveredElement] = useState<ElementModel | null>(
    null
  );

  const onElementHover = (elementData: ElementModel | null) => {
    setHoveredElement(elementData);
  };

  const elements = new ElementsGenerator(
    ssspData,
    pseudoMetadata,
    hoveredPseudo,
    onElementHover
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
      <Details element={hoveredElement} />
      <Table />
    </div>
  );
};

export default PeriodicTable;
