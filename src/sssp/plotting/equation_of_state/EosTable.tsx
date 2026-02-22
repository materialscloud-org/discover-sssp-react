import { useContext } from "react";
import { Table } from "react-bootstrap";

import { ElementContext } from "@sssp/context";

import EosTableProps from "./EosTable.models";
import styles from "./EosTable.module.scss";

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
  const { element } = useContext(ElementContext);
  return (
    <Table id={styles.eosTable} borderless responsive className="text-center">
      <thead>
        <tr>
          <th rowSpan={2}>Library</th>
          <th rowSpan={2}>
            Z<sub>val</sub>
          </th>
          <td rowSpan={2} className={styles.gap}></td>
          <th colSpan={2}>Rho Cutoff</th>
          <td rowSpan={2} className={styles.gap}></td>
          <th colSpan={10}>ν</th>
          <td rowSpan={2} className={styles.gap}></td>
          <th colSpan={2}>Average ν</th>
        </tr>
        <tr>
          <th>Efficiency</th>
          <th>Precision</th>
          {CONFIGURATIONS.map((conf) => {
            const configuration = conf.includes("X")
              ? conf.replace("X", element)
              : `${element}-${conf === "DC" ? "Diamond" : conf}`;
            return <th key={conf}>{formatSubscripts(configuration)}</th>;
          })}
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
                  {Object.entries(eosPseudosMap[pseudo].ecutrho).map(
                    ([key, value]) => (
                      <td key={key}>{value ? value.toFixed(2) : "-"}</td>
                    ),
                  )}
                  <td className={styles.gap}></td>
                  {CONFIGURATIONS.map((conf) => {
                    const nu = eosConfigMap.configurations[conf]?.nu;
                    const uuid = eosConfigMap.configurations[conf]?.uuid;
                    return (
                      <td
                        key={conf}
                        style={{ backgroundColor: nuColor(nu) }}
                        className={nu !== undefined ? styles.nuTd : undefined}
                      >
                        {nu !== undefined ? (
                          <a
                            href={`https://www.materialscloud.org/explore/sssp-v2/${uuid}`}
                            target="_blank"
                            className="link-dark stretched-link sssp-link"
                          >
                            {nu.toFixed(2)}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                  <td className={styles.gap}></td>
                  {Object.entries(eosPseudosMap[pseudo].avgNu).map(
                    ([key, avgNu]) => (
                      <td key={key} style={{ backgroundColor: nuColor(avgNu) }}>
                        {avgNu !== undefined ? avgNu.toFixed(2) : "-"}
                      </td>
                    ),
                  )}
                </tr>
              );
            })}
      </tbody>
    </Table>
  );
};

export default EosTable;

const formatSubscripts = (text: string) => {
  return text
    .split(/(\d+)/)
    .map((part, i) => (/\d+/.test(part) ? <sub key={i}>{part}</sub> : part));
};

const nuColor = (nu: number | undefined): string => {
  if (nu === undefined) return "white";
  if (nu <= 0.1) return "#B7E1CD"; // green
  if (nu >= 0.33) return "#EA9999"; // red
  return "#FFE599"; // yellow
};
