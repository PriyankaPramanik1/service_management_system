"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  area: string;
}
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  area?: string;
}
interface Message {
  type: "success" | "error";
  text: string;
}
const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  area: "",
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [isClient,setIsClient]=useState(false);
  const VIBRANT_GREEN = "#00a878";
  const DEEP_MAROON = "#9a031e";
  const router = useRouter();
  useEffect(()=>{
    setIsClient(true)
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8400/create/user",
        formData
      );
      setMessage({ type: "success", text: "Registration successful" });
      setFormData(initialFormData);
      if (response) {
        // Redirect to verify page with email
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage({ type: "error", text: error.response.data.message });
      } else {
        setMessage({ type: "error", text: "Error registering user" });
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isClient) {
    return null;
  }
  return (
   <Container component="main" maxWidth="sm">
  <Box
    sx={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "80vh",
    }}
  >
    <Paper
      elevation={6}
      sx={{
        padding: { xs: 3, sm: 4 },
        width: "100%",
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          background: "linear-gradient(135deg, #00a878 0%, #04e762 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Create Account
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 3,
            backgroundColor:
              message.type === "success"
                ? "rgba(0, 168, 120, 0.1)"
                : "rgba(154, 3, 30, 0.1)",
            color: message.type === "success" ? "#00a878" : "#9a031e",
            border: `1px solid ${
              message.type === "success"
                ? "rgba(0, 168, 120, 0.3)"
                : "rgba(154, 3, 30, 0.3)"
            }`,
            "& .MuiAlert-icon": {
              color: message.type === "success" ? "#00a878" : "#9a031e",
            },
          }}
        >
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid size={{xs:12}}>
            <TextField
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.name ? DEEP_MAROON : "text.secondary",
                },
              }}
            />
          </Grid>

          <Grid size={{xs:12}}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.email ? DEEP_MAROON : "text.secondary",
                },
              }}
            />
          </Grid>

          <Grid size={{xs:12,sm:6}}>
            <TextField
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.phone ? DEEP_MAROON : "text.secondary",
                },
              }}
            />
          </Grid>

          <Grid size={{xs:12,sm:6}}>
            <TextField
              required
              fullWidth
              id="area"
              label="Area"
              name="area"
              autoComplete="address-level2"
              value={formData.area}
              onChange={handleChange}
              error={!!errors.area}
              helperText={errors.area}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.area ? DEEP_MAROON : "text.secondary",
                },
              }}
            />
          </Grid>

          <Grid size={{xs:12}}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  "&:hover fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: VIBRANT_GREEN,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "text.primary",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.password ? DEEP_MAROON : "text.secondary",
                },
              }}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            bgcolor: VIBRANT_GREEN,
            background: `linear-gradient(135deg, ${VIBRANT_GREEN} 0%, #04e762 100%)`,
            "&:hover": {
              bgcolor: "#008c62",
              background: `linear-gradient(135deg, #008c62 0%, #00d46e 100%)`,
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0, 168, 120, 0.4)",
            },
            fontWeight: 700,
            fontSize: "1.1rem",
            borderRadius: 2,
            boxShadow: "0 4px 15px rgba(0, 168, 120, 0.3)",
            transition: "all 0.3s ease-in-out",
            color: "white",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Create Account"
          )}
        </Button>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1 }}
          >
            Already have an account?
          </Typography>
          <Button
            href="/login"
            variant="outlined"
            size="small"
            sx={{
              borderColor: VIBRANT_GREEN,
              color: VIBRANT_GREEN,
              "&:hover": {
                borderColor: "#008c62",
                backgroundColor: "rgba(0, 168, 120, 0.08)",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0, 168, 120, 0.2)",
              },
              transition: "all 0.3s ease-in-out",
              fontWeight: 500,
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Paper>
  </Box>
</Container>
  );
};

export default Register;
