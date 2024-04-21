import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required."),
});

export const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username cannot exceed 50 characters."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters."),
  first_name: yup
    .string()
    .required("First name is required.")
    .max(50, "First name cannot exceed 50 characters."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .max(50, "Last name cannot exceed 50 characters."),
  email: yup
    .string()
    .required("Email is required.")
    .email("Invalid email address."),
  phone: yup
    .string()
    .required("Phone number is required.")
    .matches(
      /^(\+?\d{1,2}?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Invalid phone number."
    ),
  birthDate: yup
    .date()
    .required("Date of birth is required.")
    .max(new Date(), "Date of birth cannot be in the future.")
    .test(
      "is-over-13",
      "You must be at least 13 years old.",
      (value) => {
        const currentDate = new Date();
        const thirteenYearsAgo = new Date(
          currentDate.getFullYear() - 13,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        return value <= thirteenYearsAgo;
      }
    ),
});
