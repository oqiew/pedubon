import React, { Component } from 'react'
import Topnav from '../../components/top/Topnav'
import Firebase from '../../Firebase';
import data_provinces from "../../data/provinces.json";
import { GetCurrentDate, isEmptyValue } from '../../components/Methods';
import { Form, Col, Row } from 'react-bootstrap';
import { tableName } from '../../database/TableConstant';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
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
            Area_PID: '', Area_DID: '', Area_SDID: '', User_type: '', Avatar_URL: '',
            Birthday: '',
            Provinces: [],
            Districts: [],
            Sub_districts: [],
            district: '',
            Province_ID: 0,
            tumbon: '',
            count: 0,
            massage: '',
            dominance: '',
            areas: [],
            query_areas: [],
            doc_ID: '',
            set_Area_ID: '',
        }
    }
    componentDidMount() {
        Firebase.firestore().collection('USERS').onSnapshot(this.getOldUser)
        Firebase.firestore().collection(tableName.Areas).onSnapshot(this.onUpdateAreas);
        this.listProvinces();
        this.listDistrict(0);
    }
    getOldUser = (query) => {
        const list_users = [];
        query.forEach((doc) => {
            list_users.push({
                ID: doc.id,
                ...doc.data()
            })
        })
        this.setState({
            list_users
        })
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

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Position, Birthday,
            Email, Avatar_URL,
            set_Area_ID, Role, User_type, doc_ID
        } = this.state;

        // if (Avatar_URL !== '' || Avatar_URL !== undefined) {
        const date = new Date(Birthday.seconds * 1000)
        const Birthday_format = ("0" + date.getDate()).slice(-2) + "-" + (parseInt(date.getMonth(), 10) + 1) + "-" + date.getFullYear();
        if (Sex != '') {

            // if (true) {
            // var temp_list_avatar_url = Avatar_URL.split(this.state.uid
            // );
            // var temp_avatar_url = temp_list_avatar_url[0] + this.state.uid
            //     + "_200x200" + temp_list_avatar_url[1];
            let temp_avatar_url = "";
            if (!isEmptyValue(Avatar_URL)) {
                temp_avatar_url = Avatar_URL
            }
            Firebase.firestore().collection(tableName.Users).doc(doc_ID).set({
                Birthday,
                Name,
                Lastname: Last_name,
                Nickname,
                Sex,
                Phone_number,
                Line_ID,
                Facebook,
                Position,
                Email,
                Avatar_URL: temp_avatar_url,
                Update_date: Firebase.firestore.Timestamp.now(),
                Create_date: Firebase.firestore.Timestamp.now(),
                Birthday_format,
                Area_ID: set_Area_ID,
                Role,
                User_type,
            }).then((d) => {
                console.log('success');
                this.setState({
                    Area_ID: '',
                    massage: 'success',
                    doc_ID: '',
                    dominance: '',
                    set_Area_ID: '',
                    areas: this.state.query_areas
                })

            }).catch(error => {
                console.log('error', error)
            })

        } else {
            this.setState({
                massage: <p style={{ color: 'red' }}>ข้อมูลไม่ครบ</p>
            })
        }

    }
    onChangeDominance = (value) => {
        const dominance = value.target.value;

        if (dominance === '') {
            return [];
        }
        const { query_areas } = this.state;
        const regex = new RegExp(`${dominance.trim()}`, 'i');
        const areas = query_areas.filter(area => area.Dominance.search(regex) >= 0)
        this.setState({
            areas,
            dominance
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
    onNext(num) {
        const { list_users } = this.state;
        if (list_users.length > 0) {
            if (num <= list_users.length) {
                console.log(list_users[num])
                this.setState({
                    Email: list_users[num].Email,
                    Avatar_URL: list_users[num].Avatar_URL,
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
                    // district: list_users[num].district,
                    User_type: list_users[num].User_type,
                    Avatar_name: '',
                    count: num + 1,
                    massage: ''
                })
            }
        }
    }


    render() {
        //step create Email
        const { Email, } = this.state;
        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Sub_district_ID,
            Role, User_type, Avatar_URL, dominance, areas, doc_ID
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
                    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}><h5>จำนวนข้อมูล {this.state.list_users.length}</h5>
                        <button type="button" className='btn btn-success' onClick={this.onNext.bind(this, this.state.count)}>next{this.state.count}</button>
                    </div>
                    <form onSubmit={this.onSubmit} >
                        <h3>{Email} </h3>
                        <hr></hr>
                        <Row>
                            {/* <Col>
                                <div style={style}>
                                    <label >เลือกรูปโปรไฟล์: <label style={{ color: "red" }}>*</label></label>

                                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                    {!this.state.Avatar_URL && <img className="avatar" alt="avatar_user" src={user} />}
                                    {this.state.Avatar_URL && <img className="avatar" alt="avatar" src={this.state.Avatar_URL} />}
                                    <h4>{this.state.Avatar_name}</h4>
                                    <h4>{this.state.uid}</h4>
                                    <br></br>
                                    <CustomUploadButton
                                        accept="image/*"
                                        filename={"user" + this.state.uid}
                                        storageRef={Firebase.storage().ref('Avatar')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                        style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4 }}
                                    >
                                        เลือกไฟล์
                    </CustomUploadButton>
                                    {this.state.massage}
                                </div>
                            </Col> */}
                            <Col sm={9}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">ภาพ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        {!isEmptyValue(Avatar_URL) && <img className="avatar" alt="avatar" src={Avatar_URL} />}
                                    </Col>
                                    <Form.Label column sm="2">doc_ID: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="doc_ID" value={doc_ID} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
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
                                            <input type="radio" name="Sex" value="ชาย" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'ชาย'} required />ชาย
                                        <input type="radio" name="Sex" value="หญิง" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'หญิง'} />หญิง
                                        <input type="radio" name="Sex" value="อื่นๆ" style={{ margin: 5 }} onChange={this.onChange} checked={Sex === 'อื่นๆ'} />อื่นๆ
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">วันเกิด: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Birthday" value={Birthday} onChange={this.onChange} required />
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
                                            onChange={(e, val) => this.setState({ set_Area_ID: val.areaID })}
                                            renderInput={(params) =>
                                                <TextField {...params} variant="outlined" />
                                            }
                                        />
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
                        <center>
                            {this.state.massage}
                            <button type="submit" className="btn btn-success">บันทึก</button>
                            <button type="button" className='btn btn-success' onClick={this.onNext.bind(this, this.state.count)}>next{this.state.count}</button>

                        </center>
                    </form>
                </div>
            </div>
        )
    }
}

export default Import_user
