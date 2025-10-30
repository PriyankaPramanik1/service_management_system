"use client";
import { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { VerifiedUser, Email, Security } from "@mui/icons-material";
import axios from "axios";

const steps = ["Enter Email", "Verify OTP", "Success"];

export default function VerifyPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if email is passed from registration
  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
      setActiveStep(1);
      sendOtp(emailFromParams);
    }
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    setIsClient(true);
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeStep === 1) {
      setCanResend(true);
    }
  }, [timeLeft, activeStep]);

  const sendOtp = async (emailToSend: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8400/verify/form", {
        email: emailToSend,
      });

      setTimeLeft(60);
      setCanResend(false);
      setSuccess("OTP sent to your email!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    await sendOtp(email);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits are entered
      if (value && index === 3) {
        const otpString = newOtp.join("");
        if (otpString.length === 4) {
          handleVerifyAuto(otpString);
        }
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "Enter" && index === 3 && otp.join("").length === 4) {
      handleVerify(otp.join(""));
    }
  };

  const handleVerifyAuto = async (otpString: string) => {
    await handleVerify(otpString);
  };

  const handleVerify = async (otpString?: string) => {
    const finalOtp = otpString || otp.join("");

    if (finalOtp.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8400/verify/form", {
        email,
        otp: finalOtp,
      });

      setActiveStep(2);
      setSuccess("Email verified successfully! Redirecting to login...");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        // router.push("/login");
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError("Verification failed");
      }
      // Clear OTP on error
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await handleVerify();
  };

  const handleResendOtp = async () => {
    await sendOtp(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            {activeStep === 0 && (
              <Email sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            )}
            {activeStep === 1 && (
              <Security sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            )}
            {activeStep === 2 && (
              <VerifiedUser
                sx={{ fontSize: 48, color: "success.main", mb: 2 }}
              />
            )}

            <Typography component="h1" variant="h4" gutterBottom>
              {activeStep === 0 && "Enter Your Email"}
              {activeStep === 1 && "Verify Your Email"}
              {activeStep === 2 && "Verification Successful!"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {activeStep === 0 &&
                "We'll send a verification code to your email"}
              {activeStep === 1 && `Enter the 4-digit code sent to ${email}`}
              {activeStep === 2 && "Your email has been successfully verified"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Step 1: Email Input */}
          {activeStep === 0 && (
            <Box
              component="form"
              onSubmit={handleEmailSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </Box>
          )}

          {/* Step 2: OTP Verification */}
          {activeStep === 1 && (
            <Box
              component="form"
              onSubmit={handleVerifySubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      },
                    }}
                    sx={{
                      width: 60,
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                      },
                    }}
                    disabled={loading}
                  />
                ))}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={loading || otp.join("").length !== 4}
              >
                {loading ? <CircularProgress size={24} /> : "Verify OTP"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                {timeLeft > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Resend OTP in {formatTime(timeLeft)}
                  </Typography>
                ) : (
                  <Button
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                    variant="text"
                    size="small"
                  >
                    Resend OTP
                  </Button>
                )}
              </Box>

              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  setActiveStep(0);
                  setError("");
                  setOtp(["", "", "", ""]);
                }}
                sx={{ mt: 1 }}
              >
                Change Email
              </Button>
            </Box>
          )}

          {/* Step 3: Success */}
          {activeStep === 2 && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your email has been successfully verified. You will be
                redirected to the login page shortly.
              </Typography>
              <Button variant="contained" onClick={() => router.push("/login")}>
                Go to Login Now
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
