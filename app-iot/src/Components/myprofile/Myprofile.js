import "./myprofile.css"
import Menu from "../menu/Menu";
const Myprofile = () => {
    return (
        <div>
            <div className="menuu">
                <Menu />
            </div>
            <div className="mybackground">
                <img className="imgavt" src="https://i.imgur.com/wCuqxdN.jpg"></img>
                <div className="mythongtin">Họ tên: Phạm Trung Hiếu</div>
                <div className="mythongtin">MSV: B20DCCN258 </div>
                <div className="mythongtin">SĐT: 0362758039 </div>
            </div>
        </div>
    )
}
export default Myprofile;