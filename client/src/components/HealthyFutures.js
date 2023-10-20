import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import {useTranslation} from "react-i18next";

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

  const { t, i18n } = useTranslation();

  return (
    <div>
      <div>
        <p style={{ marginBottom: "0.25rem", marginTop: 0 }}>
          {t('completed_healthy_tobacco_title', 'Students Who Completed Healthy Futures: Tobacco/Nicotine/Vaping')}
        </p>
        {healthyFuturesListTobacco.length > 0 ? (
          healthyFuturesListTobacco.map((response) => (
            <p className="location" key={response._id}>
              {response.name}
            </p>
          ))
        ) : (
          <p className="location">
            {t('no_students_completed', 'There are no current students who have completed this course')}
          </p>
        )}
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem" }}>
          {t('completed_healthy_cannabis_title', 'Students Who Completed Healthy Futures: Cannabis')}
        </p>
        {healthyFuturesListCannabis.length > 0 ? (
          healthyFuturesListCannabis.map((response) => (
            <div className="location" key={response._id}>
              {response.name}
            </div>
          ))
        ) : (
          <p className="location">
            {t('no_students_completed', 'There are no current students who have completed this course')}
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthyFeatures;
