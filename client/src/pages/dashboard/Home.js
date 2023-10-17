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
    monthlyApplications,
    pendingLocations,
    getLocations
  } = useAppContext();
  const navigate = useNavigate();

  

  useEffect(() => {
      getLocations({ user }).then(()=>{
      if (pendingLocations){
      if (pendingLocations?.length >= 1 && userLocations.length === 0) {
        successAlert("Redirecting to pending location");
        setTimeout(() => {
          navigate("/pendingLocation");
        }, 2000);
      }
      if (user && user.adminTeacher && userLocations.length < 2) {
        console.log(userLocations.length, user.role)
        if (userLocations.length === 1 && (user.role === 'Stanford Staff' || user.role === "Site Admin")) {
          console.log('first')
          return;
        }
        else if (userLocations.length >= 1 && pendingLocations.length >= 1 ) {
          successAlert("Redirecting to pending location");
          setTimeout(() => {
            navigate("/pendingLocation");
          }, 2000);
        }
        else if (userLocations.length >= 1) {
          successAlert("Redirecting to select school location");
          setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool: true, fromProfile: false }
            });
          }, 2000);
          return;
        }
        else if (userLocations.length === 0 && pendingLocations.length==0) {
          if (user.adminTeacher && (user.role === 'Stanford Staff' || user.role === "Site Admin")) {
            successAlert("Redirecting to select school location");
            setTimeout(() => {
              navigate("/selectLoc", {
                state: { adminTeacher: false, selectSchool: true, fromProfile: false }
              });
            }, 2000);
            return;
          }
          else {
            successAlert("Redirecting to select admin location");
            setTimeout(() => {
              navigate("/selectLoc", {
                state: { adminTeacher: true, selectSchool: false, fromProfile: false }
              });
            }, 2000);
            return;
          }
        }
      }
      else if (user && !user.adminTeacher && userLocations.length < 1) {
        console.log(userLocations)
        if (user.role === "Stanford Staff") {
          return;
        }
        if (pendingLocations.length >= 1) {
          setTimeout(() => {
            navigate("/pendingLocation");
          }, 2000);
        }
        // else {
        //   successAlert("Redirecting to select location");
        //   setTimeout(() => {
        //     navigate("/selectLoc");
        //   }, 2000);
        //   return;
        // }
      }
    }})
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
