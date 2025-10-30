"use client";
import { Grid, Card, CardMedia, CardContent, Typography, Box, Chip } from "@mui/material";
import { useAuth } from "../hook/authContext";
import Link from "next/link";
import { styled } from "@mui/material/styles";

interface Service {
  _id: string;
  serviceName: string;
  serviceImage: File | string;
  serviceHeader: string;
}

// Styled components for new design
const ServiceCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    zIndex: 1,
  }
}));

const ImageContainer = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
  }
});

const ServiceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  fontWeight: 'bold',
  zIndex: 2,
}));

function Services() {
  const { service } = useAuth();

  if (!service || !Array.isArray(service)) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 10,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 3,
          mx: 2
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No services available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2
          }}
        >
          Our Premium Services
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#6c757d',
            maxWidth: '600px',
            mx: 'auto',
            fontStyle: 'italic'
          }}
        >
          Expert appliance repair solutions delivered with excellence across multiple cities
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ px: 4 }}>
        {service.map((service: Service | null) => {
          if (!service) return null;

          const imageSrc =
            service.serviceImage instanceof File
              ? URL.createObjectURL(service.serviceImage)
              : service.serviceImage;

          return (
            <Grid size={{xs:12,sm:6,md:4}} key={service._id}>
              <Link href={`/services/${service?._id}`} style={{ textDecoration: 'none' }}>
                <ServiceCard>
                  <ImageContainer>
                    <CardMedia
                      sx={{
                        height: 240,
                        width: "100%",
                        objectFit: "cover",
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                      image={imageSrc}
                      title={service.serviceName}
                      component="img"
                    />
                    <ServiceChip label="Professional" size="small" />
                  </ImageContainer>
                  
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontWeight: 'bold',
                        }}
                      >
                        {service?.serviceName}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: '#6c757d',
                        lineHeight: 1.6,
                        fontSize: '0.9rem'
                      }}
                    >
                      {service?.serviceHeader}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#667eea',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}
                      >
                        Click to learn more →
                      </Typography>
                    </Box>
                  </CardContent>
                </ServiceCard>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Services;