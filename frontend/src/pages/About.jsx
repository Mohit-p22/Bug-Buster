import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import { Bug, Shield, Zap, CheckCircle, Users, Target } from 'lucide-react';

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Bug size={48} />,
      title: 'Comprehensive Bug Detection',
      description: 'Our advanced scanning technology detects over 30 types of bugs across your website. and there is many mor ebugs  which provide bug ',
    },
   
    {
      icon: <Zap size={48} />,
      title: 'Lightning Fast',
      description: 'Get detailed reports in minutes, not hours or days.',
    },
    {
      icon: <CheckCircle size={48} />,
      title: 'Easy to Use',
      description: 'Simple interface that makes bug detection accessible to everyone.',
    },
    {
      icon: <Shield size={48} />,
      title: 'Security First',
      description: 'Prioritizing your website\'s security with real-time vulnerability',
    },
    {
      icon: <Zap size={48} />,
      title: 'Lightning Fast',
      description: 'Get detailed reports in minutes, not hours or days and .',
    },
  ];

  const stats = [
    { number: '100+', label: 'Websites Scanned' },
    { number: '200+', label: 'Bugs Detected' },
    { number: '90%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(136deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 10%)`,
          color: 'black',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h2" gutterBottom>
                About BugBuster
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Making the web a better place, one bug at a time.
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                BugBuster was founded with a simple mission: to help website owners and developers
                identify and fix issues before they impact their users. Our platform combines
                advanced scanning technology with expert analysis to provide comprehensive
                bug detection and solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: 1,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bug size={200} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  height: '500',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  marginLeft:'50px',
                  textAlign: 'center',
                  borderRadius:'8px',
                }}
              >
                <Typography variant="h3" color="primary" gutterBottom>
                  {stat.number}
                </Typography>
                <Typography variant="h6">{stat.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose BugBuster?
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Our platform offers comprehensive solutions for website bug detection and fixing
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '10 0%',
                  p: 4,
                  width:'100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyContent:'center',
                  marginLeft:'50px',
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Mission Section */}
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: 20,
                background: 'rgba(0,0,0,0.05)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={200} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At BugBuster, we believe that every website deserves to be bug-free. Our mission is to
              empower website owners and developers with the tools they need to create flawless
              digital experiences.
            </Typography>
            <Typography variant="body1" paragraph>
              We combine cutting-edge technology with expert knowledge to provide comprehensive
              bug detection and solutions. Our team of experienced developers and QA specialists
              work tirelessly to ensure that our platform stays ahead of the curve in detecting
              and addressing website issues.
            </Typography>
            <Typography variant="body1">
              Join us in our mission to make the web a better place, one bug at a time.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;