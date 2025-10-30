"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import { styled } from "@mui/material/styles";
import BookServiceModal from "../../component/bookServiceModal";
// import BookServiceModal from "../../component/bookServiceModal";

interface Service {
  _id: string;
  serviceName: string;
  serviceImage: string;
  serviceHeader?: string;
  serviceDetails?: string;
  serviceType?: string[];
  serviceInclude?: string[];
}

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '24px',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"><polygon fill=\"rgba(255,255,255,0.05)\" points=\"0,1000 1000,0 1000,1000\"/></svg>")',
  }
}));

const ServiceImageCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 30px 50px rgba(0,0,0,0.15)',
  }
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '16px',
  padding: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const ServiceChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '12px',
  padding: theme.spacing(0.5),
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.serviceid as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8400/get/singleService/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        const data = await response.json();
        setService(data.data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading Service Details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <Box textAlign="center">
          <Typography variant="h4" color="error" gutterBottom>
            Oops!
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!service) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <Typography variant="h5">Service not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "Roboto, sans-serif",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection>
          <Box position="relative" zIndex={1}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {service.serviceName}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                mb: 3,
                fontWeight: 300,
              }}
            >
              Professional Installation • Expert Repair • Premium Service
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Book This Service
            </Button>
          </Box>
        </HeroSection>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Service Image */}
          <Grid size={{xs:12, md:6}} >
            <ServiceImageCard>
              <CardMedia
                sx={{
                  height: 400,
                  width: "100%",
                  objectFit: "cover",
                }}
                image={service.serviceImage}
                title={service.serviceName}
                component="img"
              />
            </ServiceImageCard>
          </Grid>

          {/* Service Details */}
          <Grid size={{xs:12,md:6}} >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Service Overview
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: '#2d3748',
                  lineHeight: 1.6,
                }}
              >
                {service.serviceHeader}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  mb: 4,
                  color: '#4a5568',
                  fontSize: '1.1rem',
                }}
              >
                {service.serviceDetails}
              </Typography>

              {service.serviceType && service.serviceType.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                    Service Types:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {service.serviceType.map((type, index) => (
                      <ServiceChip
                        key={index}
                        label={type}
                        icon={<CheckIcon sx={{ color: 'white !important' }} />}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Service Includes Section */}
        {service.serviceInclude && service.serviceInclude.length > 0 && (
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              What's Included
            </Typography>

            <Grid container spacing={3}>
              {service.serviceInclude.map((item, index) => (
                <Grid size={{xs:12, sm:6, md:4}}  key={index}>
                  <FeatureCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <CheckIcon sx={{ color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2d3748',
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#718096',
                        lineHeight: 1.6,
                      }}
                    >
                      Professional {item.toLowerCase()} service with guaranteed quality and customer satisfaction.
                    </Typography>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Reviews Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h3"
            component="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Customer Reviews
          </Typography>

          <Grid container spacing={3}>
            {/* Sample Review Cards */}
            <Grid size={{xs:12, md:4}} >
              <ReviewCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>JS</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      John Smith
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 18 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                  "Excellent service! The technician was professional and fixed my issue quickly. Highly recommended!"
                </Typography>
              </ReviewCard>
            </Grid>

            <Grid size={{xs:12, md:4}} >
              <ReviewCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#764ba2', mr: 2 }}>SD</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Sarah Davis
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 18 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                  "Outstanding work! They went above and beyond to ensure everything was perfect. Will use again!"
                </Typography>
              </ReviewCard>
            </Grid>

            <Grid size={{xs:12, md:4}} >
              <ReviewCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#667eea', mr: 2 }}>MJ</Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Mike Johnson
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: '#fbbf24', fontSize: 18 }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                  "Professional and efficient service. The team was knowledgeable and completed the job on time."
                </Typography>
              </ReviewCard>
            </Grid>
          </Grid>
        </Box>

        <BookServiceModal open={modalOpen} onClose={handleCloseModal} />
      </Container>
    </Box>
  );
}