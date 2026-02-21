import { Link } from "react-router-dom";
import styles from "./AcknowledgementPage.module.scss";

const AcknowledgementPage: React.FC = () => (
  <div id={styles.acknowledgementPage}>
    <header className="page-title">
      <h1 className="display-6">Acknowledgements</h1>
    </header>
    <main>
      <p>
        The SSSP libraries are the result of the work of many people, including
        developers, testers, and users who have contributed to the project over
        the years. We would like to thank all of them for their contributions
        and support.
      </p>
      <p>
        The SSSP library is a verification effort, but it is very important to
        give credit to the different authors that have generated the
        pseudopotential libraries that are tested here, and to the original
        methodological developments that underlie the generation of these
        pseudopotential tables and datasets. Citations can e.g. be taken from
        this list (please contact us if we need to add more), for the libraries,
        methods, and datasets used. Please make an effort to acknowledge these
        and to ensure reproducibility of your calculations by listing/citing all
        pseudopotentials used. You can find the relevant citations for the
        pseudopotential libraries in the <Link to="/cite">Cite</Link> page.
      </p>
    </main>
  </div>
);

export default AcknowledgementPage;
