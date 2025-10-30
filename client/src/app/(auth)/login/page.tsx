"use client";
import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../hook/authContext";
import { useRouter } from "next/navigation";
import { LockPerson } from "@mui/icons-material";
const VIBRANT_GREEN = "#00a878";
const Login = () => {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(credentials);
    console.log(result);
    if (!result.success) {
      setError(result.message);
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
        <Card
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 400,
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LockPerson
                sx={{
                  fontSize: 40,
                  color: VIBRANT_GREEN,
                  mb: 1,
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #00a878 0%, #04e762 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={loading}
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
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                disabled={loading}
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
                }}
              />

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
                  "Sign In"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Don't have an account?
                </Typography>
                <Button
                  href="/register"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: VIBRANT_GREEN,
                    color: VIBRANT_GREEN,
                    "&:hover": {
                      borderColor: "#008c62",
                      backgroundColor: "rgba(0, 168, 120, 0.08)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease-in-out",
                    fontWeight: 500,
                  }}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;