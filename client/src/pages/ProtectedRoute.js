import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
const ProtectedRoute = ({ children }) => {
  const { userLoading,user } = useAppContext();
  if (userLoading) return <Loading />;
  console.log(user)

  if (!user) {
    localStorage.clear()
    return <Navigate to='/landing' />;
  }
  return children;
};

export default ProtectedRoute;
