import { ElementModel } from "../Element/Element.models";

import styles from "./Details.module.scss";

const Details = ({ element }: { element?: ElementModel }) => {
  if (!element) {
    return <></>;
  }
  const { number, symbol, color, info } = element;
  return (
    <div className={styles["details"]} style={{ borderColor: color }}>
      <div className={styles["label"]}>
        <div className={styles["number"]} style={{ color: color }}>
          {number}
        </div>
        <div className={styles["symbol"]} style={{ color: color }}>
          {symbol}
        </div>
      </div>
      <div>
        <ul className={styles["info"]}>
          <li className={styles["cutoff-header"]} style={{ color: color }}>
            Cutoffs
          </li>
          <li>Ψ = {info.cutoff}</li>
          <li>ρ = {info.rho_cutoff}</li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
