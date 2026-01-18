import { Table } from "react-bootstrap";

import EosTableProps from "./EosTable.models";
import styles from "./EosTable.module.scss";
import { formatSubscripts } from "./utils";

const CONFIGURATIONS = [
  "SC",
  "BCC",
  "FCC",
  "DC",
  "XO",
  "XO2",
  "XO3",
  "X2O",
  "X2O3",
  "X2O5",
];

const EosTable: React.FC<EosTableProps> = ({ eosPseudosMap }) => {
  return (
    <Table borderless responsive className="text-center">
      <thead>
        <tr>
          <th rowSpan={2}>Library</th>
          <th rowSpan={2}>
            Z<sub>val</sub>
          </th>
          <th rowSpan={2} className={styles.gap}></th>
          <th colSpan={2}>Rho Cutoff</th>
          <th rowSpan={2} className={styles.gap}></th>
          <th colSpan={10}>ν</th>
          <th rowSpan={2} className={styles.gap}></th>
          <th colSpan={2}>Average ν</th>
        </tr>
        <tr>
          <th>Efficiency</th>
          <th>Precision</th>
          {CONFIGURATIONS.map((config) => (
            <th key={config}>{formatSubscripts(config)}</th>
          ))}
          <th className="text-nowrap">w/ max</th>
          <th className="text-nowrap">w/o max</th>
        </tr>
      </thead>
      <tbody>
        {eosPseudosMap &&
          Object.entries(eosPseudosMap)
            .filter(([pseudo]) => pseudo.includes("-Z="))
            .map(([pseudo, eosConfigMap]) => {
              const [pseudoName, Z] = pseudo.split("-Z=");
              return (
                <tr key={pseudo}>
                  <td>{pseudoName}</td>
                  <td>{Z}</td>
                  <td className={styles.gap}></td>
                  <td>{eosPseudosMap[pseudo].ecutrho.efficiency.toFixed(2)}</td>
                  <td>{eosPseudosMap[pseudo].ecutrho.precision.toFixed(2)}</td>
                  <td className={styles.gap}></td>
                  {CONFIGURATIONS.map((config) => {
                    const nu = eosConfigMap.configurations[config]?.nu;
                    return (
                      <td key={config} style={{ backgroundColor: nuColor(nu) }}>
                        {nu !== undefined ? nu.toFixed(2) : "-"}
                      </td>
                    );
                  })}
                  <td className={styles.gap}></td>
                  {Object.entries(eosPseudosMap[pseudo].avgNu).map(
                    ([key, avgNu]) => {
                      return (
                        <td
                          key={key}
                          style={{ backgroundColor: nuColor(avgNu) }}
                        >
                          {avgNu !== undefined ? avgNu.toFixed(2) : "-"}
                        </td>
                      );
                    },
                  )}
                </tr>
              );
            })}
      </tbody>
    </Table>
  );
};

export default EosTable;

const nuColor = (nu: number | undefined): string => {
  if (nu === undefined) return "white";
  if (nu <= 0.1) return "#B7E1CD"; // green
  if (nu >= 0.33) return "#EA9999"; // red
  return "#FFE599"; // yellow
};
