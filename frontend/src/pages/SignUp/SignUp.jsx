import { useState } from "react";
import styles from "./SignUp.module.css";
import Textinput from "../../components/TextInput/TextInput";
import signupSchema from "../../schemas/signupSchema";
import { useFormik } from "formik";
import { setUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../api/internal";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await signup(data);

    if (response.status === 201) {
      const user = {
        _id: response.data.user._id,
        username: response.data.user.username,
        email: response.data.user.email,
        auth: response.data.auth,
      };

      dispatch(setUser(user));

      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      setError(response.response.data.errormessage);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: signupSchema,
  });

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create an account</div>
      <Textinput
        type="text"
        name="name"
        placeholder="Name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
      <Textinput
        type="text"
        name="username"
        placeholder="Username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <Textinput
        type="email"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />
      <Textinput
        type="password"
        name="password"
        placeholder="Password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <Textinput
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          errors.confirmPassword && touched.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />

      <button className={styles.signupButton} onClick={handleSignup}>
        Sign Up
      </button>

      <span>
        Already have an account?{" "}
        <button className={styles.login} onClick={() => navigate("/login")}>
          Log In
        </button>
      </span>

      {error != "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
};

export default SignUp;
