import { useFormik } from "formik";
import * as yup from 'yup'

export const validationSchema = yup.object({
    email: yup
      .string() //tells us the type of value
      .email('Enter a valid email') //validates the email tab
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password needs to be atleast 8 characters')
      .required(),
  });

