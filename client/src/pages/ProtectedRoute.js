import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';
import Loading from '../components/Loading';
const ProtectedRoute = ({ children }) => {
  const { userLoading,user } = useAppContext();
  //temporary fix. will use redux when more time
  console.log(user)
  if (userLoading) return <Loading />;

  if (!user) {
    console.log(user)
    return <Navigate to='/landing' />;
  }
  return children;
};

export default ProtectedRoute;
