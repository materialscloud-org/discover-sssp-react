import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import styles from "./InvalidPage.module.scss";

const InvalidPage: React.FC = () => {
  return (
    <div id={styles.invalidPage}>
      <h1>404</h1>
      <p>Sorry, this page doesn't exist</p>
      <Link replace to="/pseudopotentials/efficiency">
        <Button variant="primary">Go to periodic table</Button>
      </Link>
    </div>
  );
};

export default InvalidPage;
