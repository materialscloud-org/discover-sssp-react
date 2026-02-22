import { Link } from "react-router-dom";

import styles from "./AcknowledgementPage.module.scss";

const AcknowledgementPage: React.FC = () => (
  <div id={styles.acknowledgementPage}>
    <header className="page-title">
      <h1 className="display-6">Acknowledgements</h1>
    </header>

    <main>
      <p>
        The SSSP library is the result of the work of many people, including
        developers, testers, and users who have contributed to the project over
        the years. We would like to thank all of them for their contributions
        and support.
      </p>
      <p>
        We would also like to give credit to the original authors of the
        pseudopotential libraries that were tested in building the SSSP library,
        and to the original methodological developments that underlie the
        generation of these pseudopotential tables and datasets. Citations for
        the libraries, methods, and datasets used can be found in the{" "}
        <Link to="/cite">Cite</Link> page. Please make an effort to acknowledge
        these and to ensure reproducibility of your calculations by
        listing/citing all pseudopotentials used.
      </p>
      <p>
        Computational resources for the SSSP project were provided by MARVEL
        (Piz Daint at CSCS) and by PRACE (Grant 2016153543).
      </p>
    </main>
  </div>
);

export default AcknowledgementPage;
