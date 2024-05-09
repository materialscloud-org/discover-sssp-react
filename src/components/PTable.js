import React from "react";

import { element_symbols } from "./ptable_symbols";

import "./PTable.css";

const Element = ({ number, symbol, color, elemInfo, linkBase }) => {
  const link = `${linkBase}/${symbol}`;
  const disabled = elemInfo == null;

  let eClass = `element element-${number}`;
  if (number >= 58 && number <= 71) {
    eClass += " lanthanide";
  }

  let cutoffText = null;
  if (!disabled) {
    const { cutoff: wfcCutoff, rho_cutoff: rhoCutoff } = elemInfo;
    cutoffText = (
      <div className="elem_num">
        {wfcCutoff}
        <sub>({rhoCutoff})</sub>
      </div>
    );
  }

  return (
    <a
      className={`${eClass}${disabled ? " element-disabled" : ""}`}
      style={{ background: color }}
      href={link}
    >
      <div className="elem_sym">{symbol}</div>
      {cutoffText}
    </a>
  );
};

const PTable = ({ ssspData, pseudoMetadata, linkBase }) => {
  const makeElements = (start, end) => {
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
          number={i}
          symbol={symbol}
          color={color}
          elemInfo={elemInfo}
          linkBase={linkBase}
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

export default PTable;
