import { ElementProps } from "./models";

export const Element = ({ num, symbol, color, elemInfo, linkBase }: ElementProps) => {
  const link = `${linkBase}/${symbol}`;
  const disabled = elemInfo == null;

  let eClass = `element element-${num}`;
  if (num >= 58 && num <= 71) {
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
