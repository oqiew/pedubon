
import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Topnav from '../top/Topnav';
import '../../App.css';

export default class Select_ban extends Component {
    constructor(props) {
        super(props);
        this.tbProvinces = firebase.firestore().collection('PROVINCES');
        this.tbDistricts = firebase.firestore().collection('DISTRICTS');
        this.tbLGOs = firebase.firestore().collection('LGOS');
        this.tbBANs = firebase.firestore().collection('BANS');
        this.state = {
            //input data profile
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',



            select_ban: '',
            add_ban: '',
            sProvince_ID: '',
            sDistrict_ID: '',
            sLGO_ID: '',
            sBan_ID: '',
            sBan: '',
            Provinces: [],
            Districts: [],
            LGOs: [],
            Bans: [],

            alert_save: '',

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
                let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                if (Area_ID !== '') {
                    this.unsubscribe = this.tbDistricts.onSnapshot(this.getDistricts);
                    this.unsubscribe = this.tbLGOs.onSnapshot(this.getLGOs);
                    this.unsubscribe = this.tbBANs.onSnapshot(this.getBans);
                    firebase.firestore().collection('BANS').doc(Area_ID).get().then((doc) => {
                        if (doc.exists) {
                            const { Province_ID, District_ID, LGO_ID } = doc.data();
                            this.setState({
                                sProvince_ID: Province_ID,
                                sDistrict_ID: District_ID,
                                sLGO_ID: LGO_ID,
                                sBan_ID: doc.id,
                            })

                        }
                    })
                }
                this.setState({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday: bd, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,


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
                    authEmail: user.email,
                    User_ID: user.uid,
                });

                this.getUser(user.uid);

            } else {
                this.setState({ statusLogin: false, authEmail: '' });
            }
        });


    }
    componentDidMount() {
        this.authListener();
        this.unsubscribe = this.tbProvinces.onSnapshot(this.getProvinces);

    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

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
    getLGOs = (querySnapshot) => {
        const LGOs = [];
        querySnapshot.forEach(doc => {
            const { Name, Type } = doc.data();

            LGOs.push({
                Key: doc.id,
                Name: Type + Name,
            });

        });

        this.setState({
            LGOs
        })
    }
    getBans = (querySnapshot) => {
        const Bans = [];
        querySnapshot.forEach(doc => {
            const { Name } = doc.data();

            Bans.push({
                Key: doc.id,
                Name: Name,
            });

        });

        this.setState({
            Bans
        })
    }
    onSelectProvince = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        console.log(this.state.sProvince_ID)
        this.unsubscribe = this.tbDistricts.where('Province_ID', '==', this.state.sProvince_ID).onSnapshot(this.getDistricts);
    }
    onSelectDistrict = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        this.unsubscribe = this.tbLGOs.where('District_ID', '==', this.state.sDistrict_ID).onSnapshot(this.getLGOs);
    }
    onSelectLGO = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        this.unsubscribe = this.tbBANs.where('LGO_ID', '==', this.state.sLGO_ID).onSnapshot(this.getBans);
    }
    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.add_ban) {
            const { sProvince_ID, sDistrict_ID, sLGO_ID, sBan } = this.state;
            firebase.firestore().collection('BANS').add({
                Province_ID: sProvince_ID, District_ID: sDistrict_ID, LGO_ID: sLGO_ID, Name: sBan
            }).then((doc) => {
                this.setState({ alert_save: "บันทึกสำเร็จ" })
            }).catch((error) => {
                this.setState({ alert_save: "บันทึกไม่สำเร็จ" })
            })
        } else {
            firebase.firestore().collection('USERS').doc(this.props.match.params.id).update({
                Area_ID: this.state.sBan_ID,
            }).then((doc) => {
                this.setState({ alert_save: "เลือกสำเร็จ" })
            }).catch((error) => {
                this.setState({ alert_save: "เลือกไม่สำเร็จ" })
            })
        }

    }

    render() {
        const { Provinces, Districts, LGOs, Bans } = this.state;
        const { sProvince_ID, sDistrict_ID, sLGO_ID, sBan_ID, sBan } = this.state;
        return (
            <div>
                <Topnav></Topnav>
                <div className="main_component">
                    <center>
                        <form onSubmit={this.onSubmit}>

                            <Form.Group as={Row}>
                                <Form.Label column sm="2">เลือก จังหวัด</Form.Label>
                                <Col sm="10">
                                    <select className="form-control" id="sel1" name="sProvince_ID" value={sProvince_ID} onChange={this.onSelectProvince} required>
                                        <option key='0' value="">เลือก จังหวัด</option>
                                        {Provinces.map((data, i) =>
                                            <option key={i + 1} value={data.Key}>{data.Name}</option>
                                        )}

                                    </select>
                                </Col>

                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">เลือก อำเภอ</Form.Label>
                                <Col sm="10">
                                    <select className="form-control" id="sel1" name="sDistrict_ID" value={sDistrict_ID} onChange={this.onSelectDistrict} required>
                                        <option key='0' value="">เลือก อำเภอ</option>
                                        {Districts.map((data, i) =>
                                            <option key={i + 1} value={data.Key}>{data.Name}</option>
                                        )}

                                    </select>
                                </Col>

                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column sm="2">เลือก อปท.</Form.Label>
                                <Col sm="10">
                                    <select className="form-control" id="sel1" name="sLGO_ID" value={sLGO_ID} onChange={this.onSelectLGO} required>
                                        <option key='0' value="">เลือก อปท.</option>
                                        {LGOs.map((data, i) =>
                                            <option key={i + 1}
                                                value={data.Key}>{data.Name}</option>
                                        )}

                                    </select>
                                </Col>
                            </Form.Group>

                            {this.state.add_ban ?
                                <div>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">ชื่อหมู่บ้าน</Form.Label>
                                        <Col sm="10">
                                            <input type="text" className="form-control" name="sBan" placeholder="ไม่ต้องใส่ บ้าน"
                                                value={sBan} onChange={this.onChange} required />
                                        </Col>


                                    </Form.Group>
                                    <button type="submit" className="btn btn-success" >เพิ่มหมู่บ้าน</button>
                                    <button type="button" onClick={() => this.setState({ add_ban: false })} className="btn btn-danger" >กลับ</button>
                                </div>
                                :
                                <div>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">เลือกหมู่บ้าน</Form.Label>
                                        <Col sm="10">
                                            <select className="form-control" id="sel1" name="sBan_ID" value={sBan_ID} onChange={this.onChange} required>
                                                <option key='0' value="">เลือก หมู่บ้าน</option>
                                                {Bans.map((data, i) =>
                                                    <option key={i + 1} value={data.Key}>{data.Name}</option>
                                                )}

                                            </select>
                                        </Col>


                                    </Form.Group>
                                    <button type="submit" className="btn btn-success" >เลือกหมู่บ้าน</button>
                                    <button type="button" onClick={() => this.setState({ add_ban: true })} className="btn btn-success" >เพิ่มหมู่บ้าน</button>
                                    <Link to={`/select_local`} className="btn btn-danger">กลับ</Link>
                                </div>
                            }
                            <h4>{this.state.alert_save}</h4>


                        </form>
                    </center>
                </div>
            </div>

        )


    }
}