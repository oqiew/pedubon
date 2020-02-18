import { Form, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import React from 'react'

import "react-datepicker/dist/react-datepicker.css";

import firebase from "../../firebase";
import Topnav from '../top/Topnav';

//img
import Icheckmark from '../../assets/checkmark.png';
import Idelete from '../../assets/trash_can.png';
import Icross from '../../assets/cross.png';
import Izoom from '../../assets/zoom.png';
import Graph from "react-graph-vis";
import { isEmptyValue } from '../methods';
class Orgs extends React.Component {
    constructor(props) {
        super(props);
        this.tbSM = firebase.firestore().collection('SOCIAL_MAPS');
        //getl);
        this.state = {
            users: [],
            statusSave: "",


            orgs: [],
            onodes: [],
            oedges: [],
            //data
            Ban_name: '',
            edit_ID: '',
            To: '',
            Relation: '',
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
                this.unsubscribe = this.tbSM
                    .where('Geo_map_type', '==', 'organization')
                    .where('Geo_ban_ID', '==', Area_ID)
                    .onSnapshot(this.onCollectionUpdate);
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
    addOrg(id) {
        this.setState({
            edit_ID: id
        })
    }
    delete(id) {
        firebase.firestore().collection('SOCIAL_MAPS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    cancelEdit = (e) => {

    }
    removeOrg = (id) => {
        const { Name, User_ID, } = this.state;
        this.tbSM.doc(id).update({
            Informer_name: Name,
            To: '',
            Status_o: 0,
            Relation: '',
            Informer_ID: User_ID

        }).then((result) => {
            this.state.orgs.forEach((element) => {
                if (element.To === id && element.To !== 'start') {
                    this.removeOrg(element.Key)
                }
            })
        }).catch((error) => {
            console.log(error);
        });
    }
    onCollectionUpdate = (querySnapshot) => {
        const orgs = [];
        const orgs2 = [];
        const onodes = [];
        const oedges = [];
        onodes.push({
            id: 'start', label: 'ชุมชน', color: ' #ffaeff'
        })
        orgs.push({
            Key: 'start',
            Geo_map_name: 'จุดเริ่มต้น',
            To: '',
            edit: <div>

                <img alt="add" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Icheckmark} onClick={this.addOrg.bind(this, 'start')}></img>
            </div>
        })
        querySnapshot.forEach((doc) => {
            const { Informer_name,
                Map_iamge_URL, Geo_map_name, Geo_map_description, Status_o, Relation, To } = doc.data();

            // var temp = parseInt();
            if (!isEmptyValue(Status_o)) {
                if (Status_o === 0) {
                    orgs.push({
                        Key: doc.id,
                        img: <img src={Map_iamge_URL} style={{ width: 50, height: 50 }}></img>,
                        Geo_map_name,
                        Geo_map_description,
                        Informer_name,
                        To,
                        edit: <div>
                            <img alt="add" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Icheckmark} onClick={this.addOrg.bind(this, doc.id)}></img>
                            <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                        </div>
                    });
                } else {
                    console.log('หลัง');

                    var temp_relation = '';
                    var temp_color = ''
                    if (Relation === 'พึ่งพา') {
                        temp_color = "red";
                        temp_relation = "to, from";
                    } else if (Relation === 'ติดต่อ') {
                        temp_relation = "to";
                        temp_color = "blue";
                        if (To === 'start') {
                            temp_relation = "from";
                            temp_color = "blue";
                        }
                    }

                    // console.log("add status ==1" + doc.id);
                    onodes.push({
                        id: doc.id,
                        label: Geo_map_name
                    })
                    oedges.push({
                        from: doc.id,
                        to: To,
                        arrows: temp_relation,
                        color: temp_color,
                    })
                    orgs2.push({
                        Key: doc.id,
                        img: <img src={Map_iamge_URL} style={{ width: 50, height: 50 }}></img>,
                        Geo_map_name,
                        Geo_map_description,
                        Informer_name,
                        To,
                        edit: <div>
                            <img alt="cross" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Icross} onClick={this.removeOrg.bind(this, doc.id)}></img>
                            <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                        </div>
                    });
                }

            } else {
                console.log('หลัง');
                orgs.push({
                    Key: doc.id,
                    img: <img src={Map_iamge_URL} style={{ width: 50, height: 50 }}></img>,
                    Geo_map_name,
                    Geo_map_description,
                    Informer_name,
                    edit: <div>
                        <img alt="add" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Icheckmark} onClick={this.addOrg.bind(this, doc.id)}></img>
                        <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                    </div>
                });
            }


        });
        var temp = orgs.concat(orgs2);
        this.setState({
            orgs: temp,
            onodes,
            oedges,
        });
    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }

    onSubmit = (e) => {
        e.preventDefault();
        const { edit_ID, Name, User_ID, To, Relation } = this.state;
        console.log(edit_ID);
        this.tbSM.doc(edit_ID).update({
            Informer_name: Name,
            To,
            Status_o: 1,
            Relation,
            Informer_ID: User_ID

        }).then((result) => {
            this.setState({
                edit_ID: ''
            })
            // this.unsubscribe = this.tbSM
            //     .where('Geo_map_type', '==', 'organization')
            //     .where('Geo_ban_ID', '==', this.state.Area_ID)
            //     .onSnapshot(this.onCollectionUpdate);
        }).catch((error) => {
            console.log(error);
        });



    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    render() {
        const { Ban_name, To, Relation } = this.state;

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
                    label: 'ชื่อ',
                    field: 'Geo_map_name',
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
            rows: this.state.orgs
        }
        // console.log(this.state.onodes)
        const graph = {
            nodes: this.state.onodes,
            edges: this.state.oedges

        };

        const options = {

            layout: {

                hierarchical: false,

            },
            edges: {
                color: "#000000"
            },
            interaction: {
                dragNodes: false,
                dragView: true,
            },
            nodes: {
                font: {
                    // color: 'white',
                    // strokeWidth: 1,//px
                    // strokeColor: 'black',
                    size: 18, // px
                }
            }
        };

        const events = {
            select: function (event) {
                var { nodes, edges } = event;
                console.log("Selected nodes:");
                console.log(nodes);
                console.log("Selected edges:");
                console.log(edges);
            }
        };
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    <center>
                        <h2><strong>องค์กรหรือกลุ่มที่ทำกิจกรรมในชุมชน : {Ban_name}</strong> </h2>
                        <hr></hr>
                    </center>
                    <Row>
                        <Col sm={8}>
                            <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
                        </Col>
                        <Col sm={4}>
                            {this.state.edit_ID === '' ?
                                <div>
                                    <Link to={'/main_seven_tools'} className="btn btn-success">เพิ่มข้อมูล</Link>
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
                                </div>
                                :
                                <form onSubmit={this.onSubmit}>
                                    <Form.Group as={Row}>
                                        <label >เลือกองค์กรที่ต้องการเชื่อมความสมัพันธ์: <label style={{ color: "red" }}>*</label></label>

                                        <select className="form-control" id="To" name="To" value={To} onChange={this.onChange} required>
                                            <option value=""></option>
                                            {this.state.orgs.map((data, i) =>
                                                this.state.edit_ID !== data.Key ?
                                                    <option key={i + 1} value={data.Key}>{data.Geo_map_name}</option> : ""


                                            )}
                                        </select>


                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <label>ความสัมพันธ์: <label style={{ color: "red" }}>*</label></label>

                                        <select className="form-control" id="Relation" name="Relation" value={Relation} onChange={this.onChange} required>
                                            <option value=""></option>
                                            <option value="พึ่งพา">พึ่งพา</option>
                                            <option value="ติดต่อ">ติดต่อ</option>

                                        </select>

                                    </Form.Group>
                                    <button type="submit" className="btn btn-success">บันทึก</button>
                                    <button type="button" className="btn btn-danger" onClick={() => this.setState({ edit_ID: '', To: '' })}>ยกเลิก</button>

                                </form>
                            }

                        </Col>
                    </Row>

                    <hr></hr>

                </div>
            </div >
        );
    }
}

export default Orgs;
