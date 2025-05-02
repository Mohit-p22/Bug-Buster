import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Download } from '@mui/icons-material';

const BugDetailsModal = ({ open, onClose, bugs, title }) => {
  const handleDownload = () => {
    if (!bugs?.content) return;

    // Prepare the data for Excel
    const headers = ['ID', 'Element', 'Description', 'Severity'];
    const data = bugs.content.map(bug => {
      let bugObj = {};
      const idKey = Object.keys(bug).find(key => key.toLowerCase().endsWith("id"));
      if (idKey) {
        bugObj = { id: bug[idKey], ...bug };
      }
      return [
        bugObj.id,
        bugObj.elementType,
        bugObj.description,
        bugObj.severityLevel
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-bugs.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  console.log(bugs, " and ", title)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <Tooltip title="Download as Excel">
            <IconButton onClick={handleDownload} color="primary">
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!bugs ? (
          <Typography>No bugs found</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Element</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bugs?.content?.map((bug) => {
                  let bugObj = {};
                  const idKey = Object.keys(bug).find(key => key.toLowerCase().endsWith("id"));
                  if (idKey) {
                    bugObj = { id: bug[idKey], ...bug };
                  }

                  return <TableRow key={bugObj.id}>
                    <TableCell>{bugObj.id}</TableCell>
                    <TableCell>{bugObj.elementType}</TableCell>
                    <TableCell>{bugObj.description}</TableCell>
                    <TableCell>{bugObj.severityLevel}</TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BugDetailsModal; 