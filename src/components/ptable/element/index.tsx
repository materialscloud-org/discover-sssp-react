import { ElementProps } from "./models";

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
    <a
      className={`${eClass}${disabled ? " element-disabled" : ""}`}
      style={{ background: color }}
      href={symbol}
    >
      <div className="elem_sym">{symbol}</div>
      {cutoffText}
    </a>
  );
};
