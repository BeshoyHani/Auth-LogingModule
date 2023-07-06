import React, { Fragment, useState } from 'react';
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
import { resetPasswordRequest } from './AuthAPI';


const defaultTheme = createTheme();

export default function RequestResetPassword() {
  const [isSent, setSent] = useState(false);
  const [email, setEmail] = useState({ value: '', status: false });
  const [sentSuccessfully, setSentStatus] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email.value.trim() === '') {
      setEmail({
        ...email,
        status: true
      });
      return;
    }
    try {
      await resetPasswordRequest(email.value.trim());
      setSent(true);
    } catch (error) {
      console.log(error.message);
      setSentStatus(false);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setEmail({
      value: value,
      status: value === ''
    });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
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
            Forgot Password
          </Typography>
          {
            isSent === false ?
              <Fragment>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        error={email.status}
                        value={email.value}
                        onChange={handleInputChange}
                        fullWidth
                        name="email"
                        label="email"
                        type="email"
                        id="email"
                        autoComplete="email"
                        variant="standard"
                      />
                    </Grid>
                    {
                      sentSuccessfully === false &&
                      <Typography variant="subtitle1" gutterBottom sx={{ m: 2, color: 'red', textAlign: 'center', mx: 'auto' }}>
                        email doesn't exist
                      </Typography>
                    }
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Confirm
                  </Button>
                </Box>
              </Fragment>
              :
              <Typography variant="subtitle1" gutterBottom sx={{ m: 2, textAlign: 'center' }}>
                an email with instructions of how to reset password was sent to you.
              </Typography>
          }
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}