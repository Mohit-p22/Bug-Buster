import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Badge,
  CircularProgress,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    isPremium: false,
    scansUsed: 0,
    scanLimit: 10  // Default limit
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileData, historyData] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/profile`, { params: { email: userEmail } }),
          axios.get(`http://localhost:8080/api/user/history`, { params: { email: userEmail } })
        ]);
        
        // Ensure profile data has all required fields
        setProfile({
          username: profileData.data?.username || 'User',
          email: profileData.data?.email || userEmail,
          isPremium: profileData.data?.isPremium || false,
          scansUsed: profileData.data?.scansUsed || 0,
          scanLimit: profileData.data?.scanLimit || 10
        });

        // Ensure history data is an array
        setHistory(Array.isArray(historyData.data) ? historyData.data : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load dashboard data. Please try again.',
          position: 'bottom-end',
          width: '400px',
          height: '300px',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        setHistory([]);  // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const totalBugs = Array.isArray(history) ? history.reduce((acc, scan) => acc + (scan?.bugCount || 0), 0) : 0;
  const averageBugsPerScan = Array.isArray(history) && history.length > 0 
    ? Math.round((totalBugs / history.length) * 10) / 10 
    : 0;

  // Safe calculation of scan limit percentage
  const scanLimitPercentage = profile.scanLimit > 0 
    ? Math.min(Math.round((profile.scansUsed / profile.scanLimit) * 100), 100)
    : 0;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {profile.username}. Here's an overview of your bug detection activity.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}  // Changed to home page where scanner is
        >
          New Scan
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Total Scans"
              subheader={history.length > 0 ? `Last scan ${formatDate(history[0]?.createdAt)}` : "No scans yet"}
            />
            <CardContent>
              <Typography variant="h3">{history.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Total Bugs Found"
              subheader="Across all scans"
            />
            <CardContent>
              <Typography variant="h3">{totalBugs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Average Bugs Per Scan"
              subheader="Based on your scan history"
            />
            <CardContent>
              <Typography variant="h3">{averageBugsPerScan}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Recent Scans" />
        <Tab label="Statistics" />
      </Tabs>

      {tabValue === 0 && (
        <Card>
          <CardHeader
            title="Recent Scan Activity"
            subheader="Your most recent website scans and their results"
          />
          <CardContent>
            {!Array.isArray(history) || history.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No scan history found
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px' }}>URL</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Bugs</th>
                      <th style={{ textAlign: 'right', padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((scan) => (
                      <tr key={scan?.id || Math.random()}>
                        <td style={{ padding: '8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {scan?.url || 'N/A'}
                        </td>
                        <td style={{ padding: '8px' }}>
                          {formatDate(scan?.createdAt)}
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Badge
                            color={
                              scan?.status === "COMPLETED"
                                ? "success"
                                : scan?.status === "FAILED"
                                  ? "error"
                                  : "warning"
                            }
                            badgeContent={scan?.status || 'UNKNOWN'}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>{scan?.bugCount || 0}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/view-report/${scan?.id}`)}
                            disabled={!scan?.id}
                          >
                            View Report
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Bug Types Distribution"
                subheader="Distribution of bugs by category"
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <PieChart sx={{ fontSize: 64, color: 'primary.main' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Bug Trends"
                subheader="Bug detection trends over time"
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <LineChart
                  xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7] }]}
                  series={[
                    {
                      data: [2, 5.5, 2, 8.5, 1.5, 5, 7],
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Severity Breakdown"
                subheader="Bugs by severity level"
              />
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <BarChart sx={{ fontSize: 64, color: 'primary.main' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card sx={{ mt: 4 }}>
        <CardHeader
          title="Scan Limit"
          subheader="Your current scan usage and limits"
        />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {profile.scansUsed} / {profile.scanLimit} scans used
              </Typography>
              <Typography variant="body2">
                {scanLimitPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={scanLimitPercentage}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          {!profile.isPremium && (
            <Button
              variant="contained"
              onClick={() => navigate('/payment')}
            >
              Upgrade to Premium
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
