import { React, useEffect, useState } from 'react';
import './nhietdo.css';
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

function Nhietdo(props) {
  const [temperature, setTemperature] = useState(0);
  useEffect(() => {
    setTemperature(props.nhietdo);
  }, [props]);
  let temperatureClass = 'normal';

  // Xác định biểu tượng thời tiết dựa trên nhiệt độ
  let weatherIcon;
  if (temperature < 10) {
    weatherIcon = <WiSnow />;
    temperatureClass = 'cold';
  } else if (temperature > 30) {
    weatherIcon = <WiDaySunny />;
    temperatureClass = 'hot';
  } else if (temperature >= 20 && temperature <= 30) {
    weatherIcon = <WiCloudy />;
    temperatureClass = 'normal';
  } else {
    weatherIcon = <WiRain />;
    temperatureClass = 'rainy';
  }

  return (
    <div className={`nhietdo weather-box ${temperatureClass}`}>
      <p className='weatherIcon' >{weatherIcon} </p>
      <div className='thongtinnhietdo'> {temperature}°C</div>
    </div>
  );
}

export default Nhietdo;
