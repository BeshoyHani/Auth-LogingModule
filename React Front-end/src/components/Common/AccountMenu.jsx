import * as React from 'react';
import { Box, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, Badge, Avatar } from '@mui/material';
import {Logout, Login as LoginIcon, AppRegistration as AppRegistrationIcon} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function AccountMenu({ userType, logout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [badge, setBadge] = React.useState(0);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setBadge(0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', mx: 3 }}>
        <Tooltip title="Account settings">
          <Badge badgeContent={badge} color="secondary">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 50, height: 50 }}>B</Avatar>
            </IconButton>
          </Badge>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {
          !localStorage.getItem('access_token') &&
          <Link className='link-text' to='/login'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          </Link>
        }

        {
          !localStorage.getItem('access_token') &&
          <Link className='link-text' to='/signup'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AppRegistrationIcon fontSize="small" />
              </ListItemIcon>
              Signup
            </MenuItem>
          </Link>
        }

        {
          localStorage.getItem('access_token') &&
          <Link className='link-text' to='/profile'>
            <MenuItem onClick={handleClose}>
              <Avatar /> Profile
            </MenuItem>
          </Link>
        }

        <Divider />
        {
          localStorage.getItem('access_token') &&
          <Link className='link-text' onClick={() => logout()}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Link>
        }

      </Menu>
    </React.Fragment>
  );
}
