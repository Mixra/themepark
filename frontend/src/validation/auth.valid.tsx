import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup
      .string() //tells us the type of value
      .email('Enter a valid email') //validates the email tab
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password needs to be atleast 8 characters')
      .required(),
  });

export const registrationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters long'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password needs to be at least 8 characters')
    .required('Password is required'),
});