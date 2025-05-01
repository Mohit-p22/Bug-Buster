import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Share,
  BugReport,
  Security,
  Speed,
  Accessibility,
  Code,
  Search
} from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import BugDetailsModal from '../components/BugDetailsModal';
import { arrayToDateTime } from '../utils';

const ViewReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBugs, setCurrentBugs] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [bugCategories, setBugCategories] = useState({
    form: [],
    layout: [],
    security: [],
    link: [],
    network: [],
  });

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        showError('No report ID provided');
        navigate('/dashboard');
        return;
      }

      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        showError('Please login to view the report');
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/reports/${reportId}`);

        if (!response.data) {
          throw new Error('Report not found');
        }
        console.log(response)

        setReport(response.data.report);
        await fetchAllBugCategories();

        showSuccess('Report loaded successfully');
      } catch (error) {
        console.error('Error fetching report:', error);
        showError(error.response?.data?.message || 'Failed to load report');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId, navigate]);

  const fetchAllBugCategories = async () => {
    try {
      const categories = ['form-bugs', 'layout-bugs', 'security-bugs', 'link-bugs', 'network-bugs'];
      const promises = categories.map(category =>
        axios.get(`http://localhost:8080/api/reports/${reportId}/${category}`)
      );

      const results = await Promise.all(promises);
      const bugData = {};

      categories.forEach((category, index) => {
        bugData[category] = results[index].data || [];
      });

      setBugCategories(bugData);
    } catch (error) {
      console.error('Error fetching bug categories:', error);
      showError('Failed to load bug details');
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      position: 'bottom-end',
      width: '400px',
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      position: 'bottom-end',
      width: '400px',
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  };

  const handleOpenModal = (bugs, title) => {
    setCurrentBugs(bugs);
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess('Report URL copied to clipboard');
    } catch (error) {
      showError('Failed to copy URL');
    }
  };

  const handleDownload = async () => {
    try {
      // Get all the report data
      const reportData = {
        reportId,
        url: report?.url,
        timestamp: report?.timestamp,
        status: report?.status,
        bugCategories
      };

      // Create a Blob with the JSON data
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `bug-report-${reportId}.json`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      showError('Failed to download report');
    }
  };

  const getBugCategoryIcon = (category) => {
    switch (category) {
      case 'form-bugs':
        return <Code />;
      case 'layout-bugs':
        return <BugReport />;
      case 'security-bugs':
        return <Security />;
      case 'link-bugs':
        return <Accessibility />;
      case 'network-bugs':
        return <Speed />;

      default:
        return <BugReport />;
    }
  };

  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Scan Report
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              <strong>URL:</strong> {report?.url || 'N/A'}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Scanned on:</strong> {arrayToDateTime(report?.timestamp)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Status:</strong>
              <Chip
                label={report?.status || 'UNKNOWN'}
                color={report?.status === 'COMPLETED' ? 'success' : 'warning'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownload}>
                Download Report
              </Button>
              <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
                Share Report
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bug Categories Grid */}
      <Grid container spacing={3}>
        {Object.entries(bugCategories).map(([category, bugs]) => (
          <Grid item xs={12} md={6} lg={4} key={category}>
            <Card>
              <CardHeader
                avatar={getBugCategoryIcon(category)}
                title={category.charAt(0).toUpperCase() + category.slice(1) + ' Issues'}
                subheader={`${bugs.content.length} ${bugs.content.length === 1 ? 'issue' : 'issues'} found`}
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {bugs.content.length > 0
                    ? `Found ${bugs.content.length} issues related to ${category}`
                    : `No ${category} issues detected`
                  }
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenModal(bugs, `${category.charAt(0).toUpperCase() + category.slice(1)} Issues`)}
                  fullWidth
                  disabled={bugs.content.length === 0}
                  startIcon={getBugCategoryIcon(category)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bug Details Modal */}
      <BugDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        bugs={currentBugs}
        title={modalTitle}
      />
    </Container>
  );
};

export default ViewReport;
