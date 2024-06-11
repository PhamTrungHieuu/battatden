import React, { useState, useEffect } from 'react';
import './anhsang.css';
import {  WiLunarEclipse } from 'react-icons/wi';
import mqtt from 'precompiled-mqtt'

function Anhsang(props) {
  const [lux,setLux] = useState(0);
  let luxClass = 'normal';
  useEffect(() => {
    setLux(props.anhsang);
  }, [props]);
  let weatherIcon;
  if (lux < 200) {
    weatherIcon = <WiLunarEclipse  />;
    luxClass = 'toi';
  } else if (lux < 500) {
    weatherIcon = <WiLunarEclipse  />;
    luxClass = 'hoitoi';
  } else if (lux < 800) {
    weatherIcon = <WiLunarEclipse  />;
    luxClass = 'sang';
  } else {
    weatherIcon = <WiLunarEclipse  />;
    luxClass = 'ratsang';
  }

  return (
      <div className={`anhsang1 weather-box ${luxClass}`}>
        <p className='weatherIcon' >{weatherIcon} </p>
        <div className='thongtinanhsang'> {lux}Lux</div>
    </div>
  );
}

export default Anhsang;
