import { Table } from "react-bootstrap";

import styles from "./DownloadPage.module.scss";

const DownloadPage: React.FC = () => (
  <div id={styles.downloadPage}>
    <header className="page-title">
      <h1 className="display-6">Download SSSP</h1>
      <p className="lead">
        All versions of the SSSP library can be downloaded using the links below
      </p>
    </header>

    <section>
      <Table id={styles.downloadTable} striped bordered responsive>
        <thead>
          <tr>
            <th rowSpan={4}>Version</th>
            <th colSpan={4}>Efficiency</th>
            <th colSpan={4}>Precision</th>
          </tr>
          <tr>
            <th colSpan={2}>PBE</th>
            <th colSpan={2}>PBEsol</th>
            <th colSpan={2}>PBE</th>
            <th colSpan={2}>PBEsol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2.0</td>
            <td>
              <a
                href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-extract-library/SSSP-lib-pbe-eff-v2.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://raw.githubusercontent.com/unkcpz/sssp-verify-scripts/refs/heads/main/2-experiments/finalized_scripts/010-extract-eff-lib/cutoffs.json"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-extract-library/SSSP-lib-pbesol-eff-v2.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://raw.githubusercontent.com/unkcpz/sssp-verify-scripts/refs/heads/main/2-experiments/finalized_scripts/010-extract-eff-lib/cutoffs.json"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-prec-lib/SSSP-lib-pbe-prec-v2.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://raw.githubusercontent.com/unkcpz/sssp-verify-scripts/refs/heads/main/2-experiments/finalized_scripts/011-extract-prec-lib/cutoffs.json"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-prec-lib/SSSP-lib-pbesol-prec-v2.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://raw.githubusercontent.com/unkcpz/sssp-verify-scripts/refs/heads/main/2-experiments/finalized_scripts/011-extract-prec-lib/cutoffs.json"
                download
              >
                Cutoffs
              </a>
            </td>
          </tr>
          <tr>
            <td colSpan={9}>
              <strong>Legacy versions</strong>
            </td>
          </tr>
          <tr>
            <td>1.3.0</td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
          </tr>
          <tr>
            <td>1.2.1</td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBE_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBE_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBE_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBE_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
          </tr>
          <tr>
            <td>1.1.2</td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBE_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBE_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_efficiency.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_efficiency.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBE_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBE_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_precision.tar.gz/content"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_precision.json/content"
                download
              >
                Cutoffs
              </a>
            </td>
          </tr>
          <tr className="gap"></tr>
          <tr className="gap"></tr>
          <tr>
            <td>1.0</td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.0_PBE_efficiency.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
            <td>
              <a
                href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.0_PBE_efficiency.json"
                download
              >
                Cutoffs
              </a>
            </td>
            <td colSpan={7}>-</td>
          </tr>
          <tr>
            <td>0.7</td>
            <td colSpan={8}>
              <a
                href="https://legacy.materialscloud.org/discover/data/discover/sssp/downloads/tarball_0.7/SSSP_0.7_pseudos.tar.gz"
                download
              >
                Pseudos
              </a>
            </td>
          </tr>
        </tbody>
        <caption>
          <ul className="mb-0">
            <li>
              <a
                href="https://legacy.materialscloud.org/discover/data/discover/sssp/downloads/tarball_1.0/SSSP_1.0_plots.tar.gz"
                download
              >
                SSSP v1.0 convergence plots
              </a>
            </li>
          </ul>
        </caption>
      </Table>
    </section>

    <section>
      <h4>Regarding PBEsol</h4>
      <p>
        SSSP pseudopotentials (efficiency and precision) regenerated with the
        PBEsol exchange-correlation functional were done using the same atomic
        input parameters of the corresponding PBE pseudopotentials. The
        suggested wavefunction cutoffs for each element are the same as for PBE
        (see{" "}
        <a href="" target="_blank">
          SSSP reference paper
        </a>{" "}
        for a brief discussion on the topic). The PBEsol pseudopotentials{" "}
        <strong>were not explicitly tested</strong> with the SSSP protocol. As
        such, we <strong>do not guarantee</strong> correctness of simulations
        carried out with the SSSP PBEsol library.
      </p>
    </section>
  </div>
);

export default DownloadPage;
