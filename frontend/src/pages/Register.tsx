import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registrationSchema } from "../validation/auth.valid";
import axios from "axios";
import db from "../components/db";

interface RegisterData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthDate: Date;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      birthDate: new Date(),
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      const registerData: RegisterData = values;
      console.log("Submit");
      try {
        const response = await db.post("/auth/register", registerData);
        localStorage.setItem("level", response.data.level);
        console.log(response.data);
        navigate("/park");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response?.status;
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            if (statusCode === 409) {
              setErrorMessage("User already exists");
            } else {
              setErrorMessage("Invalid input. Please check your entries.");
            }
          } else if (statusCode && statusCode >= 500) {
            setErrorMessage("Something went wrong. Please try again later.");
          }
        } else {
          console.error(error);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: true,
  });

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(5px)",
          padding: "4rem",
          color: "#fff",
          boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Register</Typography>
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1 }}
        >
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
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
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="first_name"
            label="First Name"
            name="first_name"
            autoComplete="given-name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.first_name && Boolean(formik.errors.first_name)
            }
            helperText={formik.touched.first_name && formik.errors.first_name}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="last_name"
            label="Last Name"
            name="last_name"
            autoComplete="family-name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={formik.touched.last_name && formik.errors.last_name}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            sx={{ input: { color: "white" } }}
            margin="normal"
            required
            fullWidth
            id="birthDate"
            label="Date of Birth"
            name="birthDate"
            type="date"
            autoComplete="bday"
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/login">{"Already have an account? Login"}</Link>
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

export default Register;
