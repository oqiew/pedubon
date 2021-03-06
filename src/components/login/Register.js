import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import DatePicker from "react-datepicker";
import { Form, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css"
import Firebase from '../../Firebase';
import { isEmptyValue, GetCurrentDate, alert_status } from '../Methods';
import Topnav from '../top/Topnav';
import '../../App.css';
//img
import temp_avatar from '../../assets/user.png';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import th from 'date-fns/locale/th';
import { tableName } from '../../database/TableConstant';
import Resizer from 'react-image-file-resizer';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Loading from '../Loading';

export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = Firebase.firestore().collection(tableName.Users);
        console.log(this.props.fetchReducer.user)
        if (!isEmptyValue(this.props.fetchReducer.user.Name)) {
            this.state = {
                ...this.props.fetchReducer.user,
                newAvatarUpload: false,
                query_areas: [],
                areas: [],
                //
                profile: true,
                Birthday: new Date(this.props.fetchReducer.user.Birthday),
                loading: false,
            }
        } else {
            this.state = {
                uid: this.props.fetchReducer.user.uid,
                email: this.props.fetchReducer.user.email,
                Name: '', Lastname: '', Nickname: '', Sex: '', Phone_number: '',
                Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
                Avatar_URL: '',
                Role: '',
                User_type: '', dominance: '',
                Area_ID: '',
                //
                profile: false,
                newAvatarUpload: false,
                query_areas: [],
                areas: [],
                loading: false,
            }
        }
        // console.log(this.state)

    }
    selectDate = date => {
        const Birthday_format = ("0" + date.getDate()).slice(-2) + "-" + (parseInt(date.getMonth(), 10) + 1) + "-" + date.getFullYear();
        this.setState({
            Birthday_format,
            Birthday: date,
        });
    };
    componentDidMount() {
        Firebase.firestore().collection(tableName.Areas).onSnapshot(this.onUpdateAreas);
    }
    uploadImage = async () => {
        return new Promise((resolve, reject) => {
            const imageRef = Firebase.storage().ref('User').child('user' + this.state.uid + '.jpg')
            let mime = 'image/jpg';
            imageRef.putString(this.state.avatar_uri, 'data_url')
                .then(() => { return imageRef.getDownloadURL() })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    onUpdateAreas = (querySnapshot) => {
        this.setState({
            loading: true
        })
        const query_areas = []
        querySnapshot.forEach(element => {
            query_areas.push({
                areaID: element.id,
                title: element.data().Area_name,
                ...element.data()
            })
        });
        this.setState({
            query_areas,
            loading: false
        })
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }


    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })
        const { uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
            Line_ID, Facebook, Birthday, Birthday_format, Position, Area_ID, Avatar_URL, newAvatarUpload } = this.state;
        var temp_Avatar_URL = "";
        if (newAvatarUpload) {
            temp_Avatar_URL = await this.uploadImage();
        } else {
            temp_Avatar_URL = Avatar_URL
        }

        if (temp_Avatar_URL !== '') {
            if (this.state.profile) {
                this.tbUsers.doc(this.state.uid).update({
                    Name, Lastname, Nickname, Sex, Phone_number, User_type, Email: email,
                    Line_ID, Facebook, Birthday, Position, Area_ID, Avatar_URL: temp_Avatar_URL, Role: '',
                    Birthday_format,
                    Update_date: Firebase.firestore.Timestamp.now()
                }).then((docRef) => {
                    this.props.fetch_user({
                        uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type, Birthday_format,
                        Line_ID, Facebook, Birthday, Position, Area_ID, Avatar_URL: temp_Avatar_URL,
                    });
                    this.setState({
                        loading: false
                    })
                    alert_status('update');
                })
                    .catch((error) => {
                        this.setState({
                            loading: false
                        })
                        alert_status('noupdate');
                        console.error("Error adding document: ", error);
                    });
            } else {
                //add data user 
                this.tbUsers.doc(this.state.uid).set({
                    Name, Lastname, Nickname, Sex, Phone_number, User_type, Email: email, Birthday_format,
                    Line_ID, Facebook, Birthday, Position, Area_ID, Avatar_URL: temp_Avatar_URL, Role: '',
                    Create_date: Firebase.firestore.Timestamp.now()

                }).then((docRef) => {

                    this.props.fetch_user({
                        uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
                        Line_ID, Facebook, Birthday, Position, Area_ID, Avatar_URL: temp_Avatar_URL,
                        Birthday_format,
                    });
                    this.setState({
                        profile: true,
                        loading: false
                    })

                    alert_status('add');
                })
                    .catch((error) => {
                        this.setState({
                            loading: false
                        })
                        alert_status('noadd');
                        console.error("Error adding document: ", error);
                    });



            }

        } else {
            this.setState({
                loading: false
            })
            alert_status('notupload');

        }

    }
    fileChangedHandler = (event) => {
        var fileInput = false
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0], 300, 300, 'JPEG', 100, 0,
                uri => {
                    // console.log(uri)
                    this.setState({
                        newAvatarUpload: true,
                        avatar_uri: uri,
                    })
                }, 'base64', 200, 200);
        }
    }
    onChangeDominance = (value) => {
        const dominance = value.target.value;

        if (dominance === '') {
            return [];
        }
        const { query_areas } = this.state;
        console.log(query_areas)
        const regex = new RegExp(`${dominance.trim()}`, 'i');
        const areas = query_areas.filter(area => area.Dominance.search(regex) >= 0)
        this.setState({
            areas,
            dominance
        })
    }
    render() {
        //step create Email
        const { email, } = this.state;
        //User Profile
        const { Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position,
            dominance, Area_ID,
            Role, User_type,
        } = this.state;
        //List data
        const { avatar_uri, Avatar_URL, areas } = this.state;
        // console.log(new Date(this.props.fetchReducer.user.Birthday.seconds * 1000))

        if (this.state.loading) {
            return (
                <Loading></Loading>
            )
        } else {
            return (
                <div>
                    <Topnav></Topnav>
                    <div className="content" style={{ justifyContent: 'center ', display: 'flex' }}>
                        <form className="login100-form validate-form" style={{ width: '80%' }} onSubmit={this.onSubmit} >
                            <h3>{email}</h3>
                            <hr></hr>

                            <Form.Group as={Row}>
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                                    <label >เลือกรูปโปรไฟล์: <label style={{ color: "red" }}>*</label></label>
                                    {(isEmptyValue(avatar_uri) && isEmptyValue(Avatar_URL)) ?
                                        <img className="avatar" alt="avatar_user" src={temp_avatar} />
                                        : <img className="avatar" alt="avatar_user" src={isEmptyValue(avatar_uri) ? Avatar_URL : avatar_uri} />}

                                    <input type="file" placeholder="อัพโหลดรูปภาพของคุณ" style={{ width: 200, wordWrap: 'break-word' }}
                                        onChange={this.fileChangedHandler} />
                                </div>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">ชื่อ: <label style={{ color: "red" }}>*</label></Form.Label>
                                <Col>
                                    <input type="text" className="form-control" name="Name" value={Name} onChange={this.onChange} required />
                                </Col>
                                <Form.Label column sm="2">นามสกุล: <label style={{ color: "red" }}>*</label></Form.Label>
                                <Col>
                                    <input type="text" className="form-control" name="Lastname" value={Lastname} onChange={this.onChange} required />
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
                                            dateFormat="dd-MM-yyyy"
                                            selected={Birthday}
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
                            {!this.state.profile && <Form.Group as={Row}>
                                <Form.Label column sm="2">รูปแบบ อปท : <label style={{ color: "red" }}>*</label></Form.Label>
                                <Col>
                                    <select className="form-control" id="dominance" name="dominance"
                                        value={dominance} onChange={str => this.onChangeDominance(str)}>
                                        <option key={0} value="เลือกรูปแบบ อปท"></option>
                                        <option key={1} value="องค์การบริหารส่วนจังหวัด">องค์การบริหารส่วนจังหวัด</option>
                                        <option key={2} value="เทศบาลนคร">เทศบาลนคร</option>
                                        <option key={3} value="เทศบาลเมือง">เทศบาลเมือง</option>
                                        <option key={4} value="เทศบาลตำบล">เทศบาลตำบล</option>
                                        <option key={5} value="องค์การบริหารส่วนตำบล">องค์การบริหารส่วนตำบล</option>
                                    </select>
                                </Col>
                                <Form.Label column sm="2">ชื่ออปท: </Form.Label>
                                <Col>
                                    <Autocomplete
                                        options={areas}
                                        getOptionLabel={(option) => option.title}
                                        style={{ width: 'auto' }}
                                        onChange={(e, val) => this.setState({ Area_ID: val.areaID })}
                                        renderInput={(params) =>
                                            <TextField {...params} variant="outlined" />
                                        }
                                    />
                                </Col>
                            </Form.Group>}
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

                            <center><br />
                                <button type="submit" className="btn btn-success">บันทึก</button>
                                <br></br><br></br>
                            </center>
                        </form>

                    </div>
                </div >
            )
        }
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
