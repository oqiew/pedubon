import { confirmAlert } from 'react-confirm-alert'; // Import
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import DatePicker from "react-datepicker";
import { Form, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react'

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import "react-datepicker/dist/react-datepicker.css"

import firebase from '../../firebase';
import { GetTypeUser, GetCurrentDate } from '../methods';
import Topnav from '../top/Topnav';

import '../../App.css';

//img
import user from '../../assets/user.png';
export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = firebase.firestore().collection('USERS');
        this.tbProvinces = firebase.firestore().collection('PROVINCES');
        this.tbDistricts = firebase.firestore().collection('DISTRICTS');
        this.tbTumbons = firebase.firestore().collection('TUMBONS');
        this.state = {
            User_ID: '',
            //input data profile
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',

            //List Data
            Provinces: [],
            Districts: [],
            Tumbons: [],
            User_types: GetTypeUser(),

            //
            profile: false
        }
    }
    getUser(id) {

        firebase.firestore().collection('USERS').doc(id).get().then((doc) => {
            if (doc.exists) {
                const { Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,

                } = doc.data()
                var d1 = new Date(Birthday.seconds * 1000);
                this.setState({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday: d1, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID, uploaded: true, profile: true
                })
                this.unsubscribe = this.tbProvinces.onSnapshot(this.getProvinces);
                this.unsubscribe = this.tbDistricts.where('Province_ID', '==', Province_ID).onSnapshot(this.getDistricts);
                this.unsubscribe = this.tbTumbons.where('District_ID', '==', District_ID).onSnapshot(this.getTumbons);
            } else {
                this.unsubscribe = this.tbProvinces.onSnapshot(this.getProvinces);
                this.setState({
                    profile: false
                })
            }
        }
        );
    }
    authListener() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                this.setState({
                    statusLogin: true,
                    Email: user.email,
                    User_ID: user.uid,

                });
                this.getUser(user.uid);
            } else {
                this.props.history.push('/');
            }
        });
    }
    selectDate = date => {
        this.setState({
            Birthday: date,
        });
    };
    componentDidMount() {

        this.authListener();

    }
    getProvinces = (querySnapshot) => {
        const Provinces = [];
        querySnapshot.forEach(doc => {
            const { Name, } = doc.data();

            Provinces.push({
                Key: doc.id,
                Name,
            });

        });

        this.setState({
            Provinces
        })
    }
    getDistricts = (querySnapshot) => {
        const Districts = [];
        querySnapshot.forEach(doc => {
            const { Name, } = doc.data();

            Districts.push({
                Key: doc.id,
                Name,
            });

        });

        this.setState({
            Districts
        })
    }
    getTumbons = (querySnapshot) => {
        const Tumbons = [];
        querySnapshot.forEach(doc => {
            const { Name } = doc.data();

            Tumbons.push({
                Key: doc.id,
                Name: Name,
            });

        });

        this.setState({
            Tumbons
        })
    }
    onSelectProvince = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        this.unsubscribe = this.tbDistricts.where('Province_ID', '==', this.state.Province_ID).onSnapshot(this.getDistricts);
    }
    onSelectDistrict = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        console.log(this.state.District_ID);
        this.unsubscribe = this.tbTumbons.where('District_ID', '==', this.state.District_ID).onSnapshot(this.getTumbons);
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
        firebase
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
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
            Area_ID, Role, User_type_ID,
        } = this.state;

        if (this.state.uploaded) {
            if (!this.state.profile) {
                //add data user 
                this.tbUsers.doc(this.state.User_ID).set({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date: GetCurrentDate("/"), Area_ID, Role, User_type_ID,

                }).then((docRef) => {
                    confirmAlert({
                        title: 'บันทึกสำเร็จ',
                        message: 'คุณต้องการกลับไปหน้าแรก หรือไม่',
                        buttons: [
                            {
                                label: 'ใช่',
                                onClick: () => this.props.history.push('/')
                            },
                            {
                                label: 'ไม่ใช่',

                            }
                        ]
                    });
                })
                    .catch((error) => {
                        this.setState({
                            statusSave: '3',
                        });
                        console.error("Error adding document: ", error);
                    });


            } else {

                this.tbUsers.doc(this.state.User_ID).update({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date: GetCurrentDate("/"), Area_ID, Role, User_type_ID,
                }).then((docRef) => {
                    this.props.history.push('/');
                })
                    .catch((error) => {
                        this.setState({
                            statusSave: '3',
                        });
                        console.error("Error adding document: ", error);
                    });

            }

        } else {
            this.setState({
                statusSave: '4',
            });
        }

    }
    render() {
        //step create Email
        const { Email, } = this.state;
        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Tumbon_ID,
            Role, User_type_ID,
        } = this.state;
        //List data
        const { Provinces, Districts, Tumbons, User_types } = this.state;
        const style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }
        let showStatus;

        if (this.state.statusSave === '2') {
            showStatus = <h6 className="text-success">บันทึกสำเร็จ</h6>;
        } else if (this.state.statusSave === '3') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ</h6>;
        } else if (this.state.statusSave === '4') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ โปรดอัพรูปภาพ</h6>;
        } else {
            showStatus = "";
        }

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
                                        storageRef={firebase.storage().ref('Avatar')}
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
                                                dateFormat="dd/MM/yyyy"
                                                selected={Birthday}
                                                onChange={this.selectDate}
                                                placeholderText="วัน/เดือน/ปี(ค.ศ.)"

                                            />
                                        </div>

                                    </Col>
                                    <Form.Label column sm="2">ประเภทผู้ใช้: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="User_type_ID" name="User_type_ID" value={User_type_ID} onChange={this.onChange} required>
                                            <option value=""></option>
                                            {User_types.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.Name}</option>
                                            )}
                                        </select>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">เบอร์โทรศัพท์มือถือ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="tel" pattern="0[0-9]{1}[0-9]{8}" maxLength="10" size="10" placeholder="0XXXXXXXXX"
                                            className="form-control" name="Phone_number" value={Phone_number} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="2">Facebook: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Facebook" value={Facebook} onChange={this.onChange} />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">LIne ID: <label style={{ color: "red" }}>*</label></Form.Label>
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
                                                <option key={i + 1} value={data.Key}>{data.Name}</option>
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
                                                <option key={i + 1} value={data.Key}>{data.Name}</option>
                                            )}

                                        </select>
                                    </Col>
                                    <Form.Label column sm="2">ตำบล: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="Tumbon_ID" name="Tumbon_ID" value={Tumbon_ID} onChange={this.onChange} required>
                                            <option key='0' value=""></option>
                                            {Tumbons.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.Name}</option>

                                            )}

                                        </select>
                                    </Col>
                                </Form.Group>

                                {this.state.roleAccess === "admin" ?
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


                                    </Form.Group> : ""}
                            </Col>


                        </Row>
                        <center><br />
                            <button type="submit" className="btn btn-success">บันทึก</button>
                            <br></br><br></br>
                            {showStatus}</center>
                    </form>

                </div>
            </div>
        )
    }
}

export default Register
