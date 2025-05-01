import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
  Alert,
  Divider,
  List,
} from '@mui/material';
import { CreditCard, Lock, Shield } from 'lucide-react';
import axios from 'axios';

const Payment = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    plan: 'pro',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/payment', formData);
      setStatus({ type: 'success', message: 'Payment successful! Your account has been upgraded.' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Payment failed. Please try again.' });
    }
  };

  const plans = [
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$29',
      period: 'per month',
      features: [
        '50 scans per month',
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
      price: '$99',
      period: 'per month',
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
            Upgrade Your Plan
          </Typography>
          <Typography variant="h5" align="center">
            Choose your plan and complete your payment
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Plan Selection */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Select Your Plan
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                  >
                    {plans.map((plan) => (
                      <Card
                        key={plan.id}
                        sx={{
                          mb: 2,
                          border: formData.plan === plan.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                        }}
                      >
                        <CardContent>
                          <FormControlLabel
                            value={plan.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="h6">{plan.name}</Typography>
                                <Typography variant="h4" color="primary">
                                  {plan.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {plan.period}
                                </Typography>
                                <List>
                                  {plan.features.map((feature, index) => (
                                    <Typography key={index} variant="body2">
                                      • {feature}
                                    </Typography>
                                  ))}
                                </List>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Payment Details
                </Typography>
                {status.message && (
                  <Alert severity={status.type} sx={{ mb: 2 }}>
                    {status.message}
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: <CreditCard sx={{ mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Lock size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Your payment information is secure and encrypted
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<Shield />}
                      >
                        Complete Payment
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Payment;