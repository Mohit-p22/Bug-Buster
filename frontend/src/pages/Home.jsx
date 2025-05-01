import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Bug, CheckCircle, Shield, Zap } from 'lucide-react';
import UrlScanner from '../components/UrlScanner';
import { flexbox } from '@mui/system';
import { LineChart } from '@mui/x-charts/LineChart';

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 10, md: 15 },
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), #000000)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            maskImage: 'radial-gradient(white, transparent 85%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={7}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', lg: '4rem' },
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  Detect Website Bugs Before Your Users Do
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Scan your website for 30+ bug types across forms, layout, security, and more. Get detailed reports and
                  fix issues before they impact your users.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 300, sm: 350, md: 400 },
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
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
                  <Bug sx={{ fontSize: 96, color: 'primary.main', opacity: 0.4 }} />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Scanner Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Scan Your Website Now
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Enter your website URL below to start a comprehensive bug scan. We'll check for issues with forms, layout,
              security, and more.
            </Typography>
          </Box>
          <UrlScanner />
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              What We Detect
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Our advanced scanning engine checks for 30+ types of bugs and issues across your website.
            </Typography>
          </Box>
          <Grid container spacing={5} >
            {[
              {
                icon: <Bug />,
                title: 'Form Issues',
                description: 'Validation errors, missing labels, accessibility problems n, more',
              },
              {
                icon: <Zap />,
                title: 'Layout Problems',
                description: ' Responsive design issues,overflow bugs, z-index conflicts, n more',
              },
              {
                icon: <Shield />,
                title: 'Security Vulnerabilities',
                description: 'XSS vulnerabilities, insecure forms, missing HTTPS, and tmore. ',
              },
              {
                icon: <CheckCircle />,
                title: 'Accessibility Issues',
                description: 'Missing alt text, contrast issues, keyboard navigation problems,and ',
              },
              {
                icon: <Zap />,
                title: 'Performance Issues',
                description: 'Slow loading resources, render-blocking scripts, large images,.',
              },
              {
                icon: <Bug />,
                title: 'SEO Problems',
                description: 'Missing meta tags, duplicate content, broken links, and more more,',
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    maxWidth : '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    justifyContent: 'center',
                    marginLeft:'30px',
                    
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'background.paper',
                      mb: 2,
                      display:'flex',
                      alignItems:'center',
                      
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;