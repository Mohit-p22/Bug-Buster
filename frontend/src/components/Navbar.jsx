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
  styled 
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
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setIsLoggedIn(true);
      setUserName(userEmail.split('@')[0]);
    }

    // Add event listener for auth state changes
    const handleAuthStateChange = (event) => {
      if (event.detail.isLoggedIn) {
        setIsLoggedIn(true);
        setUserName(event.detail.email.split('@')[0]);
      } else {
        setIsLoggedIn(false);
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
    setUserName('');
    localStorage.removeItem('userEmail');
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <StyledToolbar>
      
        <Typography variant="h6"  component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
       
        BugBuster
        </Typography>

        <NavLinks>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/services">Services</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
        </NavLinks>

        <Box>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          ) : (
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
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
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
