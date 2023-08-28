import { useAppContext } from "../context/appContext";
import { useEffect } from "react";

const HealthyFeatures = () => {
  const {
    getHealthyFutures,
    isLoading,
    showAlert,
    displayAlert,
    user,
    healthyFuturesListCannabis,
    healthyFuturesListTobacco,
  } = useAppContext();

  useEffect(() => {
    getHealthyFutures(user._id);
  }, []);

  return (
    <div>
      <div>
        <p>Students Who Completed Healthy Futures: Tobacco/Nicotine/Vaping</p>
        {healthyFuturesListTobacco.length > 0 ? (
          healthyFuturesListTobacco.map((response) => (
            <p className="location" key={response._id}>
              {response.name}
            </p>
          ))
        ) : (
          <p className="location">
            There are no current students who have completed this course
          </p>
        )}
      </div>
      <div>
        <p>Students Who Completed Healthy Futures: Cannabis</p>
        {healthyFuturesListCannabis.length > 0 ? (
          healthyFuturesListCannabis.map((response) => (
            <div className="location" key={response._id}>
              {response.name}
            </div>
          ))
        ) : (
          <p className="location">
            There are no current students who have completed this course
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthyFeatures;
