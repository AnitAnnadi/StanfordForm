import React from 'react';
import StanfordReachLabHealthyFuturesCertImage from '../assets/images/StanfordReachLabHealthyFuturesCert.png';
import { useLocation } from 'react-router-dom';
import "../assets/css/fonts.css"
const Certificate = () => {
  const location = useLocation();
  const info = location.state
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>
      <img
        src={StanfordReachLabHealthyFuturesCertImage}
        alt="Stanford ReachLab Healthy Futures Certificate"
        style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
      />
     <div className='Roboto' style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', fontSize: '30px', color: 'black', textAlign: 'center' }}>
        {info["name"]}
      </div>
      <div className='Roboto' style={{ position: 'absolute', top: '64%', left:'56%', transform: 'translateY(-50%)', fontSize: '20px', color: 'black', textAlign: 'center' }}>
        {formattedDate}
      </div>
      {/* <p>{formattedDate}</p> */}
    </div>
  );
};

export default Certificate;
