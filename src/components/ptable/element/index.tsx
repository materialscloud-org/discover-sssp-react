import { ElementProps } from "./models";

import { Link } from "react-router-dom";

import "./index.css";

export const Element = ({ num, symbol, color, elemInfo }: ElementProps) => {
  const disabled = elemInfo == null;

  let eClass = `element element-${num}`;
  if (num >= 57 && num <= 71) {
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
    <Link
      to={symbol}
      className={`${eClass}${disabled ? " element-disabled" : ""}`}
      style={{ background: color }}
    >
      <div className="elem_sym">{symbol}</div>
      {cutoffText}
    </Link>
  );
};
