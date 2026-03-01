import { useContext } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FamilyContext } from "@sssp/context";

import styles from "./InvalidPage.module.scss";

const InvalidPage: React.FC = () => {
  const { defaultFunctional, defaultLibrary } = useContext(FamilyContext);

  return (
    <div id={styles.invalidPage}>
      <h1>404</h1>
      <p>Sorry, this page doesn't exist</p>
      <Link
        replace
        to={`/pseudopotentials/${defaultFunctional}/${defaultLibrary}`}
      >
        <Button variant="primary">Go to periodic table</Button>
      </Link>
    </div>
  );
};

export default InvalidPage;
