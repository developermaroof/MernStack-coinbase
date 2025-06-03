import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup.string().min(5).max(30).required("username is required"),
  password: yup.string().min(8).max(25).required(),
});

export default loginSchema;
