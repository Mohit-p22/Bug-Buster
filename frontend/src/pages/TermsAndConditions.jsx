import React from 'react';
import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import { ChevronDown, FileText, Shield, AlertTriangle, Scale } from 'lucide-react';

const TermsAndConditions = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <FileText size={24} />,
      content: `By accessing and using BugBuster's website and services, you acknowledge that you have read,
        understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part
        of these terms, you may not use our services.`,
    },
    {
      title: 'Service Description',
      icon: <Shield size={24} />,
      content: `BugBuster provides website bug detection and analysis services. Our platform scans websites
        for various types of bugs, including but not limited to form issues, layout problems, security
        vulnerabilities, and performance issues. The service is provided "as is" and we make no warranties
        about the completeness or accuracy of the results.`,
    },
    {
      title: 'User Responsibilities',
      icon: <AlertTriangle size={24} />,
      content: `Users are responsible for:
        • Providing accurate information when using our services
        • Maintaining the security of their account credentials
        • Ensuring they have the right to scan the websites they submit
        • Using our services in compliance with applicable laws and regulations
        • Not attempting to breach or test our security measures
        • Not using our services to harm others or for malicious purposes`,
    },
    {
      title: 'Subscription and Payments',
      icon: <Scale size={24} />,
      content: `• Subscription fees are charged according to the plan selected
        • All payments are non-refundable unless required by law
        • We reserve the right to modify pricing with notice
        • Users may cancel their subscription at any time
        • Cancelled subscriptions will remain active until the end of the current billing period`,
    },
    {
      title: 'Intellectual Property',
      icon: <FileText size={24} />,
      content: `All content, features, and functionality of our services, including but not limited to text,
        graphics, logos, and software, are the exclusive property of BugBuster and are protected by
        international copyright, trademark, and other intellectual property laws.`,
    },
    {
      title: 'Limitation of Liability',
      icon: <Shield size={24} />,
      content: `BugBuster shall not be liable for any indirect, incidental, special, consequential, or
        punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
        intangible losses, resulting from your access to or use of or inability to access or use the services.`,
    },
    {
      title: 'Termination',
      icon: <AlertTriangle size={24} />,
      content: `We reserve the right to terminate or suspend access to our services immediately, without
        prior notice or liability, for any reason whatsoever, including without limitation if you breach
        these Terms and Conditions.`,
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 10%)`,
          color: 'black',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="h5" align="center">
            Please read these terms carefully before using our services
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to BugBuster. These Terms and Conditions outline the rules and regulations
            for the use of our website and services.
          </Typography>
        </Box>

        {sections.map((section, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ChevronDown />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              <Box sx={{ color: 'primary.main', mr: 2 }}>{section.icon}</Box>
              <Typography variant="h6">{section.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {section.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms and Conditions, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: legal@bugbuster.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Bug Street, Debug City, 12345
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
