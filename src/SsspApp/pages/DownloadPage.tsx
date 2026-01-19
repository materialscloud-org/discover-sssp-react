import { Table } from "react-bootstrap";

import styles from "./DownloadPage.module.scss";

const DownloadPage: React.FC = () => (
  <div id={styles.downloadPage}>
    <header className="text-center">
      <h1 className="display-5">Download SSSP</h1>
      <p className="lead">
        All versions of the SSSP library can be downloaded using the links
        below.
      </p>
    </header>

    <Table id={styles.downloadTable} striped bordered responsive>
      <thead>
        <tr>
          <th rowSpan={2}>Version</th>
          <th colSpan={2}>Efficiency</th>
          <th colSpan={2}>Precision</th>
        </tr>
        <tr>
          <th>PBE</th>
          <th>PBEsol</th>
          <th>PBE</th>
          <th>PBEsol</th>
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
              Download
            </a>
          </td>
          <td>
            <a
              href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-extract-library/SSSP-lib-pbesol-eff-v2.tar.gz"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-prec-lib/SSSP-lib-pbe-prec-v2.tar.gz"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://github.com/unkcpz/sssp-verify-scripts/raw/refs/heads/main/2-experiments/2025-10-prec-lib/SSSP-lib-pbesol-prec-v2.tar.gz"
              download
            >
              Download
            </a>
          </td>
        </tr>

        <tr>
          <td>1.3.0</td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_efficiency.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBE_precision.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_efficiency.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.3.0_PBEsol_precision.tar.gz/content"
              download
            >
              Download
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
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBE_precision.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_efficiency.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.2.1_PBEsol_precision.tar.gz/content"
              download
            >
              Download
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
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBE_precision.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_efficiency.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
          <td>
            <a
              href="https://archive.materialscloud.org/api/records/rcyfm-68h65/files/SSSP_1.1.2_PBEsol_precision.tar.gz/content"
              download
            >
              Download
            </a>
          </td>
        </tr>

        <tr className="gap"></tr>
        <tr className="gap"></tr>

        <tr>
          <td>1.0</td>
          <td colSpan={4}>
            <a
              href="https://legacy.materialscloud.org/discover/data/discover/sssp/downloads/tarball_1.0/SSSP_1.0_pseudos.tar.gz"
              download
            >
              Download
            </a>
            {" - "}
            <a
              href="https://legacy.materialscloud.org/discover/data/discover/sssp/downloads/tarball_1.0/SSSP_1.0_plots.tar.gz"
              download
            >
              Convergence plots
            </a>
          </td>
        </tr>

        <tr>
          <td>0.7</td>
          <td colSpan={4}>
            <a
              href="https://legacy.materialscloud.org/discover/data/discover/sssp/downloads/tarball_0.7/SSSP_0.7_pseudos.tar.gz"
              download
            >
              Download
            </a>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

export default DownloadPage;
