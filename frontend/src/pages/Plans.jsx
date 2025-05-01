import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from '@mui/material';
import { Check, Zap, Shield, Globe, Star } from 'lucide-react';

const Plans = () => {
  const theme = useTheme();

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'month',
      features: [
        '5 scans per month',
        'Basic bug detection',
        'Email support',
        'Standard report format',
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '29',
      period: 'month',
      features: [
        '50 scans per month',
        'Advanced bug detection',
        'Priority support',
        'Detailed reports',
        'API access',
        'Team collaboration',
      ],
      buttonText: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '99',
      period: 'month',
      features: [
        'Unlimited scans',
        'Custom bug detection rules',
        '24/7 support',
        'Custom reporting',
        'API access',
        'Team collaboration',
        'Custom integrations',
        'Dedicated account manager',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Fast Scanning',
      description: 'Get results in minutes, not hours or days.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Security Focused',
      description: 'Prioritize security vulnerabilities in your reports.',
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Coverage',
      description: 'Scan websites from anywhere in the world.',
    },
    {
      icon: <Star size={24} />,
      title: 'Expert Support',
      description: 'Get help from our team of bug detection experts.',
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            Choose Your Plan
          </Typography>
          <Typography variant="h5" align="center">
            Find the perfect plan for your website testing needs
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  ...(plan.popular && {
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: 'scale(1.05)',
                  }),
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: theme.palette.primary.main,
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: '0 4px 0 4px',
                    }}
                  >
                    <Typography variant="body2">Most Popular</Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" component="span">
                      ${plan.price}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                      /{plan.period}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex}>
                        <ListItemIcon>
                          <Check size={20} color={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Plans;
 