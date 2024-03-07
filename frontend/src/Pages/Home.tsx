import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const MainPage = () => {
    const navigate = useNavigate();
    
    return (
      <div className="Main">
        <h1>Theme Park Management</h1>
        <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
  
        <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
      </div>
    );
  };

export default MainPage;