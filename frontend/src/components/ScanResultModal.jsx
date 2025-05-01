import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
} from 'lucide-react';

const ScanResultModal = ({ open, onClose, result, type }) => {
  if (!result) return null;

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'success';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <XCircle color="red" />;
      case 'medium':
        return <AlertCircle color="orange" />;
      case 'low':
        return <Info color="blue" />;
      default:
        return <CheckCircle color="green" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getSeverityIcon(result.overallSeverity)}
          <Typography variant="h6">
            {type.charAt(0).toUpperCase() + type.slice(1)} Scan Results
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Scanned URL: {result.url}
          </Typography>
          <Chip
            label={`Overall Severity: ${result.overallSeverity}`}
            color={getSeverityColor(result.overallSeverity)}
            sx={{ mt: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Issues Found
        </Typography>
        <List>
          {result.issues?.map((issue, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemIcon>
                {getSeverityIcon(issue.severity)}
              </ListItemIcon>
              <ListItemText
                primary={issue.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {issue.description}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Location: {issue.location}
                    </Typography>
                  </>
                }
              />
              <Chip
                label={issue.severity}
                color={getSeverityColor(issue.severity)}
                size="small"
              />
            </ListItem>
          ))}
        </List>

        {result.recommendations && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <List>
              {result.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ArrowRight />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanResultModal; 