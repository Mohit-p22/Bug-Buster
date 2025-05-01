import React from 'react';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import { Shield, Lock, Eye, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Information We Collect',
      icon: <Eye size={24} />,
      content: [
        'Personal information (name, email, company details)',
        'Website URLs and scan results',
        'Payment information for premium services',
        'Usage data and analytics',
        'Cookies and similar tracking technologies',
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: <Globe size={24} />,
      content: [
        'To provide and improve our services',
        'To process payments and manage subscriptions',
        'To send important updates and notifications',
        'To analyze usage patterns and improve our platform',
        'To comply with legal obligations',
      ],
    },
    {
      title: 'Data Security',
      icon: <Lock size={24} />,
      content: [
        'Industry-standard encryption for data transmission',
        'Secure storage of sensitive information',
        'Regular security audits and updates',
        'Access controls and authentication measures',
        'Data backup and recovery procedures',
      ],
    },
    {
      title: 'Your Rights',
      icon: <Shield size={24} />,
      content: [
        'Access your personal data',
        'Request correction of inaccurate data',
        'Request deletion of your data',
        'Opt-out of marketing communications',
        'Export your data in a portable format',
      ],
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 10%)`,
          color: 'white',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="h5" align="center">
            Your privacy is our top priority
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            At BugBuster, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our website and services.
          </Typography>
          <Typography variant="body1" paragraph>
            Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge
            that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </Typography>
        </Box>

        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ color: 'primary.main', mr: 2 }}>{section.icon}</Box>
              <Typography variant="h4">{section.title}</Typography>
            </Box>
            <List>
              {section.content.map((item, itemIndex) => (
                <ListItem key={itemIndex}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
            {index < sections.length - 1 && <Divider sx={{ my: 4 }} />}
          </Box>
        ))}

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@bugbuster.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Bug Street, Debug City, 12345
          </Typography>
        </Box>

        <Box>
          <Typography variant="h4" gutterBottom>
            Updates to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Typography>
          <Typography variant="body1">
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;