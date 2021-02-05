import React, { Component } from 'react'
import { connect } from 'react-redux'
import Firebase from '../../../Firebase'
import { fetch_user_network } from '../../../actions'
import Loading from '../../../components/Loading'
import { isEmptyValue, isEmptyValues } from '../../../components/Methods'
import { TopBar } from '../../topBar/TopBar'
import Resizer from 'react-image-file-resizer';
import temp_avatar from '../../../assets/user.png';
import { Form, Col, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { tableName } from '../../database/TableName'
import { routeName } from '../../../route/RouteConstant'
import { confirmAlert } from 'react-confirm-alert'; // Import
export class Profile extends Component {
    //status 1 = new , 2 = view ,3 = edit
    constructor(props) {
        super(props)
        this.tbUserNetwork = Firebase.firestore().collection(tableName.UserNetwork);
        if (!isEmptyValue(this.props.fetchReducer.user_network.Name)) {
            this.state = {
                loading: false,
                ...this.props.fetchReducer.user_network,
                status: 2,
                Birthday2: new Date(this.props.fetchReducer.user_network.Birthday.seconds * 1000),
                changeBirthday: false,
                avatar_uri: this.props.fetchReducer.user_network.Avatar_URL
            }
        } else {
            this.state = {
                loading: false,
                ...this.props.fetchReducer.user_network,
                status: 1,
                avatar_uri: '',
                Avatar_URL: '',
                Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
                Birthday: '',
            }
        }

    }

    onSubmit = async (e) => {
        e.preventDefault();
        const { Name, Last_name, Nickname, Sex, Phone_number, Birthday2, Birthday } = this.state;
        let temp_Birtday = '';
        if (this.state.changeBirthday) {
            temp_Birtday = Birthday2
        } else {
            temp_Birtday = Birthday
        }
        this.setState({
            loading: true
        })
        let Avatar_URL = await this.uploadImage();
        if (isEmptyValue(Avatar_URL)) {
            this.setState({
                loading: false
            })
            confirmAlert({
                title: 'บันทึกไม่สำเร็จ',
                message: ' กรุณาอัพโหลดรูปภาพ',
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: 'ตกลง',

                    },

                ]
            });

        } else {
            this.tbUserNetwork.doc(this.state.uid).set({
                Name, Last_name, Nickname, Sex, Phone_number, Birthday: temp_Birtday,
                Avatar_URL, Email: this.state.email, Agency_ID: '',
                Create_date: Firebase.firestore.Timestamp.now(),
                Update_date: Firebase.firestore.Timestamp.now()
            }).then(() => {
                this.props.fetch_user_network({
                    uid: this.state.uid,
                    email: this.state.email,
                    Name, Last_name, Nickname, Sex, Phone_number, Birthday: temp_Birtday, Avatar_URL
                });
                this.setState({
                    loading: false
                })
                confirmAlert({
                    title: 'บันทึกสำเร็จ',
                    message: 'ไปยังหน้าหลัก',
                    closeOnClickOutside: true,
                    buttons: [
                        {
                            label: 'ตกลง',
                            onClick: () => this.props.history.push(routeName.HomeNetworks)
                        },

                    ]
                });
            }).catch((error) => {
                console.log('error', error)
                this.setState({
                    loading: false
                })
                confirmAlert({
                    title: 'บันทึกไม่สำเร็จ',
                    message: 'ระบบผิดพลาด',
                    closeOnClickOutside: true,
                    buttons: [
                        {
                            label: 'ตกลง',

                        },

                    ]
                });

            })
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
                        avatar_uri: uri,
                    })
                }, 'base64', 200, 200);
        }
    }
    uploadImage = async () => {
        // console.log("upload image")
        return new Promise((resolve, reject) => {
            const imageRef = Firebase.storage().ref('User_network').child('user' + this.state.uid + '.jpg')
            let mime = 'image/jpg';
            // console.log(this.state.avatar_uri)
            imageRef.putString(this.state.avatar_uri, 'data_url')
                .then(() => { return imageRef.getDownloadURL() })
                .then((url) => {
                    resolve(url)
                    // this.setState({
                    //     Avatar_URL: url
                    // })
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    render() {
        const { avatar_uri, Avatar_URL } = this.state;
        const { status, Name, Last_name, Nickname, Sex, Phone_number, Birthday2, } = this.state;
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content" style={{ justifyContent: 'center ', display: 'flex' }}>
                        <form className="login100-form validate-form" onSubmit={this.onSubmit.bind(this)} style={{ width: '80%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginBottom: 20 }}>
                                {(isEmptyValue(avatar_uri) && isEmptyValue(Avatar_URL)) ?
                                    <img className="avatar" alt="avatar_user" src={temp_avatar} />
                                    : <img className="avatar" alt="avatar_user" src={avatar_uri} />}


                                <input type="file" placeholder="อัพโหลดรูปภาพของคุณ" onChange={this.fileChangedHandler} />
                            </div>
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
                                            onChange={str => this.setState({
                                                Birthday2: str, changeBirthday: true
                                            })}
                                            placeholderText="วัน/เดือน/ปี(ค.ศ.)"
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                        />
                                    </div>

                                </Col>
                                <Form.Label column sm="2">เบอร์โทรศัพท์: <label style={{ color: "red" }}>*</label></Form.Label>
                                <Col>
                                    <input type="tel" pattern="0[0-9]{1}[0-9]{8}" maxLength="10" size="10" placeholder="0XXXXXXXXX"
                                        className="form-control" name="Phone_number" value={Phone_number} onChange={this.onChange} required />
                                </Col>
                            </Form.Group>
                            <center>
                                <button type="submit" className="login100-form-btn" style={{ width: 150 }}>บันทึก</button>
                            </center>
                        </form>
                    </div>
                </div>
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
    fetch_user_network
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);