import Charts from '../Chart/Charts';
import { useEffect, useState } from 'react';
import Nhietdo from '../nhietdo/nhietdo';
import Doam from '../doam/Doam';
import Anhsang from '../anhsang/Anhsang';
import Menu from '../menu/Menu';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './page.css'
import mqtt from 'precompiled-mqtt'
const urldenon = "https://i.imgur.com/imqSxdm.png";
const urldenoff = "https://i.imgur.com/OXXnlPH.png";
const urlquaton = "https://i.imgur.com/Wx2lXcJ.png";
const urlquatoff = "https://i.imgur.com/ynfVzo0.png";
const Page = () => {
    const [temperature, setTemperature] = useState(30);
    const [humidity, setHumidity] = useState(50);
    const [lux, setLux] = useState(1000);
    const [isLightOn, setIsLightOn] = useState(false);
    const [isFanOn, setIsFanOn] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const [isFan, setIsFan] = useState(false);
    const [isfanlightload, setIsfanlightload] = useState(true);
    const url = "wss://broker.hivemq.com:8884/mqtt";
    const client = mqtt.connect(url)
    useEffect(() => {
            client.subscribe('thoitiet');
            client.subscribe('fanlight');   

            client.on('message', (topic, message) => {
                const datasub = JSON.parse(message.toString());
                if (topic === 'thoitiet') {
                    // Kiểm tra nếu có các trường như 'nhietdo', 'doam' và 'anhsang' trong dữ liệu nhận được
                    if (datasub.nhietdo !== undefined && datasub.doam !== undefined && datasub.anhsang !== undefined) {
                        setTemperature(datasub.nhietdo);
                        setHumidity(datasub.doam);
                        setLux(datasub.anhsang);
                        handleData(datasub.nhietdo, datasub.doam, datasub.anhsang);
                    }
                } else
                    if (topic === "fanlight" && isfanlightload) {
                        if (datasub.light !== undefined && datasub.fan !== undefined) {
                            if (datasub.light === "on") {
                                setIsLight(true);
                                setIsLightOn(true);
                            }
                            else {
                                setIsLight(false);
                                setIsLightOn(false);
                            }
                            if (datasub.fan === "on") {
                                setIsFan(true);
                                setIsFanOn(true);
                            }
                            else {
                                setIsFan(false);
                                setIsFanOn(false);
                            }
                            setIsfanlightload(false)
                        }
                    }

            })
            return () => {
                client.unsubscribe('thoitiet');
                client.unsubscribe('fanlight');
            };
    });
    // console.log(temperature + " :" + new Date())
    const toggleLight = () => {
        setIsLightOn(prevState => !prevState);
        if (isLightOn) {
            client.publish('iot/led_control', 'off');
            postfanlight('Led', 'Off');
            setIsLight(false);
        }
        else {
            client.publish('iot/led_control', 'on');
            postfanlight('Led', 'On');
            setIsLight(true);
        }
    };
    const toggleFan = () => {
        setIsFanOn(prevState => !prevState);
        if (isFanOn) {
            client.publish('iot/fan_control', 'off');
            postfanlight('Fan', 'Off');
            setIsFan(false);
        }
        else {
            client.publish('iot/fan_control', 'on');
            postfanlight('Fan', 'On');
            setIsFan(true);
        }
    };
    function handleData(nhietdo, doam, anhsang) {
        axios.post('http://localhost:8080/add', { nhietdo: nhietdo, doam: doam, anhsang: anhsang })
            .then((response) => {
                // console.log('Dữ liệu đã được gửi thành công:', response.data);
                // Thực hiện các hành động khác sau khi gửi dữ liệu thành công (nếu cần)
            })
            .catch((error) => {
                console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
                // Xử lý lỗi (nếu cần)
            });
    }
    function postfanlight(thietbi, trangthai) {
        axios.post('http://localhost:8080/addfanlight', { thietbi: thietbi, trangthai: trangthai })
            .then((response) => {
                // console.log('Dữ liệu đã được gửi thành công:', response.data);
                // Thực hiện các hành động khác sau khi gửi dữ liệu thành công (nếu cần)
            })
            .catch((error) => {
                console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
                // Xử lý lỗi (nếu cần)
            });
    }
    return (
        <div className="pagee">
            <div className="menuu">
                <Menu />
            </div>
            <div className="page-chucnang">
                <Nhietdo nhietdo={temperature} />
                <Doam doam={humidity} />
                <Anhsang anhsang={lux} />
            </div>
            <div className="page-btn">
                <div className="page-bieudo">
                    <Charts thoitiet={[temperature, humidity, lux]} />
                </div>
                <div className="page-btn-chucnang">
                    <div className="page-btn-den">
                        <div className="btn-icon">
                            <img className="btn-icon-den" src={isLight ? urldenon : urldenoff} alt="Bulb" />
                            <br />
                            <button className={`light-btn ${isLight ? 'on' : 'off'}`} onClick={toggleLight}>
                                <span className="light-icon"></span>
                            </button>
                        </div>

                    </div>
                    <div className="page-btn-quat">
                        <div className="btn-icon">
                            <img className="btn-icon-den" src={isFan ? urlquaton : urlquatoff} alt="Bulb" />
                            <br />
                            <button className={`light-btn ${isFan ? 'on' : 'off'}`} onClick={toggleFan}>
                                <span className="light-icon"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Page;