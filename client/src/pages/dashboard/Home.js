import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  StatsContainer,
  Loading,
  ChartsContainer,
  Faq,
} from "../../components";
import { useNavigate } from "react-router-dom";
import {  Alert } from "../../components";

const Home = () => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    updateUser,
    isLoading,
    handleChange,
    successAlert,
    monthlyApplications
  } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.adminTeacher && userLocations.length<2){
        if (userLocations.length==1 && (user.role=='Stanford Staff' || user.role=="Site Admin")){
          return
        }
        else if (userLocations.length>=1){
          successAlert("Redirecting to select school location")
          setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool:true, fromProfile:false }
            });
          }, 2000);
          return
        }
        else if (userLocations.length==0){
          if (user.adminTeacher && (user.role=='Stanford Staff' || user.role=="Site Admin")){
          successAlert("Redirecting to select school location")
          setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool:true, fromProfile:false }
            });
          }, 2000);
          return
          }
          else{
            successAlert("Redirecting to select admin location")
            setTimeout(() => {
              navigate("/selectLoc", {
                state: { adminTeacher: true, selectSchool:false, fromProfile:false }
              });
            }, 2000);
            return
          }
        }
    }
    else if (user && !user.adminTeacher && userLocations.length<1){
      console.log('hi')
      console.log(user.role)
      if (user.role =="Stanford Staff"){

        return
      }
      else{
      successAlert("Redirecting to select location")
      setTimeout(() => {
        navigate("/selectLoc");
      }, 2000);
      return
    }
    }
    else{
      return
    }
  }, []);


  if (isLoading) {
    return <Loading center />;
  }
  

  return (
    <>
      {(user?.role === "Teacher" || user?.adminTeacher) && (
        <div>
          {showAlert && <Alert/>}
          <StatsContainer />
          <Faq />
          {monthlyApplications.length > 0 && <ChartsContainer />}
        </div>
      )}
    </>
  );
};

export default Home;
