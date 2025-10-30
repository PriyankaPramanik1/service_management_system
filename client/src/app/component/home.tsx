"use client";

import { useState } from "react";
import BookServiceModal from "../component/bookServiceModal";
import React from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
  Card,
  Grid,
  Chip,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle,
  Build,
  ArrowForward,
  PlayArrow,
  Star,
  EmojiEvents,
  Group,
  SupportAgent,
} from "@mui/icons-material";
import Services from "../services/page";

// New vibrant color scheme
const ELECTRIC_BLUE = '#0066ff';
const NEON_PURPLE = '#8a2be2';
const VIBRANT_CYAN = '#00d4ff';
const DARK_SPACE = '#0f1420';
const LIGHT_GLOW = 'rgba(0, 102, 255, 0.15)';

// Animated gradient background component
const AnimatedBackground = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0c0f1d 0%, #1a1b3a 50%, #2d1b69 100%)
      `,
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent)',
        animation: 'shimmer 3s ease-in-out infinite',
      }
    }}
  />
);

const FloatingElements = () => (
  <>
    {/* Floating circles */}
    <Box
      sx={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 102, 255, 0.1) 0%, transparent 70%)',
        top: '-10%',
        right: '-10%',
        animation: 'float 6s ease-in-out infinite',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        bottom: '-5%',
        left: '-5%',
        animation: 'float 8s ease-in-out infinite reverse',
      }}
    />
  </>
);

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0c0f1d 0%, #1a1b3a 50%, #2d1b69 100%)',
      }}
    >
      <AnimatedBackground />
      <FloatingElements />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{xs:12,md:6}} >
            <Fade in={true} timeout={1000}>
              <Box>
                {/* Badge */}
                <Chip
                  icon={<EmojiEvents sx={{ color: VIBRANT_CYAN }} />}
                  label="Premium Appliance Services"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    color: VIBRANT_CYAN,
                    fontWeight: 600,
                    mb: 3,
                    px: 1,
                    py: 2,
                    fontSize: '0.9rem',
                  }}
                />

                {/* Main Heading */}
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                    background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #a855f7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    lineHeight: 1.1,
                  }}
                >
                  Expert
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Appliance Care
                  </Box>
                </Typography>

                {/* Subheading */}
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Professional repair and maintenance services for all your home appliances. 
                  Fast, reliable, and trusted by thousands of satisfied customers.
                </Typography>

                {/* Service Highlights */}
                <Box sx={{ mb: 4 }}>
                  {[
                    'Air Conditioner Repair',
                    'Washing Machine Service',
                    'Refrigerator Maintenance',
                    'Television Repair',
                    'Microwave Services'
                  ].map((service, index) => (
                    <Box
                      key={service}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        animation: `slideInLeft 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      <CheckCircle
                        sx={{
                          color: VIBRANT_CYAN,
                          mr: 2,
                          fontSize: '1.2rem',
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 500,
                        }}
                      >
                        {service}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* CTA Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: `linear-gradient(135deg, ${ELECTRIC_BLUE}, ${NEON_PURPLE})`,
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 30px ${LIGHT_GLOW}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Book Service Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        borderColor: VIBRANT_CYAN,
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    How It Works
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid size={{xs:12,md:6}} >
            <Slide in={true} direction="up" timeout={800}>
              <Box
                sx={{
                  position: 'relative',
                  perspective: '1000px',
                }}
              >
                {/* Main Service Card */}
                <Card
                  sx={{
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
                    transform: 'rotateY(5deg) rotateX(5deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'rotateY(0deg) rotateX(0deg)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ELECTRIC_BLUE}, ${NEON_PURPLE})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <Build sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Quick & Reliable Service
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    Our certified technicians provide fast and efficient solutions for all your appliance needs with 24/7 support.
                  </Typography>
                  
                  {/* Stats in card */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Star sx={{ color: '#FFD700' }} />}
                      label="4.9/5 Rating"
                      size="small"
                      sx={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                      }}
                    />
                    <Chip
                      icon={<Group sx={{ color: VIBRANT_CYAN }} />}
                      label="5K+ Customers"
                      size="small"
                      sx={{
                        background: 'rgba(0, 212, 255, 0.1)',
                        color: VIBRANT_CYAN,
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                      }}
                    />
                  </Box>
                </Card>

                {/* Floating elements around the card */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite alternate',
                    zIndex: -1,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite alternate',
                    zIndex: -1,
                  }}
                />
              </Box>
            </Slide>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Fade in={true} timeout={1500}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 2, md: 6 },
              flexWrap: 'wrap',
              mt: { xs: 6, md: 10 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            {[
              { number: "5K+", label: "Happy Customers", icon: <Group /> },
              { number: "50+", label: "Expert Technicians", icon: <SupportAgent /> },
              { number: "24/7", label: "Support", icon: <Build /> },
              { number: "98%", label: "Satisfaction", icon: <Star /> },
            ].map((stat, index) => (
              <Card
                key={index}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  minWidth: { xs: 140, md: 160 },
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    color: VIBRANT_CYAN,
                    fontSize: '2rem',
                    mb: 1,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Fade>
      </Container>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Box>
  );
};

const FixedBookServiceButton = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        sx={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "rotate(-90deg) translate(50%, -100%)",
          transformOrigin: "100% 0",
          background: `linear-gradient(135deg, ${ELECTRIC_BLUE}, ${NEON_PURPLE})`,
          "&:hover": {
            background: `linear-gradient(135deg, #0052cc, #7c3aed)`,
            transform: "rotate(-90deg) translate(50%, -100%) scale(1.05)",
          },
          fontWeight: 800,
          py: 1.5,
          px: 3,
          zIndex: 1000,
          textTransform: "uppercase",
          borderRadius: "8px 8px 0 0",
          boxShadow: `0 8px 25px ${LIGHT_GLOW}`,
          transition: "all 0.3s ease-in-out",
          minWidth: "auto",
          whiteSpace: "nowrap",
          fontSize: "0.9rem",
          letterSpacing: "0.5px",
        }}
      >
        <Build sx={{ mr: 1, fontSize: '1.2rem' }} />
        Book Service
      </Button>

      <BookServiceModal open={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

const HomePage = () => {
  return (
    <>
      <CssBaseline />
      <Box sx={{ position: "relative", background: DARK_SPACE }}>
        <HeroSection />
        <FixedBookServiceButton />

        {/* Services Section */}
        <Container maxWidth="lg" sx={{ py: 8, minHeight: "50vh" }}>
          <Services/>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;