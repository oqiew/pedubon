import { Form, Row, Col, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import React from 'react'

import firebase from "../../firebase";
import Topnav from '../top/Topnav';

import '../../App.css';

//img
import Idelete from '../../assets/trash_can.png';
import Iedit from '../../assets/pencil.png';
class Local_calendar extends React.Component {
    constructor(props) {
        super(props);
        this.tbLocalCalendar = firebase.firestore().collection('LOCAL_CALENDARS');
        //getl);
        this.state = {
            status_add: false,
            Ban_name: '',
            edit_ID: '',


            //data class
            dataCalendar1: [],
            dataCalendar2: [],
            statusSave: "",
            Month1: "",
            Month2: "",
            mouth: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            showMouth1: [],
            showMouth2: [],
            Name_activity: "",
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
        this.unsubscribe = this.tbLocalCalendar.onSnapshot(this.onCollectionUpdate);
        // this.genrateMonth();
    }
    onCollectionUpdate = (querySnapshot) => {
        const dataCalendar1 = [];
        const dataCalendar2 = [];
        var count = 1;
        dataCalendar1.push(<tr key={0} style={{ backgroundColor: "#e9a58a" }}><td><strong>#</strong></td><td><strong>เศรษฐกิจ</strong></td>
            <td colSpan={13}></td>
        </tr>)
        dataCalendar2.push(<tr key={0} style={{ backgroundColor: "#e9a58a" }}><td><strong>#</strong></td><td><strong>วัฒนธรรมประเพณี</strong></td>
            <td colSpan={13}></td>
        </tr>)
        querySnapshot.forEach((doc) => {
            const { Name_activity, Month1, Month2, Type_activity } = doc.data();
            const mn1 = parseInt(Month1, 10);
            const mn2 = parseInt(Month2, 10);
            var temp = [];
            temp.push(<td key={0}>{count} </td>);
            temp.push(<td key={1}>{Name_activity}</td>);

            if (Type_activity === 'เศรษฐกิจ') {
                for (let index = 1; index <= 12; index++) {

                    if (index === mn1) {
                        temp.push(<td key={index + 1} colSpan={mn2 - mn1 + 1} bgcolor="#8ef21b"></td>)
                        index = mn2;
                    } else {

                        temp.push(<td key={index + 1}></td>);
                    }

                }

                temp.push(<td key={14}>
                    <img alt="edit" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Iedit} onClick={this.edit.bind(this, doc.id)}></img>
                    <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                </td>);

                dataCalendar1.push(<tr key={count}>{temp}</tr>);
            } else {

                for (let index = 1; index <= 12; index++) {

                    if (index === mn1) {
                        temp.push(<td key={index + 1} colSpan={mn2 - mn1 + 1} bgcolor="#0693e3"></td>)
                        index = mn2;
                    } else {

                        temp.push(<td key={index + 1}></td>);
                    }

                }

                temp.push(<td key={14}>
                    <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="edit" src={Iedit} onClick={this.edit.bind(this, doc.id)}></img>
                    <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="delete" src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>

                </td>);

                dataCalendar2.push(<tr key={count}>{temp}</tr>);
            }



            count++;
        });
        this.setState({
            dataCalendar1,
            dataCalendar2
        });
    }

    delete(id) {
        firebase.firestore().collection('LOCAL_CALENDARS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(id) {
        firebase.firestore().collection('LOCAL_CALENDARS').doc(id).get().then((doc) => {
            const { Name_activity, Month1, Month2, Type_activity } = doc.data();
            const mouth = this.state;
            const showMouth2 = [];
            for (let index = Month1; index <= 12; index++) {
                showMouth2.push(<option key={index} value={index}>{mouth[index - 1]}</option>);

            }
            this.setState({
                Name_activity, Month1, Month2, Type_activity, edit_ID: id, showMouth2
            })


        }).catch((error) => {
            console.error("Error document: ", error);
        });
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Month1: '', Month2: '', Type_activity: '', edit_ID: ''
        })
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
        this.genrateMonth();

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
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

        this.genrateMonth();


    }
    genrateMonth() {
        const showMouth1 = [], showMouth2 = [];
        const { mouth, Month1 } = this.state;
        const mn1 = parseInt(Month1, 10);

        for (let index = 1; index <= 12; index++) {
            showMouth1.push({
                Key: index,
                value: mouth[index - 1]
            })
        }

        for (let index = mn1; index <= 12; index++) {
            showMouth2.push({
                Key: index,
                value: mouth[index - 1]
            })

        }
        this.setState({
            showMouth1,
            showMouth2
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { Name_activity, Month1, Month2, User_ID, Type_activity, Area_ID, Name, edit_ID } = this.state;

        if (edit_ID !== '') {
            this.tbLocalCalendar.doc(edit_ID).set({
                Name_activity, Type_activity
                , Month1, Month2, Informer_ID: User_ID, Informer_name: Name
                , Area_ID
            }).then((docRef) => {
                this.setState({
                    Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                    statusSave: '2', edit_ID: ''
                });

            }).catch((error) => {
                this.setState({
                    statusSave: '3',
                });
                console.error("Error adding document: ", error);
            });

        } else {
            this.tbLocalCalendar.add({
                Name_activity, Type_activity
                , Month1, Month2, Informer_ID: User_ID, Informer_name: Name
                , Area_ID
            }).then((docRef) => {
                this.setState({
                    Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                    statusSave: '2',
                });

            }).catch((error) => {
                this.setState({
                    statusSave: '3',
                });
                console.error("Error adding document: ", error);
            });

        }

    }

    render() {
        const { Month1, Month2, Name_activity, Type_activity } = this.state;
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
            <div >
                <Topnav></Topnav>
                <div className='main_component'>
                    <center>
                        <h2><strong>ปฏิทินชุมชน : {this.state.Ban_name}</strong> </h2>
                        <hr></hr>

                        <form onSubmit={this.onSubmit}>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">ชื่อ</Form.Label>
                                <Col sm="4">
                                    <input type="text" className="form-control" placeholder="ชื่อ กิจกรรม ประเพณี หรือสิ่งที่ทำ"
                                        name="Name_activity" value={Name_activity} onChange={this.onChange} required />
                                </Col>
                                <Form.Label column sm="2">กลุ่มกิจกรรม</Form.Label>
                                <Col sm="4">
                                    <select className="form-control" name="Type_activity" value={Type_activity} onChange={this.onChange} required >
                                        <option value=""></option>
                                        <option value="วัฒนธรรมประเพณี">วัฒนธรรมประเพณี</option>
                                        <option value="เศรษฐกิจ">เศรษฐกิจ</option>
                                    </select>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>

                                <Form.Label column sm="2">เดือนที่เริ่ม</Form.Label>
                                <Col sm="4">
                                    <select className="form-control" name="Month1" value={Month1} onChange={this.onChange} required>
                                        <option value=""></option>
                                        {this.state.showMouth1}
                                    </select>
                                </Col>
                                <Form.Label column sm="2">เดือนที่สิ้นสุด</Form.Label>
                                <Col sm="4">
                                    <select className="form-control" name="Month2" value={Month2} onChange={this.onChange} required>
                                        <option value=""></option>
                                        {this.state.showMouth2}


                                    </select>
                                </Col>
                            </Form.Group>

                            <button type="submit" className="btn btn-success"
                                style={{ borderRadius: "4px" }}>บันทึกข้อมูล</button>
                            {this.state.edit_ID !== '' ?
                                <button type="button" className="btn btn-danger" onClick={this.cancelEdit.bind(this)}
                                    style={{ borderRadius: "4px" }}>ยกเลิก</button> : ""}

                            <Link to={'/main_seven_tools'} className="btn btn-danger">กลับ</Link>
                            <br></br>{showStatus}
                        </form>
                        <Table bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>รายการ</th>
                                    <th>ม.ค.</th>
                                    <th>ก.พ.</th>
                                    <th>มี.ค.</th>
                                    <th>เม.ย.</th>
                                    <th>พ.ค.</th>
                                    <th>มิ.ย.</th>
                                    <th>ก.ค.</th>
                                    <th>ส.ค.</th>
                                    <th>ก.ย.</th>
                                    <th>ต.ค.</th>
                                    <th>พ.ย.</th>
                                    <th>ธ.ค.</th>
                                    <th>แก้ไข</th>

                                </tr>
                            </thead>
                            <tbody>
                                {this.state.dataCalendar1}
                                {this.state.dataCalendar2}
                            </tbody>
                        </Table>

                    </center>

                </div>
            </div >
        );
    }
}

export default Local_calendar;
