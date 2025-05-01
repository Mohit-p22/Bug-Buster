import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
  Alert,
} from '@mui/material';
import { 
  FormInput, 
  LayoutGrid, 
  Shield, 
  Wifi, 
  Link as LinkIcon,
  ArrowRight,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import ScanResultModal from '../components/ScanResultModal';
import BugDetailsModal from '../components/BugDetailsModal';

const Services = () => {
  const theme = useTheme();
  const [currentTitle, setCurrentTitle] = useState('');
  const [urls, setUrls] = useState({
    form: '',
    layout: '',
    security: '',
    network: '',
    link: '',
  });
  const [selectedTypes, setSelectedTypes] = useState({
    form: 'all',
    layout: 'all',
    security: 'all',
    network: 'all',
    link: 'all',
  });
  const [isScanning, setIsScanning] = useState({
    form: false,
    layout: false,
    security: false,
    network: false,
    link: false,
  });
  const [scanResults, setScanResults] = useState({
    form: null,
    layout: null,
    security: null,
    network: null,
    link: null,
  });
  const [errors, setErrors] = useState({
    form: '',
    layout: '',
    security: '',
    network: '',
    link: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [currentType, setCurrentType] = useState('');

  const handleUrlChange = (type, value) => {
    setUrls(prev => ({ ...prev, [type]: value }));
    setErrors(prev => ({ ...prev, [type]: '' }));
  };

  const handleTypeChange = (type, value) => {
    setSelectedTypes(prev => ({ ...prev, [type]: value }));
  };

  const handleScan = async (type) => {
    const url = urls[type];
    
    if (!url) {
      setErrors(prev => ({ ...prev, [type]: 'Please enter a website URL' }));
      return;
    }

    try {
      setIsScanning(prev => ({ ...prev, [type]: true }));
      setScanResults(prev => ({ ...prev, [type]: null }));
      let userEmail = localStorage.getItem('userEmail');
      const response = await axios.post(`http://localhost:8080/api/scan/${type}`, {
        url,
        email:userEmail
      });

      setScanResults(prev => ({ ...prev, [type]: response.data }));
      let curObj = Object.keys(response.data).find(key => key.toLowerCase().startsWith(type));
      console.log(response.data[curObj])
      setCurrentResult(response.data[curObj]);
      setCurrentType(type);
      setCurrentTitle(scanCards.filter((e)=>e.type===type)[0].title);
      setOpenModal(true);
    } catch (error) {
      setErrors(prev => ({ ...prev, [type]: error.response?.data?.message || 'Scan failed' }));
    } finally {
      setIsScanning(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentResult(null);
    setCurrentType('');
  };

  const scanCards = [
    {
      type: 'form',
      title: 'Form Testing',
      icon: <FormInput />,
      description: 'Detect validation issues, accessibility , and usability bugs in your forms n..',
      options: ['all', 'validation', 'accessibility', 'usability']
    },

    {
      type: 'security',
      title: 'Security Testing',
      icon: <Shield />,
      description: 'Identify security vulnerabilities, insecure forms, and missing HTTPS.',
      options: ['all', 'xss', 'forms', 'https']
    },
        {
      type: 'layout',
      title: 'Layout Testing',
      icon: <LayoutGrid />,
      description: 'Find responsive design issues, overflow problems, and visual layout bugs.',
      options: ['all', 'responsive', 'overflow', 'alignment']
    },
    {
      type: 'network',
      title: 'Network Testing',
      icon: <Wifi />,
      description: 'Detect slow loading resources, render-blocking scripts, and large nd',
      options: ['all', 'loading', 'resources', 'scripts']
    },
    {
      type: 'link',
      title: 'Link Testing',
      icon: <LinkIcon />,
      description: 'Find broken links, redirect issues, and navigation problems and more.',
      options: ['all', 'broken', 'redirects', 'navigation']
    }
  ];
 return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Specialized Bug Detection Services
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose a specific area to scan or run a comprehensive check on your website
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {scanCards.map((card) => (
          <Grid item xs={12} md={20} lg={4} key={card.type}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent:'space-evenly' }}>
              <CardHeader
                avatar={
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                    }}
                  >
                    {card.icon}
                  </Box>
                }
                title={card.title}
                subheader={card.description}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Website URL"
                    value={urls[card.type]}
                    onChange={(e) => handleUrlChange(card.type, e.target.value)}
                    error={!!errors[card.type]}
                    helperText={errors[card.type]}
                    disabled={isScanning[card.type]}
                  />
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Test Type</InputLabel>
                  <Select
                    value={selectedTypes[card.type]}
                    onChange={(e) => handleTypeChange(card.type, e.target.value)}
                    label="Test Type"
                    disabled={isScanning[card.type]}
                  >
                    {card.options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {scanResults[card.type] && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Scan completed successfully!
                  </Alert>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleScan(card.type)}
                  disabled={isScanning[card.type]}
                  endIcon={isScanning[card.type] ? <CircularProgress size={20} /> : <ArrowRight />}
                >
                  {isScanning[card.type] ? 'Scanning...' : 'Start Scan'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* <ScanResultModal
        open={openModal}
        onClose={handleCloseModal}
        result={currentResult}
        type={currentType}
      /> */}
      <BugDetailsModal open={openModal} onClose={handleCloseModal} bugs={{content:currentResult}} title={currentTitle}/>
    </Container>
  );
};

export default Services;