import { Form, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import React from 'react'

import "react-datepicker/dist/react-datepicker.css";

import firebase from "../../firebase";
import Topnav from '../top/Topnav';

//img
import Idelete from '../../assets/trash_can.png';
import Iedit from '../../assets/pencil.png';
import Izoom from '../../assets/zoom.png';
class Persons extends React.Component {
    constructor(props) {
        super(props);
        this.tbUserHome = firebase.firestore().collection('SOCIAL_MAPS');
        //getl);
        this.state = {
            users: [],
            statusSave: "",

            //data
            HName: '', HLastname: '', Haddress: '',
            HAge: '', HCareer: '',
            listLifeStorys: [],
            //data
            status_add: false,
            Ban_name: '',
            edit_ID: '',
            //getuser
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',
        }

    }

    componentDidMount() {
        this.authListener();
        this.unsubscribe = this.tbUserHome.where('Geo_map_type', '==', 'home').onSnapshot(this.onCollectionUpdate);
    }
    authListener() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                this.setState({
                    statusLogin: true,
                    authEmail: user.email,
                    User_ID: user.uid
                });

                this.getUser(user.uid);

            } else {
                this.setState({ statusLogin: false, authEmail: '' });
            }
        });
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
                this.checkBansName(Area_ID);
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
    checkBansName(id) {
        var docref = firebase.firestore().collection('BANS').doc(id);

        docref.get().then((doc) => {

            const { Name } = doc.data();
            console.log(Name);
            this.setState({
                Ban_name: Name
            })
        })


    }
    delete(id) {
        firebase.firestore().collection('SOCIAL_MAPS').doc(id).get().then((doc) => {
            if (doc.exists) {
                var desertRef = firebase.storage().refFromURL(doc.data().Map_iamge_URL);
                desertRef.delete().then(function () {
                    firebase.firestore().collection('SOCIAL_MAPS').doc(id).delete().then(() => {
                        console.log("delete user and image sucess");

                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }).catch(function (error) {
                    console.log("image No such document! ");
                });
            } else {
                console.log("user No such document! " + id);
            }

        });

    }
    edit(id) {
        firebase.firestore().collection('SOCIAL_MAPS').doc(id).get().then((doc) => {
            const { HName, HLastname, HAddress,
                HAge, HCareer, Geo_map_description, } = doc.data();
            if (HName === '' || HLastname === '' || HAddress === '' ||
                HAge === '' || HCareer === '' || HName === undefined || HLastname === undefined || HAddress === undefined ||
                HAge === undefined || HCareer === undefined) {
                this.setState({
                    Geo_map_description, edit_ID: id
                })
            } else {
                console.log('edit')
                this.setState({
                    HName, HLastname, HAddress,
                    HAge, HCareer, Geo_map_description, edit_ID: id
                })
            }


        }).catch((error) => {
            console.error("Error document: ", error);
        });
    }
    cancelEdit = (e) => {
        this.setState({
            HName: '', HLastname: '', HAddress: '',
            HAge: '', HCareer: '', Geo_map_description: '', edit_ID: ''
        })
    }
    onCollectionUpdate = (querySnapshot) => {
        const listLifeStorys = [];

        querySnapshot.forEach((doc) => {
            const { Informer_name, HAddress, HAge, HCareer,
                Map_iamge_URL, Geo_map_name, Geo_map_description, HName, HLastname } = doc.data();

            // var temp = parseInt();
            // console.log(HName)
            listLifeStorys.push({
                img: <img src={Map_iamge_URL} alt="mapURL" style={{ width: 50, height: 50 }}></img>,
                Geo_map_name,
                HName,
                HLastname,
                HAddress,
                HAge,
                HCareer,
                Geo_map_description,
                Informer_name,
                edit: <div>
                    {HName !== undefined ? <Link to={`/person_historys/${doc.id}/${HName}`}><img alt="zoom" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Izoom} ></img></Link> : <div></div>}
                    <img alt="edit" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Iedit} onClick={this.edit.bind(this, doc.id)}></img>
                    <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                </div>
            });

        });

        this.setState({
            listLifeStorys
        });
    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }

    onSubmit = (e) => {
        e.preventDefault();
        const { HName, HLastname, HAddress, HAge,
            HCareer, Geo_map_description, Area_ID, edit_ID, Name, User_ID } = this.state;

        this.tbUserHome.doc(edit_ID).update({
            Informer_name: Name,
            Geo_ban_ID: Area_ID,
            HName,
            HLastname,
            HAddress,
            HAge,
            HCareer,
            Geo_map_description,
            Informer_ID: User_ID

        }).then((result) => {
            this.setState({
                HName: '',
                HLastname: '',
                HAddress: '',
                HAge: '',
                HCareer: '',
                Geo_map_description: '',
                edit_ID: '',
            })
        }).catch((error) => {
            console.log(error);
        });



    }
    render() {
        const { HName, HLastname, HAddress,
            HAge, HCareer, Geo_map_description, Ban_name } = this.state;
        let showStatus;

        if (this.state.statusSave === '2') {
            showStatus = <h6 className="text-success">บันทึกสำเร็จ</h6>;
        } else if (this.state.statusSave === '3') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ</h6>;
        } else if (this.state.statusSave === '4') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ เลือกปีให้ถูกต้อง</h6>;
        } else {
            showStatus = "";
        }
        const data = {
            columns: [
                {
                    label: '#',
                    field: 'img',
                    sort: 'asc',
                },
                {
                    label: 'ชื่อในชุมชน',
                    field: 'Geo_map_name',
                    sort: 'asc',
                },
                {
                    label: 'ชื่อ',
                    field: 'HName',
                    sort: 'asc',
                },
                {
                    label: 'นามสกุล',
                    field: 'HLastname',
                    sort: 'asc',
                },
                {
                    label: 'ที่อยู่',
                    field: 'HAddress',
                    sort: 'asc',
                },
                {
                    label: 'อายุ',
                    field: 'HAge',
                    sort: 'asc',
                },
                {
                    label: 'อาชีพ',
                    field: 'HCareer',
                    sort: 'asc',
                },
                {
                    label: 'บริบทในชุมชน',
                    field: 'Geo_map_description',
                    sort: 'asc',
                },
                {
                    label: 'ผู้เพิ่มข้อมูล',
                    field: 'Informer_name',
                    sort: 'asc',
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                }
            ],
            rows: this.state.listLifeStorys
        }

        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    <center>
                        <h2><strong>ประวัติชีวิต : {Ban_name}</strong> </h2>
                        <hr></hr>
                        <h4><strong>รายชื่อบุคคลที่น่าสนใจในชุมชน</strong> </h4>
                        <br></br>
                        <MDBDataTable
                            striped
                            bordered
                            small
                            searchLabel="ค้นหา"
                            paginationLabel={["ก่อนหน้า", "ถัดไป"]}
                            infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
                            entriesLabel="แสดง รายการ"
                            data={data}

                        />
                        <hr></hr>

                        {this.state.edit_ID !== '' ?
                            <div>
                                <h4><strong>แก้ไขข้อมูลบุคคลน่าสนใจในชุมชน</strong> </h4>
                                <br></br>
                                <form onSubmit={this.onSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">ชื่อ <label style={{ color: "red" }}>*</label></Form.Label>
                                                <Col>
                                                    <input type="text" className="form-control" placeholder="ชื่อ"
                                                        name="HName" value={HName} onChange={this.onChange} required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">นามสกุล <label style={{ color: "red" }}>*</label> </Form.Label>
                                                <Col>
                                                    <input type="text" className="form-control" placeholder="นามสกุล"
                                                        name="HLastname" value={HLastname} onChange={this.onChange} required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">ที่อยู่ <label style={{ color: "red" }}>*</label></Form.Label>
                                                <Col>
                                                    <div className="form-group">
                                                        <textarea className="form-control" name="HAddress" value={HAddress} onChange={this.onChange}
                                                            placeholder="บ้านเลขที่ หมู่บ้าน" cols="80" rows="5" required>{HAddress}</textarea>
                                                    </div>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">อายุ <label style={{ color: "red" }}>*</label> </Form.Label>

                                                <Col >
                                                    <input type="number" className="form-control" placeholder="อายุ"
                                                        name="HAge" value={HAge} onChange={this.onChange} required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">อาชีพ <label style={{ color: "red" }}>*</label> </Form.Label>
                                                <Col>
                                                    <input type="text" className="form-control" placeholder="อาชีพ"
                                                        name="HCareer" value={HCareer} onChange={this.onChange} required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">บทบาทในชุมชน <label style={{ color: "red" }}>*</label> </Form.Label>
                                                <Col>
                                                    <div className="form-group">
                                                        <textarea className="form-control" name="Geo_map_description" value={Geo_map_description} onChange={this.onChange}
                                                            placeholder="คำอธิบาย บทบาท ความสัมพันธ์ ในชุมชน"
                                                            cols="80" rows="5" required>{Geo_map_description}</textarea>
                                                    </div>

                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Row>
                                    <button type="submit" className="btn btn-success"
                                        style={{ borderRadius: "4px" }}>บันทึกข้อมูล</button>
                                    <button type="button" className="btn btn-danger" onClick={this.cancelEdit.bind(this)}
                                        style={{ borderRadius: "4px" }}>ยกเลิก</button>
                                    <br></br>{showStatus}
                                </form>
                            </div>

                            :
                            <div>
                                <Link to={'/main_seven_tools'} className="btn btn-danger">กลับ</Link>
                            </div>

                        }

                    </center>
                </div>
            </div >
        );
    }
}

export default Persons;
