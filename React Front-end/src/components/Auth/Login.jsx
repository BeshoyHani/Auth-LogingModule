import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link, Grid, Box, Container, Typography, Avatar, Button, CssBaseline, TextField, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../Common/Copyright';
import Alert from '../Common/Alert'
import { loginRequest } from './AuthAPI';
import ExternalLogin from './ExternalLogin';

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
          <Avatar
            src="data:image/png;base64,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"
            sx={{ m: 1, width: 56, height: 56  }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <ExternalLogin />

          <Typography component="h4" variant="p">
            or
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