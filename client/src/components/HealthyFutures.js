import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';

const HealthyFeatures = () => {
  const {
    getHealthyFutures,
    isLoading,
    showAlert,
    displayAlert,
    user,
    healthyFuturesListCannabis,
    healthyFuturesListTobacco
  } = useAppContext();

  useEffect(() => {
    getHealthyFutures(user._id);
  }, []);

  const listItemStyle = {
    marginLeft: '20px', // Add the desired indentation value
  };

  return (
    <div>
      <div>
        <p>Healthy Futures: Cannabis</p>
        {healthyFuturesListCannabis.length>0?
        healthyFuturesListCannabis.map((response) => (
          <div key={response._id} style={listItemStyle}>
            {response.name}
          </div>
        )):<>There are no current responses to this form</>}
      </div>
      <div>

        <p>Healthy Futures: Tobacco/Nicotine/Vaping</p>
        {healthyFuturesListTobacco.length>0?
        healthyFuturesListTobacco.map((response) => (
          <div key={response._id} style={listItemStyle}>
            {response.name}
          </div>
        )):<>There are no current responses to this form</>}
      </div>
    </div>
  );
};

export default HealthyFeatures;
