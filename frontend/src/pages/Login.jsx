import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(''); // Track selected user type

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9][\w.-]*@[a-zA-Z0-9][\w.-]*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let error = '';
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    // Check if there are any errors
    if (emailError || passwordError || !userType) {
      if (!userType) {
        Swal.fire({
          icon: 'error',
          title: '<span style="font-size: 14px;">User Type Required</span>',
          text: 'Please select type (User or Admin)',
          position: 'bottom-end',
          width: '350px',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-small-popup', 
          },
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      if (userType === 'admin') {
        // Admin login validation
        if (formData.email === 'admin123@gmail.com' && formData.password === 'admin123@') {
          localStorage.setItem('adminEmail', formData.email);
          Swal.fire({
            icon: 'success',
            title: '<span style="font-size: 14px;">Admin Login Successful</span>',
            text: 'Welcome, Admin!',
            position: 'bottom-end',
            width: '280px', // Reduced width by 30%
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              popup: 'swal-small-popup', // Custom class for further styling
            },
          });
          navigate('/admin'); // Redirect to admin page
        } else {
          Swal.fire({
            icon: 'error',
            title: '<span style="font-size: 14px;">Login Failed</span>',
            text: 'Invalid admin credentials',
            position: 'bottom-end',
            width: '280px', // Reduced width by 30%
            toast: true,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              popup: 'swal-small-popup', // Custom class for further styling
            },
          });
        }
      } else {
        // User login validation
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('username', response.data.username);

        // Dispatch custom event for Navbar update
        window.dispatchEvent(
          new CustomEvent('authStateChanged', {
            detail: { isLoggedIn: true, email: formData.email },
          })
        );

        Swal.fire({
          icon: 'success',
          title: '<span style="font-size: 14px;">Login Successful</span>',
          text: 'Welcome back!',
          position: 'bottom-end',
          width: '280px', // Reduced width by 30%
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-small-popup', // Custom class for further styling
          },
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: '<span style="font-size: 14px;">Login Failed</span>',
        text: 'Invalid email or password',
        position: 'bottom-end',
        width: '280px', // Reduced width by 30%
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'swal-small-popup', // Custom class for further styling
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Welcome Back
            </Typography>
          }
          subheader={
            <Typography variant="body1" color="text.secondary" align="center">
              Sign in to your account to continue
            </Typography>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email}
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="user-type-label">Select User Type</InputLabel>
              <Select
                labelId="user-type-label"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                label="Select User Type"
              >
                <MenuItem value="">Select User Type</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading || Object.values(errors).some((error) => error !== '')}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </CardContent>
        <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                component="span"
                color="primary"
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                Sign up
              </Typography>
            </Link>
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Login;
