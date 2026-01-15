import { Table } from "react-bootstrap";

import { EosPseudosMap } from "@sssp/models";

import EosTableProps from "./EosTable.models";
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

const EosTable: React.FC<EosTableProps> = ({ eosConfigMap, summaryData }) => {
  const pseudosEosData: {
    [pseudo: string]: {
      Z: number;
      avg_nu: string;
      avg_nu_wo_max: string;
      nu: { [configuration: string]: string };
    };
  } = {};

  summaryData.pseudos.forEach((pseudo) => {
    const avg_nu =
      pseudo.quantities.metadata?.avg_nu !== undefined
        ? pseudo.quantities.metadata.avg_nu.toFixed(2)
        : "-";
    const avg_nu_wo_max =
      pseudo.quantities.metadata?.avg_nu_wo_max !== undefined
        ? pseudo.quantities.metadata.avg_nu_wo_max.toFixed(2)
        : "-";
    pseudosEosData[pseudo.name] = {
      Z: pseudo.Z,
      avg_nu: avg_nu,
      avg_nu_wo_max: avg_nu_wo_max,
      nu: {},
    };
  });

  Object.entries(eosConfigMap).forEach(
    ([configuration, eosPseudosMap]: [string, EosPseudosMap]) => {
      Object.entries(eosPseudosMap).forEach(
        ([pseudoName, eosPlotData]: [string, any]) => {
          const nu =
            eosPlotData.nu !== undefined ? eosPlotData.nu.toFixed(2) : "-";
          if (pseudosEosData[pseudoName]) {
            pseudosEosData[pseudoName].nu[configuration] = nu;
          }
        }
      );
    }
  );

  return (
    <Table bordered responsive className="text-center">
      <thead>
        <tr>
          <th rowSpan={2}>Library</th>
          <th rowSpan={2}>
            Z<sub>val</sub>
          </th>
          <th colSpan={2}>EoS Avg.</th>
          <th colSpan={10}>Configuration</th>
        </tr>
        <tr>
          <th>w/ max</th>
          <th>w/o max</th>
          {CONFIGURATIONS.map((config) => (
            <th key={config}>{formatSubscripts(config)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pseudosEosData &&
          Object.entries(pseudosEosData).map(([pseudo, eosData]) => (
            <tr key={pseudo}>
              <td>{pseudo}</td>
              <td>{eosData.Z}</td>
              <td>{eosData.avg_nu}</td>
              <td>{eosData.avg_nu_wo_max}</td>
              {CONFIGURATIONS.map((config: string, idx: number) => {
                const nu = eosData.nu[config] || "-";
                return (
                  <td
                    key={idx}
                    style={{
                      backgroundColor:
                        nu === "-"
                          ? "white"
                          : parseFloat(nu) <= 0.1
                          ? "#B7E1CD"
                          : parseFloat(nu) >= 0.33
                          ? "#EA9999"
                          : "#FFE599",
                    }}
                  >
                    {nu}
                  </td>
                );
              })}
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default EosTable;
