import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Crypto from "./pages/Crypto/Crypto";
import Blogs from "./pages/Blogs/Blogs";
import SubmitBlog from "./pages/SubmitBlog/SubmitBlog";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/SignUp";
import Protected from "./components/Protected/Protected";
import Error from "./pages/Error/Error";
import { useSelector } from "react-redux";

function App() {
  const isAuth = useSelector((state) => state.user.auth);

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
                  <Crypto />
                </div>
              }
            />
            <Route
              path="/blogs"
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <Blogs />
                  </div>
                </Protected>
              }
            />
            <Route
              path="/submit"
              element={
                <Protected isAuth={isAuth}>
                  <div className={styles.main}>
                    <SubmitBlog />
                  </div>
                </Protected>
              }
            />
            <Route
              path="/login"
              element={
                <div className={styles.main}>
                  <Login />
                </div>
              }
            />
            <Route
              path="/signup"
              element={
                <div className={styles.main}>
                  <Signup />
                </div>
              }
            />

            <Route
              path="*"
              element={
                <div className={styles.main}>
                  <Error />
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
