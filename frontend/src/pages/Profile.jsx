import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Grid,
  Badge,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Margin, Refresh as RefreshIcon, Upgrade as UpgradeIcon } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { arrayToDateTime } from '../utils';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({user:{
    username: '',
    email: '',
    isPremium: false,
    scansUsed: 0,
    scanLimit: 0
  },history:[]},
  
);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      navigate('/login');
      return;
    }
    

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileData = await  axios.get(`http://localhost:8080/api/user/profile`, { params: { email: userEmail } });
        setProfile(profileData.data.data);
        console.log(profileData)
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load profile data. Please try again.',
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

  const refreshData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    setIsLoading(true);
    try {
      const profileData = await axios.get(`http://localhost:8080/api/user/profile`, { params: { email: userEmail } });
      
      setProfile(profileData.data.data);

      Swal.fire({
        icon: 'success',
        title: 'Data refreshed',
        text: 'Your profile data has been updated.',
        position: 'bottom-end',
        width: '400px',
        height: '300px',
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Refresh failed',
        text: 'Failed to refresh your data. Please try again.',
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Profile Information"
              subheader="Your account details and scan limits"
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                <Typography variant="body1">{profile?.user.username}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{profile?.user.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                <Typography variant="body1">
                  {profile.isPremium ? "Premium" : "Free"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Scan Limit</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">
                    {profile.user.scanLimit} / 10  scans used
                  </Typography>
                  {/* {!profile.isPremium && profile.user.scansUsed >= profile.scanLimit && (
                  )} */}
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
              {!profile.isPremium && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  onClick={() => navigate('/payment')}
                >
                  Upgrade to Premium
                </Button>
              )}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshData}
              >
                Refresh Data
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Scan History"
              subheader="Your recent website scans"
            />
            <CardContent>
              {profile.history.length === 0 ? (
                <Typography align="center" color="text.secondary">
                  No scan history found
                </Typography>
              ) : (
                <Box sx={{ overflowX: 'auto'}}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '10px' }}>ID</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>URL</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Scan Type</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Bugs</th>
                        <th style={{ textAlign: 'right', padding: '10px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.history.map((scan) => (
                        <tr key={scan.historyID}>
                          <td style={{ padding: '10px' }}>{scan.historyID}</td>
                          <td style={{ padding: '10px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {scan.urlScanned}
                          </td>
                          <td style={{ padding: '10px' }}>
                             {scan.scanType}  
                          </td>
                          <td style={{ padding: '10px' }}>
                            {arrayToDateTime(scan?.timestamp)}
                          </td>
                          <td style={{ padding: '10px' }}>{scan.bugFoundCount}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/report/${scan.historyID}`)}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;