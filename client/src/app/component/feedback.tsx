"use client";
import React, { JSX, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Grid,
  Rating,
  TextField,
  Alert,
  Paper,
  Card,
  Chip,
  CircularProgress,
  Fade,
  Slide,
  Avatar,
  Container,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../hook/authContext";
import { Box } from "@mui/system";
import {
  Star,
  RateReview,
  CheckCircle,
  CalendarToday,
  Build,
  Assignment,
  Send,
  EmojiEvents,
  Reviews,
  Favorite,
  ThumbUp,
  Mood,
  FormatQuote,
} from "@mui/icons-material";

// New vibrant color scheme
const VIBRANT_CYAN = '#00d4ff';
const ELECTRIC_PURPLE = '#a855f7';
const DARK_GRADIENT = 'linear-gradient(135deg, #0c0f1d 0%, #1a1b3a 50%, #2d1b69 100%)';
const GLASS_BG = 'rgba(255, 255, 255, 0.05)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.1)';
const GLOW_EFFECT = '0 0 20px rgba(0, 212, 255, 0.3)';

function FeedBack() {
  const { user, booking } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [hover, setHover] = useState(-1);

  const currentUser = user?.id;
  
  // Filter bookings for current user AND only completed bookings
  const filteredBookings =
    booking?.filter((book) => {
      const isUserMatch = book.userId === currentUser;
      const status = book.status?.toLowerCase()?.trim();
      const isComplete = status === "complete" || status === "completed" || status === "finished" || status === "done";
      
      return isUserMatch && isComplete;
    }) ?? [];

  // Auto-select the most recent completed booking when component loads
  useEffect(() => {
    if (filteredBookings.length > 0) {
      const sortedBookings = [...filteredBookings].sort(
        (a, b) =>
          new Date(b.preferredDate).getTime() -
          new Date(a.preferredDate).getTime()
      );
      setSelectedBooking(sortedBookings[0]);
    } else {
      setSelectedBooking(null);
    }
  }, [filteredBookings]);

  const fetchAllFeedback = () => {
    setLoadingFeedbacks(true);
    axios
      .get("http://localhost:8400/get/feedback")
      .then((res) => {
        setFeedbacks(res.data);
        setLoadingFeedbacks(false);
      })
      .catch((err) => {
        console.log("error", err);
        setLoadingFeedbacks(false);
      });
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const hasFeedbackForSelectedBooking = () => {
    if (!selectedBooking) return false;
    return feedbacks.some((fb) => {
      if (fb.bookingId === selectedBooking._id) return true;
      if (fb.bookingDetails && fb.bookingDetails._id === selectedBooking._id) return true;
      if (fb.bookingDetails && fb.bookingDetails.id === selectedBooking._id) return true;
      return false;
    });
  };

  const getFeedbacksForSelectedBooking = () => {
    if (!selectedBooking) return [];
    return feedbacks.filter((fb) => {
      return (
        fb.bookingId === selectedBooking._id ||
        (fb.bookingDetails && fb.bookingDetails._id === selectedBooking._id) ||
        (fb.bookingDetails && fb.bookingDetails.id === selectedBooking._id)
      );
    });
  };

  const handleSubmit = async () => {
    if (!selectedBooking) {
      setError("No booking found");
      return;
    }

    if (!feedback.trim()) {
      setError("Please provide feedback");
      return;
    }

    if (!rating || rating === 0) {
      setError("Please provide a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8400/feedback", {
        userId: user?.id,
        bookingId: selectedBooking._id,
        feedback: feedback.trim(),
        rating,
      });

      setSuccess(true);
      fetchAllFeedback();
      setFeedback("");
      setRating(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Feedback submission error:", error);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Rating labels with emojis
  const ratingLabels: { [index: string]: { text: string, icon: JSX.Element, color: string } } = {
    1: { text: 'Poor', icon: <Mood sx={{ color: '#ff6b6b' }} />, color: '#ff6b6b' },
    2: { text: 'Fair', icon: <Mood sx={{ color: '#ffa726' }} />, color: '#ffa726' },
    3: { text: 'Good', icon: <Mood sx={{ color: '#ffd54f' }} />, color: '#ffd54f' },
    4: { text: 'Very Good', icon: <ThumbUp sx={{ color: VIBRANT_CYAN }} />, color: VIBRANT_CYAN },
    5: { text: 'Excellent', icon: <Favorite sx={{ color: ELECTRIC_PURPLE }} />, color: ELECTRIC_PURPLE }
  };

  // If no completed bookings found
  if (filteredBookings.length === 0) {
    return (
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(168,85,247,0.1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                border: '2px solid rgba(0,212,255,0.3)',
              }}
            >
              <Reviews sx={{ fontSize: 48, color: VIBRANT_CYAN }} />
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2,
              }}
            >
              Share Your Journey
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                mb: 3,
                maxWidth: 500,
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Your feedback helps us create amazing experiences. 
              Once you complete a service, you'll be able to share your story here.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<EmojiEvents />} 
                label="Complete a service to begin" 
                sx={{ 
                  background: GLASS_BG,
                  color: 'rgba(255,255,255,0.9)',
                  border: `1px solid ${GLASS_BORDER}`,
                  fontSize: '1rem',
                  py: 2,
                  px: 1
                }} 
              />
            </Box>
          </Box>
        </Fade>
      </Container>
    );
  }

  if (loadingFeedbacks) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(168,85,247,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CircularProgress 
              size={40} 
              sx={{ 
                color: VIBRANT_CYAN,
              }} 
            />
          </Box>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            Loading Your Stories...
          </Typography>
        </Box>
      </Box>
    );
  }

  const hasFeedback = hasFeedbackForSelectedBooking();
  const bookingFeedbacks = getFeedbacksForSelectedBooking();

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={600}>
        <Box sx={{ py: 4 }}>
          {/* Error Message */}
          {error && (
            <Slide in={true} direction="down">
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 3,
                  background: 'rgba(239, 83, 80, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(239, 83, 80, 0.3)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b'
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {error}
                </Typography>
              </Alert>
            </Slide>
          )}

          {/* Success Message */}
          {success && (
            <Slide in={true} direction="down">
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 4,
                  borderRadius: 3,
                  background: 'rgba(76, 175, 80, 0.1)',
                  color: '#4caf50',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiAlert-icon': {
                    color: '#4caf50'
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  🎉 Thank you! Your story has been shared with the world.
                </Typography>
              </Alert>
            </Slide>
          )}

          {/* Show existing feedbacks or form */}
          {selectedBooking && hasFeedback ? (
            <Slide in={true} direction="up">
              <Box>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(76,175,80,0.2) 0%, rgba(76,175,80,0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      border: '2px solid rgba(76,175,80,0.3)',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 1,
                    }}
                  >
                    Your Voice Matters
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                    Thank you for sharing your experience
                  </Typography>
                </Box>
                
                {bookingFeedbacks.map((fb, index) => (
                  <Card
                    key={fb._id || index}
                    sx={{
                      p: 5,
                      mb: 4,
                      background: 'radial-gradient(circle at top right, rgba(76,175,80,0.1) 0%, rgba(15, 20, 32, 0.8) 100%)',
                      border: '1px solid rgba(76,175,80,0.2)',
                      borderRadius: 4,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                      <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            background: `linear-gradient(135deg, #4caf50, #66bb6a)`,
                            mx: 'auto',
                            mb: 2,
                            fontSize: '2rem',
                            fontWeight: 700,
                          }}
                        >
                          {fb.rating}
                        </Avatar>
                        <Rating value={fb.rating} readOnly size="large" />
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                          {ratingLabels[fb.rating]?.text}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flex: 1, position: 'relative' }}>
                        <FormatQuote 
                          sx={{ 
                            fontSize: 60, 
                            color: 'rgba(76,175,80,0.2)', 
                            position: 'absolute',
                            top: -20,
                            left: -10,
                          }} 
                        />
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: 'white', 
                            mb: 3,
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            position: 'relative',
                            zIndex: 1,
                            pl: 4,
                          }}
                        >
                          "{fb.feedback}"
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3, pl: 4 }}>
                          <Chip 
                            icon={<CalendarToday />}
                            label={new Date(fb.createdAt || Date.now()).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            sx={{ 
                              background: GLASS_BG,
                              color: 'rgba(255,255,255,0.9)',
                              border: `1px solid ${GLASS_BORDER}`,
                              fontWeight: 600,
                            }}
                          />
                          <Chip 
                            icon={ratingLabels[fb.rating]?.icon}
                            label={`${ratingLabels[fb.rating]?.text} Experience`}
                            sx={{ 
                              background: 'rgba(76, 175, 80, 0.2)',
                              color: '#4caf50',
                              border: '1px solid rgba(76, 175, 80, 0.3)',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Slide>
          ) : (
            // Show feedback input form when NO feedback exists for completed booking
            <Slide in={true} direction="up">
              <Box>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(168,85,247,0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      border: '2px solid rgba(0,212,255,0.3)',
                    }}
                  >
                    <RateReview sx={{ fontSize: 48, color: VIBRANT_CYAN }} />
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 2,
                    }}
                  >
                    Share Your Story
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
                    Tell us about your service experience
                  </Typography>
                </Box>

                {/* Selected Booking Details */}
                {selectedBooking && (
                  <Card
                    sx={{
                      p: 4,
                      mb: 5,
                      background: 'radial-gradient(circle at top left, rgba(0,212,255,0.1) 0%, rgba(15, 20, 32, 0.8) 100%)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: 3,
                      boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Assignment sx={{ fontSize: 32, color: VIBRANT_CYAN }} />
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 700,
                        }}
                      >
                        Service Completed
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      <Grid size={{xs:12,md:6}} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, borderRadius: 2, background: GLASS_BG }}>
                          <Build sx={{ fontSize: 24, color: ELECTRIC_PURPLE }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                              Appliance
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                              {selectedBooking.applianceType}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: GLASS_BG }}>
                          <Assignment sx={{ fontSize: 24, color: VIBRANT_CYAN }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                              Service Type
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                              {selectedBooking.serviceType}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={{xs:12,md:6}} >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, borderRadius: 2, background: GLASS_BG }}>
                          <CalendarToday sx={{ fontSize: 24, color: ELECTRIC_PURPLE }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                              Service Date
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                              {new Date(selectedBooking.preferredDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: 'rgba(76, 175, 80, 0.1)' }}>
                          <CheckCircle sx={{ fontSize: 24, color: '#4caf50' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(76, 175, 80, 0.8)', fontWeight: 600 }}>
                              Status
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                              {selectedBooking.status}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )}

                <Card
                  sx={{
                    p: 5,
                    background: DARK_GRADIENT,
                    border: `1px solid ${GLASS_BORDER}`,
                    borderRadius: 4,
                    boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Background decorative elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -100,
                      right: -100,
                      width: 300,
                      height: 300,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
                      zIndex: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -150,
                      left: -150,
                      width: 400,
                      height: 400,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
                      zIndex: 0,
                    }}
                  />

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h3"
                      sx={{ 
                        mb: 4, 
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      How Was Your <span style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Experience?</span>
                    </Typography>

                    {/* Rating Section */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Rating
                          name="rating"
                          value={rating}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              setRating(newValue);
                            }
                          }}
                          onChangeActive={(event, newHover) => {
                            setHover(newHover);
                          }}
                          sx={{ 
                            mb: 2,
                            '& .MuiRating-icon': {
                              fontSize: '3.5rem',
                              color: 'rgba(255,255,255,0.3)',
                              transition: 'all 0.3s ease',
                            },
                            '& .MuiRating-iconFilled': {
                              color: VIBRANT_CYAN,
                              filter: GLOW_EFFECT,
                            },
                            '& .MuiRating-iconHover': {
                              color: ELECTRIC_PURPLE,
                              transform: 'scale(1.1)',
                            }
                          }}
                          icon={<Star sx={{ fontSize: 'inherit' }} />}
                          emptyIcon={<Star sx={{ fontSize: 'inherit' }} />}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: 40 }}>
                          {rating !== null && (
                            <>
                              {ratingLabels[hover !== -1 ? hover : rating]?.icon}
                              <Typography 
                                variant="h5" 
                                sx={{ 
                                  color: ratingLabels[hover !== -1 ? hover : rating]?.color,
                                  fontWeight: 700,
                                }}
                              >
                                {ratingLabels[hover !== -1 ? hover : rating]?.text}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Feedback Input */}
                    <TextField
                      label="Tell us your story in detail..."
                      multiline
                      rows={6}
                      fullWidth
                      sx={{ 
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          fontSize: '1.1rem',
                          '& fieldset': {
                            borderColor: GLASS_BORDER,
                            borderWidth: 2,
                            borderRadius: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: VIBRANT_CYAN,
                            boxShadow: GLOW_EFFECT,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: VIBRANT_CYAN,
                            boxShadow: GLOW_EFFECT,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '1.1rem',
                        },
                      }}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      error={!!error && !feedback.trim()}
                    />

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleSubmit}
                        disabled={loading || !selectedBooking}
                        sx={{
                          background: `linear-gradient(135deg, ${VIBRANT_CYAN}, ${ELECTRIC_PURPLE})`,
                          borderRadius: 3,
                          py: 2,
                          px: 6,
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          minWidth: 280,
                          boxShadow: GLOW_EFFECT,
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: `0 15px 40px rgba(0, 212, 255, 0.4)`,
                          },
                          '&:disabled': {
                            background: 'rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.3)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={28} sx={{ color: 'white' }} />
                        ) : (
                          "Share Your Story"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Slide>
          )}
        </Box>
      </Fade>
    </Container>
  );
}

export default FeedBack;