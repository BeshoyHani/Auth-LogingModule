import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './../Common/Copyright';
import { useState } from 'react';
import { signupRequest } from './AuthAPI';
import { useNavigate } from 'react-router';
import Alert from '../Common/Alert';
import { Link } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignUp() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    re_password: ''
  });

  const [fieldsStatus, setFieldsStatus] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    re_password: false
  });

  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const allData = validateInput(userData);
      if (allData === null) {
        return;
      }
      const {re_password, ...data} = allData;
      const res = await signupRequest(data);
      navigate('/login');
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
    if (validationStatus && obj.password !== obj.re_password) {
      console.log(obj.password, obj.re_password)
      setMsg('Password doesn\'t not match');
      setOpen(true);
      validationStatus = false;
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
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  required
                  error={fieldsStatus.firstName}
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  error={fieldsStatus.lastName}
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type='email'
                  required
                  error={fieldsStatus.email}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsStatus.password}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsStatus.re_password}
                  fullWidth
                  name="re_password"
                  label="Confirm Password"
                  type="password"
                  id="re-password"
                  value={userData.re_password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  variant="standard"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body1">
                  Already have an account? Sign in
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