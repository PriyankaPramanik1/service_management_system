"use client";
import React from 'react';
import { Box, Container, Typography, Link, IconButton, Grid, Divider, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, Email, LocationOn, Phone, Send } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0f1420 0%, #1a2238 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #0066ff, #8a2be2)',
        }
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(0, 102, 255, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Company Info */}
          <Grid size={{xs:12,md:4}} >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0066ff, #8a2be2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2rem' }
              }}
            >
              NEXUS
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                lineHeight: 1.6,
                mb: 3,
                maxWidth: 300
              }}
            >
              Building the future of digital innovation. We create exceptional experiences 
              that transform businesses and empower users worldwide.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOn sx={{ color: '#0066ff', fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  123 Innovation Street, Tech City
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: '#8a2be2', fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: '#0066ff', fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  hello@nexus.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={ {xs:12,sm:6, md:2}}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                mb: 3,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: '2px',
                  background: 'linear-gradient(90deg, #0066ff, #8a2be2)',
                  borderRadius: 2
                }
              }}
            >
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Home', 'Services', 'Products', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#0066ff',
                      transform: 'translateX(5px)',
                    },
                    fontWeight: 500
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{xs:12,sm:6 ,md:2}} >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                mb: 3,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: '2px',
                  background: 'linear-gradient(90deg, #8a2be2, #0066ff)',
                  borderRadius: 2
                }
              }}
            >
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Documentation', 'Support', 'API', 'Tutorials', 'Blog'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  variant="body2"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#8a2be2',
                      transform: 'translateX(5px)',
                    },
                    fontWeight: 500
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid size ={{xs:12,md:4}}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                mb: 3,
                fontSize: '1.1rem',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 30,
                  height: '2px',
                  background: 'linear-gradient(90deg, #0066ff, #8a2be2)',
                  borderRadius: 2
                }
              }}
            >
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
              Subscribe to our newsletter for the latest updates and features.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0066ff';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
              <Button
                variant="contained"
                endIcon={<Send />}
                sx={{
                  background: 'linear-gradient(135deg, #0066ff, #8a2be2)',
                  borderRadius: '8px',
                  px: 3,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 102, 255, 0.3)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <Facebook />, color: '#0066ff' },
                { icon: <Twitter />, color: '#1da1f2' },
                { icon: <Instagram />, color: '#e4405f' },
                { icon: <Email />, color: '#8a2be2' }
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      color: social.color,
                      transform: 'translateY(-3px)',
                      borderColor: social.color,
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 3,
            gap: 2
          }}
        >
          {/* Copyright */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.6)',
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            © {new Date().getFullYear()} Nexus Technologies. All rights reserved.
          </Typography>

          {/* Legal Links */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' }
            }}
          >
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#0066ff',
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;