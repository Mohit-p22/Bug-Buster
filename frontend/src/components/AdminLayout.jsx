import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  styled,
} from '@mui/material';
import { Logout } from '@mui/icons-material';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 2rem',
}));

const AdminLayout = ({ children, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <StyledToolbar>
          <Typography variant="h6" component="div">
            BugBuster Admin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => handleSectionChange('dashboard')}
              sx={{
                backgroundColor: activeSection === 'dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => handleSectionChange('user-details')}
              sx={{
                backgroundColor: activeSection === 'user-details' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              User Details
            </Button>
            <Button
              color="inherit"
              onClick={() => handleSectionChange('bug-reports')}
              sx={{
                backgroundColor: activeSection === 'bug-reports' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Bug Reports
            </Button>
          </Box>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </StyledToolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AdminLayout; 