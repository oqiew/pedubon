import { Form, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { MDBDataTable, } from 'mdbreact';
import React from 'react'
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react';

import firebase from "../../firebase";
import Topnav from '../top/Topnav';

import '../../App.css';

//img
import Idelete from '../../assets/trash_can.png';
import Iedit from '../../assets/pencil.png';
class Local_historys extends React.Component {
    constructor(props) {
        super(props);
        this.tbLocalHistory = firebase.firestore().collection('LOCAL_HISTORYS');
        //getl);
        this.state = {
            dataTimeline: [],
            localHistorys: [],
            statusSave: "",

            listYear: [],
            //data
            Name_activity: "",
            Description: "",
            Year_start: "",

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
        this.unsubscribe = this.tbLocalHistory.onSnapshot(this.onCollectionUpdate);
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
            this.setState({
                Ban_name: Name
            })
        })


    }
    delete(id) {
        firebase.firestore().collection('LOCAL_HISTORYS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(id) {
        firebase.firestore().collection('LOCAL_HISTORYS').doc(id).get().then((doc) => {
            const { Name_activity, Description, Year_start } = doc.data();
            this.setState({
                Name_activity, Description, Year_start, edit_ID: id
            })

        }).catch((error) => {
            console.error("Error document: ", error);
        });
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Description: '', Year_start: '', edit_ID: ''
        })
    }
    onCollectionUpdate = (querySnapshot) => {

        const dataTimeline = [];
        const localHistorys = [];
        var count = 1;

        querySnapshot.forEach((doc) => {
            const { Name_activity, Year_start, Description, Informer_name } = doc.data();

            localHistorys.push({
                Name_activity, Description, Year_start, Informer_name,
                edit: <div>
                    <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="edit" src={Iedit} onClick={this.edit.bind(this, doc.id)}></img>
                    <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="delete" src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                </div>
            });



            count++;
        });

        this.setState({
            localHistorys
        });
        this.sortBy('Year_start');
        //sort show timeline
        var listYear = ["0"];
        count = 0;
        // console.log(this.state.localHistorys);
        this.state.localHistorys.forEach(element => {
            var temp = false;
            listYear.forEach(e => {
                if (e === element.Year_start) {
                    temp = false;
                } else {
                    listYear.push(element.Year_start);
                    temp = true;
                    return;
                }
            });

            if (temp) {
                dataTimeline.push(
                    <TimelineItem
                        key={count++}
                        dateText={element.Year_start}
                        style={{ color: '#e86971' }}
                    >
                        <h1>{element.Name_activity}</h1>
                        <p>{element.Description}</p>
                    </TimelineItem>);
            } else {
                dataTimeline.push(
                    <TimelineItem
                        key={count++}
                        dateComponent={(
                            <div>

                            </div>
                        )}
                    >
                        <h1>{element.Name_activity}</h1>

                        <p>{element.Description}</p>
                    </TimelineItem>);
            }

        });

        this.setState({
            dataTimeline
        });

    }
    compareBy(key) {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }

    sortBy(key) {
        let arrayCopy = [...this.state.localHistorys];
        arrayCopy.sort(this.compareBy(key));
        this.setState({ localHistorys: arrayCopy });
    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }

    onSubmit = e => {
        e.preventDefault()
        const { Name_activity, Description, Year_start, Area_ID, Name, User_ID, edit_ID } = this.state;
        if (edit_ID !== '') {
            this.tbLocalHistory.doc(edit_ID).set({
                Name_activity, Description
                , Year_start, Informer_ID: User_ID, Informer_name: Name
                , Area_ID,
            }).then((docRef) => {
                this.setState({
                    Name_activity: "", Year_start: "", Description: "",
                    statusSave: '2', edit_ID: '',
                });

            })
                .catch((error) => {
                    this.setState({
                        statusSave: '3',
                    });
                    console.error("Error adding document: ", error);
                });
        } else {
            this.tbLocalHistory.add({
                Name_activity, Description
                , Year_start, Informer_ID: User_ID, Informer_name: Name
                , Area_ID,
            }).then((docRef) => {
                this.setState({
                    Name_activity: "", Year_start: "", Description: "",
                    statusSave: '2',
                });

            })
                .catch((error) => {
                    this.setState({
                        statusSave: '3',
                    });
                    console.error("Error adding document: ", error);
                });
        }




    }
    render() {
        const { Year_start, Name_activity, Description } = this.state;
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
                // {
                //     label: '#',
                //     field: 'id',
                //     sort: 'asc',
                // },
                {
                    label: 'ชื่อกิจกรรม',
                    field: 'Name_activity',
                    sort: 'asc',
                },
                {
                    label: 'ข้อมูลกิจกรรม',
                    field: 'Description',
                    sort: 'asc',
                },
                {
                    label: 'ปีที่เริ่ม',
                    field: 'Year_start',
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
            rows: this.state.localHistorys
        }
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    <center>
                        <h2><strong>ประวัติศาสตร์ชุมชน : {this.state.Ban_name}</strong> </h2>
                        <hr></hr>

                        <form onSubmit={this.onSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ชื่อกิจกรรม</Form.Label>
                                        <Col>
                                            <input type="text" className="form-control" placeholder="ชื่อหัวข้อ เหตุการณ์ หรือกิจกรรม"
                                                name="Name_activity" value={Name_activity} onChange={this.onChange} required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ข้อมูลกิจกรรม</Form.Label>
                                        <Col>
                                            <div className="form-group">
                                                <textarea className="form-control"
                                                    placeholder="คำอธิบาย เหตุการณ์ หรือกิจกรรมที่เกิดขึ้นกับชุมชน"
                                                    name="Description" value={Description} onChange={this.onChange}
                                                    cols="80" rows="5" required>{Description}</textarea>
                                            </div>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ปีที่เริ่ม</Form.Label>
                                        <Col>
                                            <input type="number" className="form-control" placeholder="ปีที่เริ่ม พ.ศ." maxLength={4} minLength={4}
                                                name="Year_start" value={Year_start} onChange={this.onChange} required />
                                        </Col>
                                    </Form.Group>

                                </Col>
                                <Col>
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
                                </Col>
                            </Row>
                            <button type="submit" className="btn btn-success"
                                style={{ borderRadius: "4px" }}>บันทึกข้อมูล</button>
                            {this.state.edit_ID !== '' ?
                                <button type="button" className="btn btn-danger" onClick={this.cancelEdit.bind(this)}
                                    style={{ borderRadius: "4px" }}>ยกเลิก</button> : ""}

                            <Link to={'/main_seven_tools'} className="btn btn-danger">กลับ</Link>
                            <br></br>{showStatus}
                        </form>


                        <hr></hr>

                    </center>
                    <Timeline lineColor={'#ddd'}>
                        {this.state.dataTimeline}

                    </Timeline>
                </div>
            </div >
        );
    }
}

export default Local_historys;
