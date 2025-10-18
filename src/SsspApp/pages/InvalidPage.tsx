import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const InvalidPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404</h1>
      <p>Sorry, this page doesn't exist</p>
      <Link replace to="/pseudopotentials/efficiency">
        <Button variant="primary">Go to periodic table</Button>
      </Link>
    </div>
  );
};

export default InvalidPage;
