import { useContext, useMemo } from "react";
import { Table } from "react-bootstrap";

import { ElementContext, PseudoContext } from "@sssp/context";

import EosTableProps from "./EosTable.models";
import styles from "./EosTable.module.scss";
import { Link } from "react-router-dom";

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
  const { element, ssspPseudos } = useContext(ElementContext);
  const { pseudosMetadata } = useContext(PseudoContext);

  const ssspPseudoMap = useMemo(
    () =>
      ssspPseudos
        ? Object.entries(ssspPseudos).reduce(
            (map, [, info]) => {
              if (!info) return map;
              const { Z, library } = info;
              const color = pseudosMetadata[info.library]?.color || "inherit";
              map[`${library}-Z=${Z}`] = {
                color,
                efficiency:
                  info.library === ssspPseudos.efficiency?.library &&
                  info.Z === ssspPseudos.efficiency?.Z,
                precision:
                  info.library === ssspPseudos.precision?.library &&
                  info.Z === ssspPseudos.precision?.Z,
              };
              return map;
            },
            {} as {
              [pseudo: string]: {
                color: string;
                efficiency: boolean;
                precision: boolean;
              };
            },
          )
        : {},
    [ssspPseudos, pseudosMetadata],
  );

  return (
    <Table id={styles.eosTable} borderless responsive className="text-center">
      <thead>
        <tr>
          <th rowSpan={2}>Library</th>
          <th rowSpan={2}>
            Z<sub>val</sub>
          </th>
          <td rowSpan={2} className={styles.gap}></td>
          <th colSpan={2}>Ψ Cutoff (Ry)</th>
          <td rowSpan={2} className={styles.gap}></td>
          <th colSpan={10}>
            ν (click <Link to="/about">here</Link> for details)
          </th>
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
              const style = ssspPseudoMap[pseudo]
                ? {
                    color: ssspPseudoMap[pseudo].color,
                    fontWeight:
                      ssspPseudoMap[pseudo].efficiency ||
                      ssspPseudoMap[pseudo].precision
                        ? "bold"
                        : "normal",
                  }
                : {};
              return (
                <tr key={pseudo}>
                  <td style={style}>{pseudoName}</td>
                  <td style={style}>{Z}</td>
                  <td className={styles.gap}></td>
                  {Object.entries(eosPseudosMap[pseudo].ecutrho).map(
                    ([key, value]) => {
                      const applyStyle = (ssspPseudoMap[pseudo] || {})
                        .efficiency
                        ? key === "efficiency"
                        : (ssspPseudoMap[pseudo] || {}).precision
                          ? key === "precision"
                          : false;
                      return (
                        <td key={key} style={applyStyle ? style : undefined}>
                          {value || "-"}
                        </td>
                      );
                    },
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
