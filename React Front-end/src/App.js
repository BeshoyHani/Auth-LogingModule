import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import NavBar from './components/Common/NavBar';
import { Fragment, useEffect } from 'react';
import SignUp from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ResetPassword from './components/Auth/ResetPassword';
import RequestResetPassword from './components/Auth/ResetPasswordRequest';
import { SignedinRoutesProtection, UnAuthRoutes } from './components/Protection/RouteProtection';
import { checkLoginStatus } from './components/Auth/AuthAPI';

function App() {
  useEffect(() => {
    async function isUserAuthenticated() {
      return await checkLoginStatus();
    }
    isUserAuthenticated()
      .then(res => res.success? localStorage.setItem('access_token', res.token ): null)
      .catch(err => console.log(err));
  })

  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path='/' element={
          <SignedinRoutesProtection child={
            <Home />
          } />
        } />

        <Route path='/signup' element={
          <UnAuthRoutes child={
            <SignUp />
          } />
        } />

        <Route path='/login' element={
          <UnAuthRoutes child={
            <Login />
          } />
        } />

        <Route path='/resetPassword' element={
          <UnAuthRoutes child={
            <ResetPassword />
          } />
        } />

        <Route path='/requestResetPassword' element={
          <UnAuthRoutes child={
            <RequestResetPassword />
          } />
        } />

      </Routes>
    </Fragment>
  );
}

export default App;
