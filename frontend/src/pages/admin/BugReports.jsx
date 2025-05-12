import { useState } from 'react';
import { arrayToDateTime } from '../../utils';



import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import axios from 'axios';

const BugReports = () => {
  const [userId, setUserId] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSearch = async () => {
    if (!userId.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/getBugReportById/${userId}`);

      if (response && response.data.length > 0) {
        setUserInfo({
          username: response.data[0].username,
          email: response.data[0].email
        });

        setReports(response.data);
      }
    } catch (error) {
      console.error('Error fetching bug reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bug Reports
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !userId.trim()}
        >
          Search
        </Button>

        {userInfo?.username && (
          <Typography variant="body1" sx={{ ml: '300px', mr:'30px'}}>
            <strong>Username:</strong> {userInfo.username}
          </Typography>
        )}
        {userInfo?.email && (
          <Typography variant="body1">
            <strong>Email:</strong> {userInfo.email}
          </Typography>
        )}
      </Box>



      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : reports.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>Total Bugs</TableCell>
                <TableCell>Scan Type</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{report.url}</TableCell>
                    <TableCell>{report.totalBugs}</TableCell>
                    <TableCell>{report.scanType}</TableCell>
                    <TableCell>
                      {arrayToDateTime(report.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reports.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          {userId ? 'No reports found for this user' : 'Enter a user ID to search for bug reports'}
        </Typography>
      )}
    </Box>
  );
};

export default BugReports; 