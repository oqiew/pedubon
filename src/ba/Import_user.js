import React, { Component } from 'react'
import Topnav from '../components/top/Topnav'
import XLSX from 'xlsx';
import { make_cols } from '../components/excel/MakeColumns';
import SheetJSFT from '../components/excel/Excel_type';
import Firebase from '../Firebase';
import data_provinces from "../data/provinces.json";
import { GetCurrentDate, isEmptyValue } from '../components/Methods';
import { Form, Col, Row } from 'react-bootstrap';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import user from '../assets/user.png';
export class Import_user extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            list_users: [],

            Email: '',
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '',
            Area_PID: '', Area_DID: '', Area_SDID: '', User_type: '',
            Provinces: [],
            Districts: [],
            Sub_districts: [],
            district: '',
            Province_ID: 0,
            tumbon: '',
            count: 0,
        }
    }
    componentDidMount() {
        this.listProvinces();
        this.listDistrict(0);
        console.log(data_provinces)
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
        console.log(pid, did)
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
    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };
    handleFile() {
        /* Boilerplate to set up FileReader */
        // firebase.auth().onAuthStateChanged((user) => {
        //      console.log(user)
        // })
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']) });
            let list_users = [];

            if (this.state.Tb_name !== '') {

                // const tb = Firebase.firestore().collection(this.state.Tb_name);

                this.state.data.forEach((element, i) => {

                    list_users.push({
                        Email: element.email, Name: element.name, Last_name: element.lname, Nickname: "", Sex: element.Sex, Phone_number: "0" + element.phone,
                        Line_ID: element.lineID || '', Facebook: element.facebook || '', Position: element.userPosition, Department: element.department,
                        // Province_ID:element., District_ID:element., Sub_district_ID:element., 
                        Avatar_URL: element.avatarURL,
                        Birthday: new Date(),
                        Add_date: GetCurrentDate('/'),
                        Area_ID: '',
                        Role: '',
                        User_type: element.typeUser, Area_PID: '', Area_DID: '', Area_SDID: '',
                        district: element.district,
                        tumbon: element.tumbon,
                        Avatar_name: element.nameAvatar,

                    })
                });
            }
            this.setState({
                list_users,
            })


        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Position, Department, Password,
            Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
            Area_ID, Role, User_type, Area_PID, Area_DID, Area_SDID
        } = this.state;

        console.log(this.state)
        if (!isEmptyValue(this.state.User_ID)) {
            Firebase.firestore().collection('USERS').doc(this.state.User_ID).set({
                Birthday: new Date(),
                Name, Last_name, Nickname, Sex, Phone_number,
                Line_ID, Facebook, Position, Department,
                Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                Add_date: GetCurrentDate("/"), Area_ID, Role, User_type, Area_PID, Area_DID, Area_SDID,
            }).then((d) => {

                Firebase.auth()
                    .signOut()
                    .then(() => {
                        this.setState({
                            User_ID: ''
                        })

                    }
                    );
            }).catch(error => {
                console.log('error', error)
            })
        }
    }
    onLogin = (e) => {
        e.preventDefault();
        const { Email } = this.state;
        Firebase.auth().createUserWithEmailAndPassword(Email, '12345678')
            .then(doc => {
                this.setState({
                    User_ID: doc.user.uid
                })
            }).catch(error => {
                console.log('error', error)
            })
    }
    onNext(num) {
        const { list_users } = this.state;

        if (num <= list_users.length) {
            console.log(list_users[num])
            this.setState({
                Email: list_users[num].Email,
                Name: list_users[num].Name,
                Last_name: list_users[num].Last_name,
                Nickname: list_users[num].Nickname,
                Sex: list_users[num].Sex,
                Phone_number: list_users[num].Phone_number,
                Line_ID: list_users[num].Line_ID,
                Facebook: list_users[num].Facebook,
                Birthday: list_users[num].Birthday,
                Position: list_users[num].Position,
                Department: list_users[num].Department,
                district: list_users[num].district,
                tumbon: list_users[num].tumbon,
                // District_ID: list_users[num].Name,
                district: list_users[num].district,
                User_type: list_users[num].User_type,
                Avatar_URL: list_users[num].Avatar_URL,
                Avatar_name: list_users[num].Avatar_name,
                count: num + 1,


            })
        }
    }

    render() {
        //step create Email
        const { Email, } = this.state;
        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Sub_district_ID,
            Role, User_type,
        } = this.state;
        const style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }
        const { Provinces, Districts, Sub_districts } = this.state;
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    <label htmlFor="file">Upload an excel to Process Triggers</label>
                    <br />
                    <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange.bind(this)} />
                    <button type="button" className='btn btn-success' onClick={this.handleFile.bind(this)}>โหลดข้อมูล</button>

                    <hr></hr>
                    <center><h1>จำนวนข้อมูล {this.state.list_users.length}</h1></center>
                    <button type="button" className='btn btn-success' onClick={this.onNext.bind(this, this.state.count)}>next{this.state.count}</button>
                    <button type="button" className="btn btn-success" onClick={this.onLogin.bind(this)}>เข้าสู่ระบบ</button>
                    <hr></hr>
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
                                    <h4>{this.state.Avatar_name}</h4>
                                    <h4>{this.state.User_ID}</h4>
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
                                        <input type="text" className="form-control" name="Facebook" value={Facebook || ''} onChange={this.onChange} />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">LIne ID: </Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Line_ID" value={Line_ID || ''} onChange={this.onChange} />
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
                                        <select className="form-control" id="Province_ID" name="Province_ID" value={0} onChange={this.onSelectProvince} required>
                                            <option key='0' value=""></option>
                                            {Provinces.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>
                                            )}

                                        </select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">{this.state.district}: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="District_ID" name="District_ID" value={District_ID} onChange={this.onSelectDistrict} required>
                                            <option key='0' value=""></option>
                                            {Districts.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>
                                            )}

                                        </select>
                                    </Col>
                                    <Form.Label column sm="2">{this.state.tumbon}: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="Sub_district_ID" name="Sub_district_ID" value={Sub_district_ID} onChange={this.onChange} required>
                                            <option key='0' value=""></option>
                                            {Sub_districts.map((data, i) =>
                                                <option key={i + 1} value={data.Key}>{data.value}</option>

                                            )}

                                        </select>
                                    </Col>
                                </Form.Group>


                                {this.state.Role === "admin" ?
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
                        </center>
                    </form>
                </div>
            </div>
        )
    }
}

export default Import_user
