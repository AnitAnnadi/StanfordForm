import { SchoolsContainer, SearchContainer } from '../../components'
import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/appContext';
import { useNavigate } from 'react-router-dom';
import {Alert} from "../../components";

const Metrics = () => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    updateUser,
    isLoading,
    handleChange,
    successAlert,
    getLocations,
    pendingLocations
  } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    getLocations({ user })
        }, []);
  
    useEffect(() => {
        if (pendingLocations){
        if (pendingLocations?.length >= 1 && userLocations.length === 0) {
          successAlert("Redirecting to pending location");
          setTimeout(() => {
            navigate("/pendingLocation");
          }, 2000);
        }
        if (user && user.adminTeacher && userLocations.length < 2) {
          if (userLocations.length === 1 && (user.role === 'Stanford Staff' || user.role === "Site Admin")) {
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
          else if (userLocations.length === 0 && pendingLocations.length==9) {
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
          if (user.role === "Stanford Staff") {
            return;
          }
          if (pendingLocations.length >= 1) {
            setTimeout(() => {
              navigate("/pendingLocation");
            }, 2000);
          }
          else {
            console.log(pendingLocations);
            successAlert("Redirecting to select location");
            setTimeout(() => {
              navigate("/selectLoc");
            }, 2000);
            return;
          }
        }
      }
      }, [pendingLocations]);
      const [reloadSchools, setReloadSchools] = useState(false);

  const startReloadSchools = () => {
    setReloadSchools(true);
  };

  const stopReloadSchools = () => {
    setReloadSchools(false);
  };

  return (
    <>
      <SearchContainer startReload={startReloadSchools}/>
      <SchoolsContainer stopReload={stopReloadSchools} shouldReload={reloadSchools}/>
    </>
  )
}

export default Metrics
