import { Box, Button } from '@mui/material';
import { GitHub as GitHubIcon, Google as GoogleIcon } from '@mui/icons-material';

const API_URL = 'http://localhost:4000/auth';

export default function ExternalLogin() {

    const google = () => {
        window.open(`${API_URL}/google`, "_self");
    }

    const github = () => {
        window.open(`${API_URL}/github`, "_self");
    };

    return (

        <Box sx={{ my: 3 }}>
            <Button variant="contained" startIcon={<GitHubIcon />}
                onClick={github}
                style={{
                    backgroundColor: 'black',
                    textTransform: "none",
                    margin: '5px'
                }}>
                GitHub
            </Button>

            <Button variant="contained" startIcon={<GoogleIcon />}
                onClick={google}
                style={{
                    backgroundColor: 'red',
                    textTransform: "none",
                    margin: '5px'
                }}>
                Google
            </Button>
        </Box>
    );
} 