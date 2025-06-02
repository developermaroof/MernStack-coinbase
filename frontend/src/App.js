import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />
            <Route
              path="/crypto"
              element={
                <div className={styles.main}>
                  <h1>Crypto Currencies</h1>
                </div>
              }
            />
            <Route
              path="/blogs"
              element={
                <div className={styles.main}>
                  <h1>Blogs</h1>
                </div>
              }
            />
            <Route
              path="/submit"
              element={
                <div className={styles.main}>
                  <h1>Submit a blog</h1>
                </div>
              }
            />
            <Route
              path="/log-in"
              element={
                <div className={styles.main}>
                  <h1>Log In</h1>
                </div>
              }
            />
            <Route
              path="/sign-up"
              element={
                <div className={styles.main}>
                  <h1>Sign Up</h1>
                </div>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
