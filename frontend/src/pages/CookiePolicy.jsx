import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import { Cookie, Shield, Settings, Clock } from 'lucide-react';

const CookiePolicy = () => {
  const theme = useTheme();

  const cookieTypes = [
    {
      type: 'Essential Cookies',
      purpose: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      duration: 'Session',
      examples: ['Authentication', 'Security', 'Load Balancing'],
    },
    {
      type: 'Performance Cookies',
      purpose: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      duration: '2 years',
      examples: ['Google Analytics', 'Page Load Times', 'Error Logging'],
    },
    {
      type: 'Functional Cookies',
      purpose: 'These cookies enable the website to provide enhanced functionality and personalization.',
      duration: '1 year',
      examples: ['Language Preferences', 'User Settings', 'Live Chat Services'],
    },
    {
      type: 'Targeting Cookies',
      purpose: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
      duration: '1 year',
      examples: ['Marketing', 'Advertising', 'Social Media Sharing'],
    },
  ];

  const features = [
    {
      icon: <Cookie size={40} />,
      title: 'Cookie Management',
      description: 'Control your cookie preferences through our easy-to-use settings panel.',
    },
    {
      icon: <Shield size={40} />,
      title: 'Data Protection',
      description: 'We ensure your data is protected and only used for intended purposes.',
    },
    {
      icon: <Settings size={40} />,
      title: 'Customizable Settings',
      description: 'Choose which non-essential cookies you want to accept and reject and.',
    },
    {
      icon: <Clock size={40} />,
      title: 'Regular Updates',
      description: 'We regularly review and update our cookie policy to ensure compliance.',
    },
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
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            Cookie Policy
          </Typography>
          <Typography variant="h5" align="center">
            Understanding how and why we use cookies
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Introduction */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" paragraph>
            This Cookie Policy explains how BugBuster ("we", "us", and "our") uses cookies and similar
            technologies to recognize you when you visit our website. It explains what these technologies
            are and why we use them, as well as your rights to control our use of them.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Cookie Types Table */}
        <Typography variant="h4" gutterBottom>
          Types of Cookies We Use
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Examples</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cookieTypes.map((cookie, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">{cookie.type}</Typography>
                  </TableCell>
                  <TableCell>{cookie.purpose}</TableCell>
                  <TableCell>{cookie.duration}</TableCell>
                  <TableCell>{cookie.examples.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Additional Information */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            How to Control Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            You can set or amend your web browser controls to accept or refuse cookies. If you choose
            to reject cookies, you may still use our website though your access to some functionality
            and areas of our website may be restricted.
          </Typography>
        </Box>

        {/* Contact Information */}
        <Box>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about our use of cookies or other technologies, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@bugbuster.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Bug Street, Debug City, 12345
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CookiePolicy; 