import React, { useState, useEffect } from 'react';
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
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { loginSchema } from '../validation/auth.valid';

interface FieldError {
  [key: string]: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldError>({});

  // Function to validate a field
  const validateField = async (name: string, value: string) => {
    let field = { [name]: value };
    try {
      // Validate the field using the schema
      await loginSchema.validateAt(name, field);
      // If successful, clear any errors for that field
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error) {
      // Cast the error object to yup.ValidationError
      if (error instanceof yup.ValidationError) {
        // If validation fails, set the error message for the field
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  };

  // Effect hooks to validate fields in real-time
  useEffect(() => {
    validateField('email', email);
  }, [email]);

  useEffect(() => {
    validateField('password', password);
  }, [password]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Additional login logic here
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(3px)",
          padding: "3rem",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            sx={{ input: {color: 'white'} }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            sx={{ input: {color: 'white'} }} //added this line to make all input white
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              {/* Additional links or actions can be placed here */}
            </Grid>
            <Grid item>
              <Link to="/register">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
