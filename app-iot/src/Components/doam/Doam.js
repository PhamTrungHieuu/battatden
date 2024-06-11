import React, { useState, useEffect } from 'react';
import './doam.css';
import { WiHumidity } from 'react-icons/wi';

function Doam(props) {
  const [humidity,setHumidity] = useState(0);
  let humidityClass ;
  useEffect(() => {
    setHumidity(props.doam);
  }, [props]);
  // Xác định biểu tượng thời tiết dựa trên nhiệt độ
  let weatherIcon;
  if (humidity < 50) {
    weatherIcon = <WiHumidity />;
    humidityClass = 'thap';
  } else if (humidity < 80) {
    weatherIcon = <WiHumidity />;
    humidityClass = 'trungbinh';
  } else {
    weatherIcon = <WiHumidity />;
    humidityClass = 'cao';
  }

  return (
      <div className={`doam weather-box ${humidityClass}`}>
        <p className='weatherIcon' >{weatherIcon} </p>
        <div className='thongtindoam'> {humidity} %</div>
    </div>
  );
}

export default Doam;