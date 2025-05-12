import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  styled,
} from '@mui/material';
import { Bug } from 'lucide-react';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 2rem',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the logged-in user is an admin
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const adminEmail = localStorage.getItem('adminEmail'); // Check for admin login

    if (adminEmail) {
      setIsLoggedIn(true);
      setIsAdmin(true); // Set admin state
    } else if (userEmail) {
      setIsLoggedIn(true);
      setUserName(userEmail.split('@')[0]);
    }

    // Add event listener for auth state changes
    const handleAuthStateChange = (event) => {
      if (event.detail.isLoggedIn) {
        if (event.detail.isAdmin) {
          setIsAdmin(true);
          setIsLoggedIn(true);
        } else {
          setIsAdmin(false);
          setIsLoggedIn(true);
          setUserName(event.detail.email.split('@')[0]);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName('');
      }
    };

    window.addEventListener('authStateChanged', handleAuthStateChange);

    // Cleanup
    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChange);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName('');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminEmail'); // Clear admin login
    handleClose();
    navigate('/login'); // Redirect to login page
  };

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography
          variant="h6"
          component={Link}
          to={isAdmin ? '/dashboard' : '/'}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          BugBuster
        </Typography>

        <NavLinks>
          {!isAdmin ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/services">
                Services
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/user-details">
                User Details
              </Button>
              <Button color="inherit" component={Link} to="/bug-reports">
                Bug Reports
              </Button>
            </>
          )}
        </NavLinks>

        <Box>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : isAdmin ? (
            // Admin Menu
            <>
              <IconButton
                size="large"
                aria-label="admin account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>A</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            // User Menu
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard');
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
