import styles from "./Error.module.css";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className={styles.errorWrapper}>
      <div className={styles.errorHeader}>Error 404 - Page not found</div>
      <div className={styles.errorBody}>
        Go back to{" "}
        <Link to="/" className={styles.homeLink}>
          {" "}
          Home{" "}
        </Link>
      </div>
    </div>
  );
};

export default Error;
