import React, { useState, useEffect } from 'react';
import './datathoitiet.css'
import moment from 'moment';
import mqtt from 'precompiled-mqtt'
import axios from 'axios'
import Menu from '../menu/Menu';
function Datathoitiet() {
    const url = "wss://broker.hivemq.com:8884/mqtt";
    const [datathoitiet, setDatathoitiet] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inputPage, setInputPage] = useState(currentPage);
    const [tempInputPage, setTempInputPage] = useState(''); // State tạm thời
    const [temperature, setTemperature] = useState(''); // Thêm trường nhập nhiệt độ
    const [humidity, setHumidity] = useState(''); // Thêm trường nhập độ ẩm
    const [light, setLight] = useState(''); // Thêm trường nhập ánh sáng
    const [temperaturedata, setTemperaturedata] = useState(''); // Thêm trường nhập nhiệt độ
    const [humiditydata, setHumiditydata] = useState(''); // Thêm trường nhập độ ẩm
    const [lightdata, setLightdata] = useState(''); // Thêm trường nhập ánh sáng
    const [searchClicked, setSearchClicked] = useState(false);
    const rowsPerPage = 20;
    useEffect(() => {
        // Gửi yêu cầu API và lấy dữ liệu
        function callapi() {

            fetch(`http://localhost:8080/${searchClicked ? `searchiot?nhietdo=${temperature}&doam=${humidity}&anhsang=${light}` : `iots`}`) // Thay thế URL_API_CUA_BAN bằng URL API thực tế
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item) => {
                        item.thoigian = moment(item.thoigian).format('YYYY-MM-DD HH:mm:ss');
                    });

                    const totalPages = Math.ceil(data.length / rowsPerPage);
                    setTotalPages(totalPages);

                    // Cắt lát dữ liệu dựa trên trang hiện tại và rowsPerPage
                    const startIndex = (currentPage - 1) * rowsPerPage;
                    const endIndex = startIndex + rowsPerPage;
                    const slicedData = data.slice(startIndex, endIndex);
                    setInputPage(currentPage.toString()); // Chuyển currentPage thành chuỗi
                    setDatathoitiet(slicedData);

                })
                .catch((error) => {
                    console.error('Lỗi khi gửi yêu cầu API:', error);
                });
        }
        const client = mqtt.connect(url);
        client.subscribe('thoitiet');
        client.on('message', (topic, message) => {
            const thoitiet = JSON.parse(message.toString());

            // Kiểm tra nếu có các trường như 'nhietdo', 'doam' và 'anhsang' trong dữ liệu nhận được
            if (thoitiet.nhietdo !== undefined && thoitiet.doam !== undefined && thoitiet.anhsang !== undefined) {
                handleData(thoitiet);
            }
        });

        const interval = setInterval(callapi, 2000);

        // Xóa interval khi component bị hủy
        return () => {
            clearInterval(interval);
            client.unsubscribe('thoitiet');
        };
    }, [currentPage, searchClicked,temperaturedata,humiditydata,lightdata]); // Rỗng để chỉ chạy một lần khi component được render

    const handlePageInputChange = (e) => {
        setTempInputPage(e.target.value); // Cập nhật giá trị tạm thời
    };

    const handlePageInputEnter = (e) => {
        if (e.key === 'Enter') {
            const newPage = parseInt(e.target.value, 10);
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
                setTempInputPage('');
                setTempInputPage('')
            }
        }
    };
    function handleData(data) {
        axios.post('http://localhost:8080/add', data)
            .then((response) => {
                // console.log('Dữ liệu đã được gửi thành công:', response.data);
                // Thực hiện các hành động khác sau khi gửi dữ liệu thành công (nếu cần)
            })
            .catch((error) => {
                console.error('Đã xảy ra lỗi khi gửi dữ liệu:', error);
                // Xử lý lỗi (nếu cần)
            });
    }
    const handleSearch = () => {
        if (temperature !== '' || humidity !== '' || light !== '') {
            setTemperaturedata(temperature.trim());
            setHumiditydata(humidity.trim());
            setLightdata(light.trim());
            setSearchClicked(true);
        }
        else
            setSearchClicked(false);
        setCurrentPage(1);
    };
    const handlePageSearchEnter = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }
    const handleExit = () => {
        setCurrentPage(1);
        setSearchClicked(false);
        setTemperature('');
        setHumidity('');
        setLight('');
    };
    let rowCount = 0;
    return (
        <div className='menu-data'>
            <div className="menuu">
                <Menu />
            </div>
            <div className='container-data'>
                <h1>Dữ liệu thời tiết</h1>
                <div className='search-khung'>
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Nhiệt độ (°C)"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                    onKeyPress={handlePageSearchEnter}
                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Độ ẩm (%)"
                        value={humidity}
                        onChange={(e) => setHumidity(e.target.value)}
                    onKeyPress={handlePageSearchEnter}

                    />
                    <input
                        className='search-ip'
                        type="text"
                        placeholder="Ánh sáng (lux)"
                        value={light}
                        onChange={(e) => setLight(e.target.value)}
                    onKeyPress={handlePageSearchEnter}

                    />
                    {/* Nút tìm kiếm */}
                    <button className='btn-exit btn-exit-search bi bi-search' onClick={() => handleSearch()}> Search</button>
                    <button className='btn-exit btn-exit-exit bi bi-x-circle-fill' onClick={() => handleExit()}> Exit</button>
                </div>
                {datathoitiet && (
                    <table>
                        <thead>
                            <tr className='tr_thoitiet'>
                                <th>ID</th>
                                <th>Nhiêt độ (C)</th>
                                <th>Độ ẩm (%)</th>
                                <th>Ánh sáng (lux) </th>
                                <th>Thời gian </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                datathoitiet.map((data) => {
                                    rowCount++; // Tăng biến đếm hàng
                                    const isEvenRow = rowCount % 2 === 0;
                                    const rowClass = isEvenRow ? "id_chan" : "id_le";
                                    return (

                                        <tr className={rowClass}>
                                            <td>{data.id}</td>
                                            <td>{data.nhietdo}</td>
                                            <td>{data.doam}</td>
                                            <td>{data.anhsang}</td>
                                            <td>{data.thoigian}</td>
                                        </tr>

                                    )
                                })
                            }</tbody>
                    </table>
                )}
                <div className="pagination">
                    <button className='btn-truoc' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {/* <span> */}
                    <input
                        className='ip-trang'
                        // type="number"
                        value={tempInputPage}
                        onChange={handlePageInputChange}
                        onKeyPress={handlePageInputEnter}
                        min={1}
                        max={totalPages}
                        placeholder={inputPage + "/" + totalPages}
                    />
                    {/* </span> */}
                    <button className='btn-tiep' onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Datathoitiet;