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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Alert from '../Common/Alert';
import { resetPasswordConfirm } from './AuthAPI';


const defaultTheme = createTheme();

export default function ResetPassword() {

  const [userData, setUserData] = useState({
    password: '',
    re_password: ''
  });

  const [fieldsStatus, setFieldsStatus] = useState({
    password: false,
    re_password: false
  });

  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = validateInput(userData);
      if (data === null) {
        return;
      }
      const res = await resetPasswordConfirm({
        token: searchParams.get('token'),
        userId: searchParams.get('id'),
        password: data.password
      });
      navigate('/login');
      console.log(res);

    } catch (error) {
      console.log(error.message);
      setMsg(error.message);
      setOpen(true);
    }
  };

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
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <TextField
                  required
                  error={fieldsStatus.re_password}
                  value={userData.re_password}
                  onChange={handleInputChange}
                  fullWidth
                  name="re_password"
                  label="Confirm Password"
                  type="password"
                  id="re-password"
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
            >
              Reset
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}