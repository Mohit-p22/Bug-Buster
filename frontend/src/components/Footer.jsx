import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: '80px',
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Container maxWidth="lg" >
        <Grid container spacing={30}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              BugBuster
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your comprehensive website security solution
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} to="/" color="inherit" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link component={RouterLink} to="/services" color="inherit" sx={{ mb: 1 }}>
                Services
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" sx={{ mb: 1 }}>
                About
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link component={RouterLink} to="/privacy-policy" color="inherit" sx={{ mb: 1 }}>
                Privacy Policy
              </Link>
              <Link component={RouterLink} to="/term-and-condition" color="inherit" sx={{ mb: 1 }}>
                Terms of Service
              </Link>
              <Link component={RouterLink} to="/cookie-policy" color="inherit">
                Cookie Policy
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} BugBuster. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
