'use client'
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Grid,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Close,
  PersonOutline,
  PhoneIphone,
  Construction,
  FavoriteBorder,
  CalendarToday,
  CloudUpload,
  HomeOutlined,
  Description,
} from "@mui/icons-material";
import { useAuth } from "../hook/authContext";
import toast from "react-hot-toast";
interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  darkTheme?: any;
}

interface BookingFormData {
  name: string;
  phone: string;
  applianceType: string;
  serviceType: string;
  preferredDate: string;
  bookingImage: File | null;
  address: string;
  problemDescription: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

const appliances = [
  "AC",
  "Fridge",
  "TV",
  "Washing Machine",
  "Microwave",
  "Air Cooler",
  "Water purifier",
  "Geyser",
  "CCTV",
];

const serviceTypes = [
  "Repair",
  "Installation",
  "Maintenance",
  "Emergency Repair",
];

const defaultTheme = {
  formBackground: "#1a1f36",
  borderColor: "#2d3748",
  accentColor: "#4ed9a4",
  secondaryColor: "#6366f1",
  primaryText: "#ffffff",
  placeholderColor: "#a0aec0",
};

const BookingForm: React.FC<BookingFormProps> = ({
  open,
  onClose,
  darkTheme = defaultTheme,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    phone: "",
    applianceType: "",
    serviceType: "",
    preferredDate: "",
    bookingImage: null,
    address: "",
    problemDescription: "",
  });

  const theme = darkTheme || defaultTheme;

