import { Navigate } from 'react-router-dom';

export const SignedinRoutesProtection = ({ child }) => {
    const isAuthenticated = localStorage.getItem('access_token');
    if (isAuthenticated) {
        return child;
    } else {
        return <Navigate to="/login" replace />;
    }
}


export const UnAuthRoutes = ({ child }) => {
    const isAuthenticated = localStorage.getItem('access_token');
    if (!isAuthenticated) {
        return child;
    } else {
        return <Navigate to="/" replace />;
    }
}