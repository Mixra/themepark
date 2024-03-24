import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "../validation/auth.valid";
import db from "../components/db";
import axios from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await db.post("/auth/login", values);
        console.log(response.data);
        localStorage.setItem("level", response.data.level);
        navigate("/park");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            setErrorMessage("Wrong username or password");
          } else if (statusCode && statusCode >= 500) {
            setErrorMessage("Something went wrong. Please try again later.");
          }
        } else {
          setErrorMessage("Could not communicate with server.");
          console.error(error);
        }
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(5px)",
          padding: "4rem",
          color: "#fff",
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          marginTop: "15vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => formik.handleSubmit()}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
