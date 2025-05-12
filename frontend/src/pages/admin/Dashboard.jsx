import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { arrayToDateTime } from '../../utils';

const StatCard = ({ title, value, subtitle, onClick }) => (
  <Card 
    sx={{ 
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': { 
        boxShadow: onClick ? 6 : 1,
        transform: onClick ? 'translateY(-4px)' : 'none',
        transition: 'all 0.2s ease-in-out'
      },
      border: onClick ? '1px solid #e0e0e0' : 'none',
      position: 'relative',
      '&::after': onClick ? {
        content: '"Click for details"',
        position: 'absolute',
        bottom: 8,
        right: 8,
        fontSize: '0.75rem',
        color: 'text.secondary'
      } : {}
    }} 
    onClick={onClick}
  >
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      <Typography color="textSecondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const DetailModal = ({ open, onClose, title, children }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="detail-modal"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box sx={{
      bgcolor: 'background.paper',
      borderRadius: 1,
      boxShadow: 24,
      p: 4,
      maxWidth: 800,
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative',
    }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  </Modal>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    dailyBugs: 0,
    weeklyBugs: 0,
    monthlyBugs: 0,
    avgBugsPerScan: 0,
    premiumUsers: 0,
    totalUsers: 0,
    totalBugs: 0,
    activeUsers: [],
    usersNearLimit: [],
    newUsers: [],
    scanTypes: { full: 0, quick: 0 },
    recentScans: [],
    commonBugs: [],
    topUrls: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/api/admin/allUsers');
        const users = usersResponse.data;
        
        let totalBugs = 0;
        let dailyBugs = 0;
        let weeklyBugs = 0;
        let monthlyBugs = 0;
        let totalScans = 0;
        let premiumUsers = 0;
        let userScanCounts = {};
        let usersNearLimit = [];
        let newUsers = [];
        let scanTypes = { full: 0, quick: 0 };
        let recentScans = [];
        let bugTypes = {};
        let urlScans = {};

        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        for (const user of users) {
          if (user.isPremium) premiumUsers++;
          
          const userJoinDate = new Date(user.joinDate);
          if (userJoinDate >= oneMonthAgo) {
            newUsers.push({
              ...user,
              joinDate: arrayToDateTime(user.joinDate)
            });
          }

          if (user.scanLimit - user.scansRemaining <= 2) {
            usersNearLimit.push({
              ...user,
              username: user.username,
              scansRemaining: user.scansRemaining
            });
          }

          try {
            const bugReportsResponse = await axios.get(`http://localhost:8080/api/admin/getBugReportById/${user.userId}`);
            const bugReports = bugReportsResponse.data;

            userScanCounts[user.userId] = {
              count: bugReports.length,
              username: user.username
            };

            bugReports.forEach(report => {
              const [year, month, day, hour, minute, second] = report.timestamp;
              const reportDate = new Date(year, month - 1, day, hour, minute, second);
              const bugs = report.totalBugs || 0;

              totalBugs += bugs;
              totalScans++;

              // Track scan types - count full_scan as full scan and everything else as quick scan
              if (report.scanType === 'FULL_SCAN') {
                scanTypes.full++;
              } else {
                scanTypes.quick++;
              }

              if (reportDate >= oneWeekAgo) {
                recentScans.push({
                  ...report,
                  username: user.username,
                  date: arrayToDateTime(report.timestamp)
                });
              }

              if (report.bugTypes) {
                Object.entries(report.bugTypes).forEach(([type, count]) => {
                  bugTypes[type] = (bugTypes[type] || 0) + count;
                });
              }

              urlScans[report.url] = (urlScans[report.url] || 0) + 1;

              if (reportDate >= oneDayAgo) dailyBugs += bugs;
              if (reportDate >= oneWeekAgo) weeklyBugs += bugs;
              if (reportDate >= oneMonthAgo) monthlyBugs += bugs;
            });
          } catch (error) {
            console.error(`Error fetching bug reports for user ${user.userId}:`, error);
          }
        }

        // Sort and get top 5 active users with username
        const activeUsers = Object.entries(userScanCounts)
          .map(([userId, data]) => ({
            userId,
            username: data.username,
            scanCount: data.count
          }))
          .sort((a, b) => b.scanCount - a.scanCount)
          .slice(0, 5);

        // Sort and get top 5 most common bug types
        const commonBugs = Object.entries(bugTypes)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Sort and get top 5 most scanned URLs
        const topUrls = Object.entries(urlScans)
          .map(([url, count]) => ({ url, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Sort recent scans by date
        recentScans.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Store total scans and bugs in localStorage for About page
        localStorage.setItem('totalScans', totalScans);
        localStorage.setItem('totalBugs', totalBugs);

        setStats({
          dailyBugs,
          weeklyBugs,
          monthlyBugs,
          avgBugsPerScan: totalScans > 0 ? (totalBugs / totalScans).toFixed(2) : 0,
          premiumUsers,
          totalUsers: users.length,
          totalBugs,
          activeUsers,
          usersNearLimit,
          newUsers,
          scanTypes,
          recentScans,
          commonBugs,
          topUrls,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderModalContent = () => {
    switch (selectedModal) {
      case 'activeUsers':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Scan Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.activeUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.scanCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'usersNearLimit':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Scans Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.usersNearLimit.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.scansRemaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'newUsers':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Join Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.newUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'scanTypes':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Scan Type</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Full Scan</TableCell>
                  <TableCell>{stats.scanTypes.full}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Quick Scan</TableCell>
                  <TableCell>{stats.scanTypes.quick}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'recentScans':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Scan Type</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentScans.map((scan, index) => (
                  <TableRow key={index}>
                    <TableCell>{scan.username}</TableCell>
                    <TableCell>{scan.url}</TableCell>
                    <TableCell>{scan.scanType}</TableCell>
                    <TableCell>{scan.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'commonBugs':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bug Type</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.commonBugs.map((bug) => (
                  <TableRow key={bug.type}>
                    <TableCell>{bug.type}</TableCell>
                    <TableCell>{bug.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 'topUrls':
        return (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Scan Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.topUrls.map((url) => (
                  <TableRow key={url.url}>
                    <TableCell>{url.url}</TableCell>
                    <TableCell>{url.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={6} mt={2}>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Daily Bugs"
            value={stats.dailyBugs}
            subtitle="Bugs found today"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Weekly Bugs"
            value={stats.weeklyBugs}
            subtitle="Bugs found this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Monthly Bugs"
            value={stats.monthlyBugs}
            subtitle="Bugs found this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Avg Bugs/Scan"
            value={stats.avgBugsPerScan}
            subtitle="Average bugs per scan"
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={6} width={300}>
          <StatCard
            title="Premium Users"
            value={stats.premiumUsers}
            subtitle="Total premium users"
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={6} width={300}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All registered users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} width={300}>
          <StatCard
            title="Total Bugs"
            value={stats.totalBugs}
            subtitle="All time bugs found"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Top Active Users"
            value={stats.activeUsers.length}
            subtitle="Most active users"
            onClick={() => setSelectedModal('activeUsers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} width={300}>
          <StatCard
            title="Recent Scans"
            value={stats.recentScans.length}
            subtitle="Last 7 days"
            onClick={() => setSelectedModal('recentScans')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} width={300}>
          <StatCard
            title="Top URLs"
            value={stats.topUrls.length}
            subtitle="Most scanned URLs"
            onClick={() => setSelectedModal('topUrls')}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="New Users"
            value={stats.newUsers.length}
            subtitle="New users this month"
            onClick={() => setSelectedModal('newUsers')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5} width={300}>
          <StatCard
            title="Scan Types"
            value={`${stats.scanTypes.full + stats.scanTypes.quick}`}
            subtitle={`Full: ${stats.scanTypes.full} | Quick: ${stats.scanTypes.quick}`}
            onClick={() => setSelectedModal('scanTypes')}
          />
        </Grid>
        
      </Grid>

      <DetailModal
        open={selectedModal !== null}
        onClose={() => setSelectedModal(null)}
        title={
          selectedModal === 'activeUsers' ? 'Top 5 Most Active Users' :
          selectedModal === 'usersNearLimit' ? 'Users Nearing Scan Limit' :
          selectedModal === 'newUsers' ? 'New Users This Month' :
          selectedModal === 'scanTypes' ? 'Full Scan vs Quick Scan Count' :
          selectedModal === 'recentScans' ? 'Recent Scans Timeline' :
          selectedModal === 'commonBugs' ? 'Most Common Bug Types' :
          selectedModal === 'topUrls' ? 'Most Scanned URLs' : ''
        }
      >
        {renderModalContent()}
      </DetailModal>
    </Box>
  );
};

export default Dashboard; 