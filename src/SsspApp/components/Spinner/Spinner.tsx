import { Spinner } from "react-bootstrap";

import Styles from "./Spinner.module.scss";

const LoadingSpinner: React.FC = () => (
  <div className={Styles.loading}>
    Loading
    <Spinner className={Styles.spinner} animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
);

export default LoadingSpinner;
