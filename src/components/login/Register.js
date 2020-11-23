import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import DatePicker, { registerLocale } from "react-datepicker";
import { Form, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css"
import Firebase from '../../Firebase';
import { isEmptyValue, GetCurrentDate, alert_status } from '../Methods';
import Topnav from '../top/Topnav';
import '../../App.css';
//img
import user from '../../assets/user.png';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import th from 'date-fns/locale/th';
registerLocale('th', th);
export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = Firebase.firestore().collection('USERS');
        console.log(this.props.fetchReducer.user)
        if (!isEmptyValue(this.props.fetchReducer.user.Name)) {

            this.state = {
                ...this.props.fetchReducer.user,
                Provinces: [],
                Districts: [],
                Sub_districts: [],
                //
                profile: true,
                Birthday2: new Date(this.props.fetchReducer.user.Birthday.seconds * 1000),

            }


        } else {
            this.state = {
                User_ID: this.props.fetchReducer.user.User_ID,
                Email: this.props.fetchReducer.user.Email,
                Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
                Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
                Avatar_URL: '',
                Add_date: '', Role: '', Zip_code: '',
                User_type: '',


                // table data
                Province_ID: '', District_ID: '', Sub_district_ID: '',
                //List Data
                Provinces: [],
                Districts: [],
                Sub_districts: [],
                //
                profile: false
            }
        }
        // console.log(this.state)

    }


    selectDate = date => {
        this.setState({
            Birthday2: date,
            Birthday: { nanoseconds: 0, seconds: date.getTime() / 1000 },
        });
        console.log({ nanoseconds: 0, seconds: date.getTime() / 1000 })
    };
    componentDidMount() {

        if (isEmptyValue(this.state.Name)) {
            this.listProvinces();
        } else {
            const { Province_ID, District_ID } = this.state;
            this.listProvinces();
            this.listDistrict(Province_ID);
            this.listSub_district(Province_ID, District_ID);

        }

    }

    listProvinces = () => {
        const Provinces = [];
        data_provinces.forEach((doc, i) => {
            // console.log(doc)
            Provinces.push({
                Key: i,
                value: doc[0]
            })
        })
        this.setState({
            Provinces,

        })
    }
    listDistrict = (pid) => {
        const Districts = [];

        data_provinces[pid][1].forEach((doc, i) => {
            //  console.log(doc)
            Districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Districts,

            })
        } else {
            this.setState({
                Districts,
                District_ID: '',
                Sub_district_ID: '',
            })
        }

    }
    listSub_district = (pid, did) => {
        const Sub_districts = [];

        data_provinces[pid][1][did][2][0].forEach((doc, i) => {

            Sub_districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Sub_districts,

            })
        } else {
            this.setState({
                Sub_districts,
                Sub_district_ID: '',
            })
        }
    }

    onSelectProvince = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.Province_ID === '') {
            this.setState({
                Districts: [],
                District_ID: '',
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.listDistrict(this.state.Province_ID);
        }
    }
    onSelectDistrict = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.District_ID === '') {
            this.setState({
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.listSub_district(this.state.Province_ID, this.state.District_ID);
        }
    }
    handleChangeUsername = event =>
        this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        this.setState({ Avatar_name: filename, progress: 100, isUploading: false, uploaded: true });
        Firebase
            .storage()
            .ref("Avatar")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ Avatar_URL: url }));
    };
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }


    onSubmit = (e) => {
        e.preventDefault();
        const { User_ID, Province, District, Sub_district, User_type,
            Ban_name, Name, Last_name, Nickname, Sex, Phone_number, Line_ID,
            Facebook, Birthday, Position, Department, Province_ID, District_ID,
            Sub_district_ID, Email, Avatar_URL, Add_date, Role, Area_ID,
            Area_PID, Area_DID, Area_SDID, Birthday2,
        } = this.state;
        var d1 = new Date(Birthday.seconds * 1000);
        let bd =
            d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();

        if (Avatar_URL !== '') {
            if (this.state.profile) {
                this.tbUsers.doc(this.state.User_ID).update({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                    Add_date: GetCurrentDate("/"), Role, User_type, Area_ID, Area_PID, Area_DID, Area_SDID,
                }).then((docRef) => {
                    this.props.fetch_user({
                        User_ID, Province, District, Sub_district, User_type, bd, Ban_name, Name, Last_name,
                        Nickname, Sex, Phone_number, Line_ID, Facebook, Birthday, Position, Department, Province_ID,
                        District_ID, Sub_district_ID, Email, Avatar_URL, Add_date, Role,
                        Area_ID: parseInt(Area_ID, 10),
                        Area_PID: parseInt(Area_PID, 10),
                        Area_DID: parseInt(Area_DID, 10),
                        Area_SDID: parseInt(Area_SDID, 10)
                    });
                    alert_status('update');
                })
                    .catch((error) => {
                        alert_status('noupdate');
                        console.error("Error adding document: ", error);
                    });
            } else {
                //add data user 
                this.tbUsers.doc(this.state.User_ID).set({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                    Add_date: GetCurrentDate("/"), Role, User_type, Area_ID: '', Area_PID: '', Area_DID: '', Area_SDID: '',

                }).then((docRef) => {
                    const Province2 = data_provinces[Province_ID][0];
                    const District2 = data_provinces[Province_ID][1][District_ID][0];

                    const Sub_district2 = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
                    this.props.fetch_user({
                        User_ID, Province: Province2, District: District2, Sub_district: Sub_district2,
                        User_type, bd, Ban_name, Name, Last_name,
                        Nickname, Sex, Phone_number, Line_ID, Facebook, Birthday, Position, Department, Province_ID,
                        District_ID, Sub_district_ID, Email,
                        Avatar_URL, Add_date, Role,
                        Area_ID: '', Area_PID: '', Area_DID: '', Area_SDID: '',

                    });
                    this.setState({
                        profile: true,
                    })
                    alert_status('add');
                })
                    .catch((error) => {
                        alert_status('noadd');
                        console.error("Error adding document: ", error);
                    });



            }

        } else {
            alert_status('notupload');
        }

    }
    render() {
        //step create Email
        const { Email, } = this.state;
        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday2, Position, Department,
            Province_ID, District_ID, Sub_district_ID,
            Role, User_type, Expertise
        } = this.state;
        //List data
        const { Provinces, Districts, Sub_districts } = this.state;
        const style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }
        // console.log(new Date(this.props.fetchReducer.user.Birthday.seconds * 1000))


        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>

                    <form onSubmit={this.onSubmit} >
                        <h3>{Email}</h3>
                        <hr></hr>
                        <Row>
                            <Col>
                                <div style={style}>
                                    <label >เลือกรูปโปรไฟล์: <label style={{ color: "red" }}>*</label></label>

                                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                    {!this.state.Avatar_URL && <img className="avatar" alt="avatar_user" src={user} />}
                                    {this.state.Avatar_URL && <img className="avatar" alt="avatar" src={this.state.Avatar_URL} />}
                                    <br></br>
                                    <CustomUploadButton
                                        accept="image/*"
                                        filename={"user" + this.state.User_ID}
                                        storageRef={Firebase.storage().ref('Avatar')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                        style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4 }}
                                    >
                                        เลือกไฟล์
                    </CustomUploadButton>
                                </div>
                            </Col>
                            <Col sm={9}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">ชื่อ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Name" value={Name} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="2">นามสกุล: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Last_name" value={Last_name} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">ชื่อเล่น: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Nickname" value={Nickname} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="2">เพศ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>

                                        <div>
                                            <input type="radio" name="Sex" value="ชาย" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'ชาย'} />ชาย
                                        <input type="radio" name="Sex" value="หญิง" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'หญิง'} />หญิง
                                        <input type="radio" name="Sex" value="อื่นๆ" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'อื่นๆ'} />อื่นๆ
                                        </div>



                                    </Col>

                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">วันเกิด: </Form.Label>
                                    <Col>

                                        <div className="form-control">
                                            <DatePicker
                                                locale="th"
                                                dateFormat="dd/MM/yyyy"
                                                selected={Birthday2}
                                                maxDate={new Date()}
                                                onChange={this.selectDate}
                                                placeholderText="วัน/เดือน/ปี(ค.ศ.)"
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>

                                    </Col>
                                    <Form.Label column sm="2">ประเภทผู้ใช้: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="User_type" name="User_type" value={User_type} onChange={this.onChange} required>
                                            <option value=""></option>
                                            <option value="ผู้บริหาร">ผู้บริหาร</option>
                                            <option value="พี่เลี้ยง">พี่เลี้ยง</option>
                                            <option value="แกนนำเด็ก">แกนนำเด็ก</option>
                                        </select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">เบอร์โทรศัพท์มือถือ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="tel" pattern="0[0-9]{1}[0-9]{8}" maxLength="10" size="10" placeholder="0XXXXXXXXX"
                                            className="form-control" name="Phone_number" value={Phone_number} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="2">Facebook: </Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Facebook" value={Facebook} onChange={this.onChange} />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">LIne ID: </Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Line_ID" value={Line_ID} onChange={this.onChange} />
                                    </Col>
                                    <Form.Label column sm="2">ตำแหน่ง: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Position"
                                            value={Position} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row}>

                                    <Form.Label column sm="2">หน่วยงาน: </Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Department"
                                            value={Department} onChange={this.onChange} />
                                    </Col>
                                    <Form.Label column sm="2">จังหวัด: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="Province_ID" name="Province_ID" value={Province_ID} onChange={this.onSelectProvince} required>
                                            <option key='0' value=""></option>
                                            {Provinces.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>
                                            )}

                                        </select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">อำเภอ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="District_ID" name="District_ID" value={District_ID} onChange={this.onSelectDistrict} required>
                                            <option key='0' value=""></option>
                                            {Districts.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>
                                            )}

                                        </select>
                                    </Col>
                                    <Form.Label column sm="2">ตำบล: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="Sub_district_ID" name="Sub_district_ID" value={Sub_district_ID} onChange={this.onChange} required>
                                            <option key='0' value=""></option>
                                            {Sub_districts.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>

                                            )}

                                        </select>
                                    </Col>
                                </Form.Group>


                                {this.state.Role === "admin" &&
                                    <Form.Group as={Row}>

                                        <Form.Label column sm="2">บทบาท: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <select className="form-control" id="Role" name="Role" value={Role} onChange={this.onChange}>
                                                <option value=""></option>
                                                <option value="ผู้บริหาร">ผู้บริหาร</option>
                                                <option value="พี่เลี้ยง">พี่เลี้ยง</option>
                                                <option value="แกนนำเด็ก">แกนนำเด็ก</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </Col>


                                    </Form.Group>}
                            </Col>


                        </Row>
                        <center><br />
                            <button type="submit" className="btn btn-success">บันทึก</button>
                            <br></br><br></br>
                        </center>
                    </form>

                </div>
            </div>
        )
    }
}


//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
