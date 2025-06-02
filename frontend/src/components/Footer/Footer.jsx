import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <p className={styles.footer}>&copy; CoinBase {new Date().getFullYear()}</p>
  );
};

export default Footer;
