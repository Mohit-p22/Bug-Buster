import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  List,
  Stack,
} from '@mui/material';
import { Shield, Check } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Payment = () => {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '99',
      period: 'per month',
      features: [
        '5 scans',
        'Basic bug detection',
        'Email support',
        'Basic reports',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '499',
      period: 'per month',
      features: [
        '50 scans',
        'Advanced bug detection',
        'Priority support',
        'Detailed reports',
        'API access',
        'Team collaboration',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '999',
      period: 'per month',
      features: [
        'Unlimited scans',
        'Custom bug detection rules',
        '24/7 support',
        'Custom reporting',
        'API access',
        'Team collaboration',
        'Custom integrations',
        'Dedicated manager',
      ],
    },
  ];

  const handleCheckout = async (plan) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please login to continue',
          position: 'bottom-end',
          toast: true,
          timer: 3000,
          showConfirmButton: false
        });
        return;
      }

      // Create order on your backend
      const response = await axios.post('http://localhost:8080/api/payment/create-order', {
        plan: plan.id,
        amount: plan.price,
        email: userEmail
      });

      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        name: 'Bug Buster',
        description: `${plan.name} Subscription`,
        order_id: response.data.orderId,
        handler: async (response) => {
          try {
            // Verify payment on your backend
            await axios.post('http://localhost:8080/api/payment/verify', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              email: userEmail,
              plan: plan.id
            });

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Payment successful! Your account has been upgraded.',
              position: 'bottom-end',
              toast: true,
              timer: 3000,
              showConfirmButton: false
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Payment verification failed. Please contact support.',
              position: 'bottom-end',
              toast: true,
              timer: 3000,
              showConfirmButton: false
            });
          }
        },
        prefill: {
          email: userEmail
        },
        theme: {
          color: theme.palette.primary.main
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to initiate payment. Please try again.',
        position: 'bottom-end',
        toast: true,
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 10%)`,
          color: 'black',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Choose Your Plan
          </Typography>
          <Typography variant="h5" align="center">
            Select the perfect plan for your needs
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  width:'350px',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                  ...(selectedPlan === plan.id && {
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: 6,
                  }),
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ₹{plan.price}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {plan.period}
                  </Typography>
                  <List sx={{ mb: 2 }}>
                    {plan.features.map((feature, index) => (
                      <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Check size={20} color={theme.palette.primary.main} />
                        <Typography variant="body1">{feature}</Typography>
                      </Stack>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Shield />}
                    onClick={() => handleCheckout(plan)}
                    sx={{ mt: 'auto' }}
                  >
                    Get Started
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

export default Payment;