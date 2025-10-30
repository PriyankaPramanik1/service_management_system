"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  Box,
  Rating,
  Chip
} from '@mui/material';
import { Person, Assignment, Comment, Star } from '@mui/icons-material';

interface Feedback {
  _id: string;
  feedback: string;
  rating: number;
  userDetails: {
    name: string;
    email: string;
    phone: string;
    area: string;
  };
  bookingDetails: {
    _id: string;
    applianceType: string;
    serviceType: string;
    status: string;
  };
}

const Comments = () => {
  const [comments, setComments] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8400/get/feedback');
        setComments(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  console.log("comments", comments);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
  {/* Header Text Section */}
  <Box sx={{ textAlign: 'center', mb: 4 }}>
    <Typography 
      variant="h3" 
      component="h1" 
      gutterBottom
      sx={{ 
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
    >
      Customer Feedback
    </Typography>
    <Typography 
      variant="h6" 
      color="text.secondary" 
      sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
    >
      What our customers are saying about our service. Read their genuine experiences and ratings.
    </Typography>
  </Box>

  {/* Stats Section */}
  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" color="primary" fontWeight="bold">
        {comments.length}+
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Reviews
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" color="primary" fontWeight="bold">
        {comments.length > 0 
          ? (comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length).toFixed(1)
          : '0.0'
        }
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Average Rating
      </Typography>
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" color="primary" fontWeight="bold">
        {comments.slice(0, 4).length}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Showing
      </Typography>
    </Box>
  </Box>

  {/* Grid Section */}
  <Grid container spacing={3} sx={{ p: 3 }}>
    {comments.slice(0, 4).map((feedback) => (
      <Grid size={{xs:12,sm:6,md:3}} key={feedback._id}>
        <Card 
          sx={{ 
            height: '100%',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
        >
          <CardContent>
            {/* User Info Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="h6" component="h2">
                  {feedback.userDetails.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feedback.userDetails.email}
                </Typography>
              </Box>
            </Box>

            {/* Booking ID Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment color="action" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {feedback.bookingDetails._id.slice(-8)}...
                </Typography>
              </Box>
            </Box>

            {/* Rating Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star color="warning" sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating 
                    value={feedback.rating} 
                    readOnly 
                    size="small"
                    precision={0.5}
                  />
                  <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                    ({feedback.rating}/5)
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Comment Section */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Comment color="action" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Comment
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontStyle: 'italic',
                    backgroundColor: 'grey.50',
                    p: 1,
                    borderRadius: 1,
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    fontSize: '0.9rem'
                  }}
                >
                  "{feedback.feedback}"
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>
  );
};

export default Comments;