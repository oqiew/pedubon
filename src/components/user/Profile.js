

import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { Component } from 'react'

import "react-datepicker/dist/react-datepicker.css"

import firebase from '../../firebase';
import { GetTypeUser } from '../methods';
import Topnav from '../top/Topnav';

import '../../App.css';

//img

import cw from '../../assets/children_walk.gif';
import Store from '../../Store';
export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbProvinces = firebase.firestore().collection('PROVINCES');
        this.tbDistricts = firebase.firestore().collection('DISTRICTS');
        this.tbTumbons = firebase.firestore().collection('TUMBONS');
        this.state = {

            //input data profile
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',

            //get name form id
            Province: '', District: '', Tumbon: '', User_type: '',

            Provinces: [],
            Districts: [],
            Tumbons: [],
            User_types: GetTypeUser(),
            User: [],

        }

        Store.subscribe(() => {
            this.setState({
                User: Store.getState().User, loading: false
            })
        });
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
    checkName(name, id) {
        var result = '';
        if (name === "p") {
            this.state.Provinces.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "d") {
            this.state.Districts.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "t") {
            this.state.Tumbons.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "u") {
            this.state.User_types.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        }
        return result;
    }
    getUser(id) {

        firebase.firestore().collection('USERS').doc(id).get().then((doc) => {
            if (doc.exists) {
                const { Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,

                } = doc.data()
                const User_type = this.checkName('u', User_type_ID);
                const Province = this.checkName('p', Province_ID);
                const District = this.checkName('d', District_ID);
                const Tumbon = this.checkName('t', Tumbon_ID);
                var d1 = new Date(Birthday.seconds * 1000);
                let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                this.setState({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday: bd, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,
                    Province, District, Tumbon, User_type

                })
            }
        }
        );
    }
    authListener() {
        this.unsubscribe = this.tbProvinces.onSnapshot(this.getProvinces);
        this.unsubscribe = this.tbDistricts.onSnapshot(this.getDistricts);
        this.unsubscribe = this.tbTumbons.onSnapshot(this.getTumbons);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    statusLogin: true,
                    authEmail: user.email,
                    User_ID: user.uid,
                });

                this.getUser(user.uid);

            } else {
                this.setState({ statusLogin: false, authEmail: '' });
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






    render() {

        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Avatar_URL,

        } = this.state;

        const { Province, District, Tumbon, User_type } = this.state;


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
                <Topnav user={this.state.User}></Topnav>
                <div className='main_component'>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <div>
                            {Avatar_URL && <img className="avatar" alt="avatar" style={{ marginRight: 30 }} src={Avatar_URL} />}
                        </div>
                        <div style={{ flexDirection: 'column' }}>
                            <h4 style={{ padding: 5 }}><strong>ชื่อ : </strong>{Name} {Last_name}<strong> ชื่อเล่น : </strong>{Nickname}<strong> เพศ : </strong>{Sex}<strong>  วันเกิด : </strong>{Birthday}</h4>
                            <h4 style={{ padding: 5 }}><strong>ประเภทผู้ใช้ : </strong>{User_type}<strong>  เบอร์โทรศัพท์มือถือ : </strong>{Phone_number}</h4>
                            <h4 style={{ padding: 5 }}><strong>Facebook : </strong>{Facebook}<strong>  Line_ID : </strong>{Line_ID}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำแหน่ง : </strong>{Position}<strong>  หน่วยงาน : </strong>{Department}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำบล : </strong>{Tumbon}<strong>  อำเภอ : </strong>{District}<strong> จังหวัด : </strong>{Province}</h4>
                        </div>

                    </div>
                    <Row>



                    </Row>
                    <center><Link className="btn btn-success" to={'/register'}>แก้ไข</Link>
                        {showStatus}
                        <br></br>
                        <img src={cw} alt="bg_gif" style={{ width: '50%', height: '50%' }}></img>
                    </center>
                    <div style={{ right: 0 }}>

                    </div>
                </div>
            </div>
        )
    }
}

export default Register
