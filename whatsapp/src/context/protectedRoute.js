import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';
import loadingIcon from '../loading.gif';
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUser();
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <img src={loadingIcon} width={100} alt="Loading..." />
        </div>
    );
    return user ? children : <Navigate to="/login" />;
};