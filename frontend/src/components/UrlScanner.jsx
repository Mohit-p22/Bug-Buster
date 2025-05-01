import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Bug, ArrowRight } from 'lucide-react';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showViewReport, setShowViewReport] = useState(false);
  const [reportId, setReportId] = useState(null);
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!url) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a URL to scan',
        background: '#121212',
        color: '#ffffff',
        confirmButtonColor: '#ffffff',
      });
      return;
    }

    setIsScanning(true);
    setShowViewReport(false);
    try {
      const email = localStorage.getItem("userEmail");
      const response = await axios.post('http://localhost:8080/api/scan/full', { url, email });
      console.log(response.data);
      if (response.data) {
        setIsScanning(false);
        setShowViewReport(true);
        setReportId(response.data.report.reportId);
        Swal.fire({
          icon: 'success',
          title: 'Scan Complete',
          text: 'The scan has been completed successfully!',
          background: '#121212',
          color: '#ffffff',
          confirmButtonColor: '#ffffff',
          position: 'bottom-end',
          width: '400px',
          height: '300px',
          toast: true,
          timer: 3000,
        });
      }
    } catch (error) {
      setIsScanning(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Scan failed. Please try again.',
        background: '#121212',
        color: '#ffffff',
        confirmButtonColor: '#ffffff',
        position: 'bottom-end',
        width: '400px',
        height: '300px',
        toast: true,
        timer: 3000,
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Enter website URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleScan}
          disabled={isScanning}
          startIcon={isScanning ? <CircularProgress size={20} color="inherit" /> : <Bug />}
          endIcon={!isScanning && <ArrowRight />}
          sx={{
            minWidth: 200,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {isScanning ? 'Scanning...' : 'Start Scan'}
        </Button>
      </Box>
      {isScanning && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              }
            }} 
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ mt: 1 }}
          >
            Scanning website for bugs and vulnerabilities...
          </Typography>
        </Box>
      )}
      {showViewReport && (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            navigate(`/view-report/${reportId}`);
          }}
          sx={{
            mt: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'primary.dark',
              color: 'white',
            },
          }}
        >
          View Report
        </Button>
      )}
    </Box>
  );
};

export default UrlScanner; 