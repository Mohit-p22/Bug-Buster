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
} from '@mui/material';

const BugDetailsModal = ({ open, onClose, bugs, title }) => {

  console.log(bugs, " and ", title)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
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