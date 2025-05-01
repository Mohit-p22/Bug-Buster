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
    user: {
      userId: null,
      username: '',
      email: '',
      scanLimit: 0,
    },
    history: []
  });

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
        const response = await axios.get(`http://localhost:8080/api/user/profile`, { params: { email: userEmail } });
        const { data } = response.data;
        console.log("detail", data);
        
        setProfile(data);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const totalBugs = Array.isArray(profile.history) 
    ? profile.history.reduce((acc, scan) => acc + (scan?.bugFoundCount || 0), 0) 
    : 0;

  const averageBugsPerScan = Array.isArray(profile.history) && profile.history.length > 0 
    ? Math.round((totalBugs / profile.history.length) * 10) / 10 
    : 0;

  const scanLimitPercentage = profile.user.scanLimit > 0 
    ?  ((10 - profile.user.scanLimit) * 10)
    : 0;

  const formatDate = (timestamp) => {
    if (!timestamp || !Array.isArray(timestamp)) return 'Invalid Date';
    try {
      const [year, month, day, hour, minute, second] = timestamp;
      return new Date(year, month - 1, day, hour, minute, second).toLocaleDateString();
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
          Welcome back, {profile.user.username}. Here's an overview of your bug detection activity.
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
              subheader={profile.history.length > 0 ? `Last scan ${formatDate(profile.history[0]?.timestamp)}` : "No scans yet"}
            />
            <CardContent>
              <Typography variant="h3">{profile.history.length}</Typography>
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
            {!Array.isArray(profile.history) || profile.history.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No scan history found
              </Typography>
            ) : (
              <Box 
                sx={{ 
                  overflowX: 'auto',
                  overflowY: 'auto',
                  maxHeight: '400px', // Fixed height for scrolling
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}
              >
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  minWidth: '800px', // Minimum width to ensure content visibility
                }}>
                  <thead style={{ position: 'sticky', top: 0,  background: 'white', color:'black',zIndex: 50  }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '35%' }}>URL</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '20%' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '15%' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '15%' }}>Bugs</th>
                      <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #eee', width: '15%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.history.map((scan) => (
                      <tr key={scan?.historyID || Math.random()} style={{ 
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}>
                        <td style={{ 
                          padding: '12px', 
                          maxWidth: '300px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid #eee'
                        }}>
                          {scan?.urlScanned || 'N/A'}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                          {formatDate(scan?.timestamp)}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                          <Badge
                            color="primary"
                            badgeContent={scan?.scanType || 'UNKNOWN'}
                          />
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{scan?.bugFoundCount || 0}</td>
                        <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/view-report/${scan?.historyID}`)}
                            disabled={!scan?.historyID}
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
              {( 10 - profile.user.scanLimit )} / 10 scans used
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
