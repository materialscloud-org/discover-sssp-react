import React, { useContext } from "react";

import { LoadingSpinner } from "@sssp/components";
import { ElementContext, LibraryContext, PseudoContext } from "@sssp/context";

import DetailsBox from "./DetailsBox";
import styles from "./PeriodicTable.module.scss";
import ElementsGenerator from "./utils";

const PeriodicTable: React.FC = () => {
  const { activeLibrary } = useContext(LibraryContext);
  const { loadingMetadata, pseudosMetadata } = useContext(PseudoContext);
  const { loadingInfo, elementsInfo } = useContext(ElementContext);

  return loadingMetadata || loadingInfo ? (
    <LoadingSpinner />
  ) : (
    <div id={styles["periodic-table"]}>
      <DetailsBox />
      <Table
        elements={
          new ElementsGenerator(elementsInfo[activeLibrary], pseudosMetadata)
        }
      />
    </div>
  );
};

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
