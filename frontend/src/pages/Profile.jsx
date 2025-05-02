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
                    {( 10 - profile.user.scanLimit)} / 10  scans remain
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
                <Box sx={{ 
                  overflowX: 'auto',
                  overflowY: 'auto',
                  maxHeight: '600px',
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
                }}>
                  <table style={{ 
                    width: '770px ', 
                    borderCollapse: 'collapse',
                  }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', color:'black',zIndex: 50 }}>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '40%' }}>URL</th>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '15%' }}>Scan Type</th>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '20%' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', width: '10%' }}>Bugs</th>
                        {/* <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #eee', width: '15%' }}>Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {profile.history.map((scan) => (
                        <tr key={scan.historyID} style={{ 
                          '&:hover': {
                            backgroundColor: '#f5f5f5'
                          }
                        }}>
                          <td style={{ 
                            padding: '12px', 
                            maxWidth: '400px',
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            borderBottom: '1px solid #eee'
                          }}>
                            {scan.urlScanned}
                          </td>
                          <td style={{ padding: '12px',paddingLeft:'50px', borderBottom: '1px solid #eee' }}>
                            <Badge
                              color="primary"
                              badgeContent={scan.scanType || 'UNKNOWN'}
                            />
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                            {arrayToDateTime(scan?.timestamp)}
                          </td>
                          <td style={{ padding: '12px',paddingLeft:'20px', borderBottom: '1px solid #eee' }}>{scan.bugFoundCount}</td>
                          {/* <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee', }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/report/${scan.historyID}`)}
                            >
                              View Report
                            </Button>
                          </td> */}
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