  // Auto-populate user data when component opens or user changes
  useEffect(() => {
    if (open && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone ? String(user.phone) : "", // Ensure phone is string
      }));
    }
  }, [open, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Ensure phone is always stored as string
    if (name === 'phone') {
      // Remove any non-digit characters except + for international numbers
      const cleanedValue = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file && !file.type.startsWith('image/')) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size too large. Maximum 5MB allowed.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      bookingImage: file,
    }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!user) {
      setError("You must be logged in to create a booking");
      return false;
    }

    const requiredFields: (keyof BookingFormData)[] = [
      'name', 'phone', 'applianceType', 'serviceType', 
      'preferredDate', 'address', 'problemDescription'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!formData.bookingImage) {
      setError("Please upload a service image");
      return false;
    }

    // FIXED: Safe phone validation with type checking
    const phoneValue = formData.phone;
    
    // Ensure phone is a string before using replace
    if (typeof phoneValue !== 'string') {
      setError("Please enter a valid phone number");
      return false;
    }

    // Clean the phone number - remove spaces, dashes, parentheses
    const cleanPhone = phoneValue.replace(/[\s\-\(\)]/g, '');
    
    // Phone validation regex (allows international numbers with +)
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Preferred date cannot be in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      formDataToSend.append("applianceType", formData.applianceType);
      formDataToSend.append("serviceType", formData.serviceType);
      formDataToSend.append("preferredDate", formData.preferredDate);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("problemDescription", formData.problemDescription);
      
      if (formData.bookingImage) {
        formDataToSend.append("bookingImage", formData.bookingImage);
      }

      const response = await fetch("http://localhost:8400/create/booking", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        toast.success("Booking created successfully!")
        // Reset form and close
        setFormData({
          name: user?.name || "",
          phone: user?.phone ? String(user.phone) : "",
          applianceType: "",
          serviceType: "",
          preferredDate: "",
          bookingImage: null,
          address: "",
          problemDescription: "",
        });
        onClose();
      } else {
        toast.error(data.message)
        setError(data.message || "Error creating booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setFormData({
      name: user?.name || "",
      phone: user?.phone ? String(user.phone) : "",
      applianceType: "",
      serviceType: "",
      preferredDate: "",
      bookingImage: null,
      address: "",
      problemDescription: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.formBackground,
          backgroundImage: "none",
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          border: `1px solid ${theme.borderColor}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          textAlign: "center",
          pb: 2,
          pt: 4,
          background: `linear-gradient(135deg, ${theme.formBackground} 0%, #151d3a 100%)`,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: theme.accentColor,
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(45deg, ${theme.accentColor}, ${theme.secondaryColor})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Book Service
        </Typography>

        {user && (
          <Typography
            variant="body2"
            sx={{
              color: theme.secondaryColor,
              mt: 1,
            }}
          >
            Booking as: {user.name} ({user.email})
          </Typography>
        )}

        <Box
          sx={{
            width: "80px",
            height: "4px",
            background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.secondaryColor})`,
            margin: "0 auto",
            borderRadius: "2px",
          }}
        />
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: theme.primaryText,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 4, px: 4 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                border: '1px solid rgba(211, 47, 47, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{xs:12,sm:6}}>
              <TextField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <PersonOutline
                      sx={{ color: theme.placeholderColor, mr: 1 }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                }}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                required
                fullWidth
                inputProps={{
                  inputMode: "tel",
                  pattern: "[+]?[0-9]{10,15}",
                  title: "Enter a valid phone number (10-15 digits)"
                }}
                InputProps={{
                  startAdornment: (
                    <PhoneIphone
                      sx={{ color: theme.placeholderColor, mr: 1 }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                }}
              />
            </Grid>

            {/* Rest of your form fields remain the same */}
            <Grid size={{xs:12,sm:6}}>
              <TextField
                select
                label="Appliance"
                name="applianceType"
                value={formData.applianceType}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Construction
                      sx={{ color: theme.placeholderColor, mr: 1 }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                  "& .MuiSelect-icon": {
                    color: theme.placeholderColor,
                  },
                }}
              >
                <MenuItem value="">Select Appliance</MenuItem>
                {appliances.map((appliance) => (
                  <MenuItem key={appliance} value={appliance}>
                    {appliance}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                select
                label="Service Type"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <FavoriteBorder
                      sx={{ color: theme.placeholderColor, mr: 1 }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                  "& .MuiSelect-icon": {
                    color: theme.placeholderColor,
                  },
                }}
              >
                <MenuItem value="">Select Service Type</MenuItem>
                {serviceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <TextField
                label="Preferred Date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleInputChange}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <CalendarToday
                      sx={{ color: theme.placeholderColor, mr: 1 }}
                    />
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                }}
              />
            </Grid>

            <Grid size={{xs:12,sm:6}}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  height: "56px",
                  color: formData.bookingImage ? theme.accentColor : theme.primaryText,
                  borderColor: formData.bookingImage ? theme.accentColor : theme.borderColor,
                  backgroundColor: theme.formBackground,
                  "&:hover": {
                    borderColor: theme.accentColor,
                    backgroundColor: "rgba(78, 217, 164, 0.1)",
                  },
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
              >
                {formData.bookingImage
                  ? formData.bookingImage.name
                  : "Upload Service Image"}
                <input
                  type="file"
                  name="bookingImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  hidden
                  required
                />
              </Button>
            </Grid>

            <Grid size={{xs:12}}>
              <TextField
                label="Your Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <HomeOutlined
                      sx={{
                        color: theme.placeholderColor,
                        mr: 1,
                        alignSelf: "flex-start",
                        mt: 1,
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                    alignItems: "flex-start",
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                }}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <TextField
                label="Problem Description"
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleInputChange}
                multiline
                rows={3}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <Description
                      sx={{
                        color: theme.placeholderColor,
                        mr: 1,
                        alignSelf: "flex-start",
                        mt: 1,
                      }}
                    />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: theme.primaryText,
                    backgroundColor: theme.formBackground,
                    "& fieldset": {
                      borderColor: theme.borderColor,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.accentColor,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.secondaryColor,
                    },
                    alignItems: "flex-start",
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.placeholderColor,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.secondaryColor,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              padding: "12px 32px",
              fontWeight: "bold",
              color: theme.primaryText,
              border: `2px solid ${theme.placeholderColor}`,
              borderRadius: 2,
              fontSize: "1rem",
              "&:hover": {
                borderColor: theme.accentColor,
                backgroundColor: "rgba(78, 217, 164, 0.1)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              padding: "14px 40px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: theme.primaryText,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.accentColor} 0%, ${theme.secondaryColor} 100%)`,
              backgroundSize: "200% auto",
              transition: "all 0.5s ease",
              minWidth: 160,
              "&:hover": {
                backgroundPosition: "right center",
                transform: "translateY(-2px)",
                boxShadow: `0 8px 25px ${theme.accentColor}40`,
              },
              "&:disabled": {
                background: theme.placeholderColor,
                transform: "none",
                boxShadow: "none",
              },
              boxShadow: `0 4px 15px ${theme.accentColor}30`,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Book Service Now"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingForm;