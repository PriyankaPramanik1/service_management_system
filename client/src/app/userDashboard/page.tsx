"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton, // Add this import
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Rating,
} from "@mui/material";
import { Build, BookmarkBorder, Place } from "@mui/icons-material";
import {
  Edit,
  Person,
  Email,
  Phone,
  CalendarToday,
  Security,
  History,
  Settings,
  Logout,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../hook/authContext";
import FeedBack from "../component/feedback";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  location: string;
  bio: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    darkMode: boolean;
  };
  stats: {
    bookings: number;
    completed: number;
    pending: number;
  };
}
interface Booking {
  _id: string;
  status: string;
  feedback?: string;
  rating?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfileTemplate = () => {
  const { user, logout, booking } = useAuth();
  let currentUser = user?.id;
  const filteredBookings =
    booking?.filter((book) => book.userId == currentUser) ?? [];
  // console.log("user", currentUser);
  // console.log("booking", filteredBookings);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditOpen = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditField("");
    setEditValue("");
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (profile) {
        setProfile({
          ...profile,
          [editField]: editValue,
        });
      }
      setMessage("Profile updated successfully!");
      handleEditClose();
    } catch (error) {
      setMessage("Error updating profile");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handlePreferenceChange = (
    preference: keyof UserProfile["preferences"]
  ) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          [preference]: !profile.preferences[preference],
        },
      });
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        {/* Header Section */}
        <Paper
          sx={{
            p: 4,
            mb: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", top: 0, right: 0, opacity: 0.1 }}>
            <Person sx={{ fontSize: 200 }} />
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  // src={profile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }} gutterBottom>
                {user.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Verified User"
                  color="success"
                  size="small"
                  icon={<CheckCircle />}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                  }}
                />
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{ textAlign: { xs: "center", md: "right" } }}
            ></Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {filteredBookings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Bookings
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {
                  filteredBookings.filter(
                    (booking) => booking.status.toLowerCase() === "completed"
                  ).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4, sm: 6 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {
                  filteredBookings.filter(
                    (booking) => booking?.status.toLowerCase() === "pending"
                  ).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Name" secondary={user.name} />
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen("name", user.name)}
                    >
                    </IconButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={user.email} />
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen("email", user.email)}
                    >
                      
                    </IconButton>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={user.phone} />
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen("phone", user.phone)}
                    >
                    
                    </IconButton>
                  </ListItem>
                  <Divider />
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      secondary={user.createdAt}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions - FIXED: Using ListItemButton instead of ListItem with button prop */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <List>
                  <ListItemButton onClick={() => setTabValue(0)}>
                    <ListItemIcon>
                      <History color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Booking History" />
                  </ListItemButton>
                  <ListItemButton onClick={() => setTabValue(1)}>
                    <ListItemIcon>
                      <Settings color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                  <ListItemButton onClick={logout}>
                    <ListItemIcon>
                      <Logout color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content Area */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab icon={<History />} label="Bookings" />
                  {/* <Tab icon={<Person />} label="Overview" /> */}
                  {/* <Tab icon={<Settings />} label="Settings" /> */}
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: "linear(45deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 4,
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                    }}
                  >
                    Booking History
                  </Typography>

                  {filteredBookings.length > 0 ? (
                    <Grid container spacing={3}>
                      {filteredBookings.map((booking, index) => (
                        <Grid size={{ xs: 12 }} key={index}>
                          <Card
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              background:
                                "linear(145deg, #ffffff 0%, #f8fafc 100%)",
                              border: "none",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              transition:
                                "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                              position: "relative",
                              overflow: "hidden",
                              "&:before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "4px",
                                height: "100%",
                                background: "linear(45deg, #667eea, #764ba2)",
                                transition: "width 0.3s ease",
                              },
                              "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                                "&:before": {
                                  width: "6px",
                                },
                              },
                            }}
                          >
                            {/* Booking Header */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 2.5,
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  background:
                                    "linear-gradient(to right, #0084ffff, #0081ccff)",
                                  backgroundClip: "text",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  fontSize: "1.1rem",
                                }}
                              >
                                Booking {index + 1}
                              </Typography>

                              <Chip
                                label={booking.status}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  backgroundColor:
                                    booking.status === "pending"
                                      ? "#DD6B20"
                                      : booking.status === "assigned"
                                      ? "#4299E1"
                                      : booking.status === "in progress"
                                      ? "#667EEA"
                                      : booking.status === "completed"
                                      ? "#38A169"
                                      : booking.status === "cancel"
                                      ? "#E53E3E"
                                      : "#3182CE",
                                  color: "white",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  fontSize: "0.75rem",
                                  "&:hover": {
                                    backgroundColor:
                                      booking.status === "completed"
                                        ? "#2F855A"
                                        : booking.status === "pending"
                                        ? "#C05621"
                                        : booking.status === "cancelled"
                                        ? "#C53030"
                                        : "#2C5AA0",
                                  },
                                }}
                              />
                            </Box>

                            {/* Booking Details Grid - First Row */}
                            <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #667eea20, #764ba220)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Build
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Appliance
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.applianceType}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #48BB7820, #38A16920)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Settings
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Service
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.serviceType}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #ED893620, #DD6B2020)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <CalendarToday
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Preferred Date
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.preferredDate}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>

                            {/* Booking Details Grid - Second Row (New Fields) */}
                            <Grid container spacing={2.5}>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #F5656520, #E53E3E20)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Person
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Customer Name
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.name || "John Doe"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #4299E120, #3182CE20)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Phone
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Phone Number
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.phone || "+1 (555) 123-4567"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: 1,
                                      borderRadius: 2,
                                      background:
                                        "linear(45deg, #48BB7820, #38A16920)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Place
                                      sx={{ fontSize: "1.2rem", opacity: 0.8 }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.secondary",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Address
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {booking.address ||
                                        "123 Main St, City, State 12345"}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                            {booking.status === "completed" &&
                              (booking.feedback ? (
                                <Grid container spacing={2.5} sx={{ mt: 2.5 }}>
                                  <Grid size={{ xs: 12 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 700, mb: 2 }}
                                    >
                                      Your Feedback
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: 600,
                                        color: "text.primary",
                                      }}
                                    >
                                      {booking.feedback}
                                    </Typography>
                                    <Rating
                                      name="rating"
                                      // value={booking.rating}
                                      readOnly
                                    />
                                  </Grid>
                                </Grid>
                              ) : (
                                <FeedBack/>
                              ))}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Paper
                      sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: 3,
                        background: "linear(145deg, #f8fafc 0%, #f1f5f9 100%)",
                        border: "2px dashed #E2E8F0",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Background Pattern */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -50,
                          right: -50,
                          width: 120,
                          height: 120,
                          borderRadius: "50%",
                          background: "linear(45deg, #667eea10, #764ba210)",
                          zIndex: 0,
                        }}
                      />

                      <BookmarkBorder
                        sx={{
                          fontSize: 80,
                          color: "#CBD5E0",
                          mb: 3,
                          position: "relative",
                          zIndex: 1,
                          opacity: 0.8,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: "text.secondary",
                          mb: 2,
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        No Bookings Found
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          opacity: 0.7,
                          position: "relative",
                          zIndex: 1,
                          maxWidth: 300,
                          mx: "auto",
                        }}
                      >
                        When you schedule a service, your bookings will appear
                        here for easy tracking.
                      </Typography>
                    </Paper>
                  )}
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                  <Typography variant="h6" gutterBottom>
                    Account Settings
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Notification Preferences
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          // checked={user.preferences.emailNotifications}
                          onChange={() =>
                            handlePreferenceChange("emailNotifications")
                          }
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          // checked={profile.preferences.smsNotifications}
                          onChange={() =>
                            handlePreferenceChange("smsNotifications")
                          }
                        />
                      }
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          // checked={profile.preferences.darkMode}
                          onChange={() => handlePreferenceChange("darkMode")}
                        />
                      }
                      label="Dark Mode"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Security
                  </Typography>
                  <Button variant="outlined" startIcon={<Security />}>
                    Change Password
                  </Button>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Dialog */}
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={editField.charAt(0).toUpperCase() + editField.slice(1)}
              type="text"
              fullWidth
              variant="outlined"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default UserProfileTemplate;
