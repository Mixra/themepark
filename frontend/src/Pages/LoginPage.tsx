import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup'

const validationSchema = yup.object({
  email: yup
    .string() //tells us the type of value
    .email('Enter a valid email') //validates the email tab
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password needs to be atleast 8 characters')
    .required(),
});

const Login = () => {

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      //this handles the login value
      console.log(values);
    },
  });

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            {/*email field required*/}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={formik.values.email} //formik manages the email state
              onChange={formik.handleChange} //updares the changes
              error={formik.touched.email && Boolean(formik.errors.email)} //shows if its invalid email
              helperText={formik.touched.email && formik.errors.email} //helper text to display error message
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
