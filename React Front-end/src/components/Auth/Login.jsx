import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../Common/Copyright';
import { useNavigate } from 'react-router';
import Alert from '../Common/Alert';
import { loginRequest } from './AuthAPI';

const defaultTheme = createTheme();

export default function Login() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [fieldsStatus, setFieldsStatus] = useState({
    email: false,
    password: false,
  });

  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = validateInput(userData);
      if (data === null) {
        return;
      }
      const res = await loginRequest(data);
      navigate('/');
      console.log(res);
    } catch (error) {
      console.log(error.message);
      setMsg(error.message);
      setOpen(true);
    }
  };

  const validateInput = () => {
    const obj = { ...userData };
    const objStatus = { ...fieldsStatus };
    let validationStatus = true;

    for (const key in userData) {
      obj[key] = userData[key].trim();
      if (obj[key] === '') {
        objStatus[key] = true;
        validationStatus = false;
      }
    }
    setFieldsStatus(objStatus);
    return validationStatus ? obj : null;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value
    });

    setFieldsStatus({
      ...fieldsStatus,
      [name]: value === ''
    });
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{
        float: 'left',
        m: 2
      }}>
        <Alert message={msg} open={open} setOpen={setOpen} />
      </Box>
      <Container component="main" maxWidth="xs" style={{ borderWidth: '5px' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '50px',
            borderRadius: '5%',
            boxShadow: '1px 2px grey',
            border: '1px solid grey'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsStatus.email}
                  value={userData.email}
                  onChange={handleInputChange}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsStatus.password}
                  value={userData.password}
                  onChange={handleInputChange}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href='/requestResetPassword' variant="body2">
                  Forgot Password ?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}