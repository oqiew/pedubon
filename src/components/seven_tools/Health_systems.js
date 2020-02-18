import { Form, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import OrgChart from 'react-orgchart';
import React from 'react'

import "react-datepicker/dist/react-datepicker.css";
import 'react-orgchart/index.css';
import { isEmptyValue } from '../methods';
import firebase from "../../firebase";
import Topnav from '../top/Topnav';
import 'react-orgchart/index.css';

//img
import Iadd from '../../assets/add.png';
import Idelete from '../../assets/trash_can.png';
import Icheckmark from '../../assets/checkmark.png';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
class Orgs extends React.Component {
    constructor(props) {
        super(props);
        this.tbSM = firebase.firestore().collection('SOCIAL_MAPS');
        //getl);
        this.state = {
            users: [],
            statusSave: "",
            childrenOrg: [],

            //data
            HName: '', HLastname: '', Haddress: '',
            HAge: '', HCareer: '',
            HS: [],
            HSO: [],
            //data
            status_add: false,
            Ban_name: '',
            edit_ID: '',
            //data b
            Geo_map_name: '',
            //getuser
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',

            //
            select_add: '',
            //
            addb: false,

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
                this.unsubscribe = this.tbSM.where('Geo_map_type', '==', 'resource').where('Geo_ban_ID', '==', Area_ID).onSnapshot(this.onCollectionUpdate);

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
    onCollectionUpdate = (querySnapshot) => {
        const HS = [];
        const HSO = [];
        querySnapshot.forEach((doc) => {
            const { Informer_name, Geo_ban_ID, Status_hs, From, To, Geo_map_name,
                Map_iamge_URL, Geo_map_description, } = doc.data();

            // var temp = parseInt();


            if (Status_hs !== '' || Status_hs !== undefined || From !== '' || From !== undefined
                || To !== '' || To !== undefined) {

                HSO.push({
                    Key: doc.id,
                    From,
                    Geo_map_name,
                    Geo_ban_ID
                })
            }
            var tempIMG = '';
            if (Map_iamge_URL !== '' && Map_iamge_URL !== null && Map_iamge_URL !== undefined) {
                tempIMG = <img alt="imageURL" src={Map_iamge_URL} style={{ width: 50, height: 50 }}></img>;
            }
            if (this.state.select_add === '') {
                HS.push({
                    Key: doc.id,
                    img: tempIMG,
                    Geo_map_name,
                    Geo_map_description,
                    Informer_name,
                    Status_hs,
                    edit: <div>
                        <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.deleteSM.bind(this, doc.id)}></img>
                    </div >
                });
            } else {
                if (Status_hs === 0 || isEmptyValue(Status_hs)) {
                    HS.push({
                        img: tempIMG,
                        Geo_map_name,
                        Geo_map_description,
                        Informer_name,
                        Status_hs,
                        edit: <div>

                            < img alt="add" style={{ widtha: 20, height: 20, cursor: 'pointer' }}
                                onClick={this.saveHS.bind(this, doc.id)} src={Icheckmark} ></img >

                            <img alt="delete" style={{ widtha: 20, height: 20, cursor: 'pointer' }} src={Idelete} onClick={this.deleteSM.bind(this, doc.id)}></img>
                        </div >
                    });
                }

            }


        });
        this.setState({
            HS, HSO
        });
        this.orgShow(HSO);
    }

    // HSO
    orgShow = (org) => {
        // console.log(org)
        const childrenOrg = [];

        org.forEach((element) => {

            if (element.From === 0) {

                childrenOrg.push({
                    children: [
                        {
                            name: <div style={{ padding: 5 }}>
                                <h6>{element.Geo_map_name}</h6>
                                <Col>
                                    <img alt="add" src={Iadd} style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={this.addOrg.bind(this, element.Key)}></img>
                                    <img alt="delete" src={Idelete} style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={this.unsaveHS.bind(this, element.Key)}></img>
                                </Col>

                            </div>
                            ,
                            children: this.orgloop(org, element.Key)
                        }
                    ]
                })
            }

        });

        this.setState({
            childrenOrg
        })

    }

    orgloop = (org, id) => {
        const c = [];
        try {
            org.forEach((element) => {
                if (element.From === id) {
                    c.push(
                        {
                            name: <div style={{ padding: 5 }}>
                                <h6>{element.Geo_map_name}</h6>
                                <Col>
                                    <img alt="add" src={Iadd} style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={this.addOrg.bind(this, element.Key)}></img>
                                    <img alt="delete" src={Idelete} style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={this.unsaveHS.bind(this, element.Key)}></img>
                                </Col>

                            </div>
                            , children: this.orgloop(org, element.Key)

                        });
                }
            })


        } catch (e) {
            console.log("ยังไม่ได้เลือก")
        }
        return c;
    }

    addOrg = (fromid) => {

        if (this.state.select_add === '') {
            console.log(fromid);
            this.setState({
                select_add: fromid
            })
        } else {
            this.setState({
                select_add: ''
            })
        }

        this.unsubscribe = this.tbSM.where('Geo_map_type', '==', 'resource').where('Geo_ban_ID', '==', this.state.Area_ID).onSnapshot(this.onCollectionUpdate);


    }

    saveHS = (id) => {
        console.log(id);
        this.tbSM.doc(id).update({
            From: this.state.select_add,
            Status_hs: 1
        }).then((doc) => {
            this.setState({
                select_add: ''
            })
            this.unsubscribe = this.tbSM.where('Geo_map_type', '==', 'resource').where('Geo_ban_ID', '==', this.state.Area_ID).onSnapshot(this.onCollectionUpdate);

        }).catch((error) => {
            console.log(error);
        })
    }
    unsaveHS = (id) => {
        this.updateChild(id);
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

    deleteSM = (id) => {
        this.updateChild(id);
        firebase.firestore().collection('SOCIAL_MAPS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    updateChild = (id) => {

        this.tbSM.doc(id).get().then((doc) => {
            this.state.HSO.forEach((element) => {
                if (element.From === id) {
                    this.updateChild(element.Key);
                }
            })
            this.tbSM.doc(id).update({
                From: '', Status_hs: 0
            })

        })

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




    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }

    onSubmit = (e) => {
        e.preventDefault();
        const { HName, HLastname, HAddress, HAge,
            HCareer, Geo_map_description, Area_ID, edit_ID, Name, User_ID } = this.state;

        this.tbSM.doc(edit_ID).update({
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

            })
        }).catch((error) => {
            console.log(error);
        });



    }
    onSubmitB = (e) => {
        e.preventDefault()
        const { Geo_map_name, User_ID, Name } = this.state;

        this.tbSM.add({
            Geo_map_name,
            Informer_ID: User_ID,
            Informer_name: Name,
            Geo_map_type: 'resource',
            Geo_ban_ID: this.state.Area_ID,
        }).then((doc) => {
            this.setState({
                addb: false,
                Geo_map_name: '',
            })
        })
    }
    render() {
        const { Ban_name, Geo_map_name } = this.state;


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
            rows: this.state.HS
        }
        const style = {
            border: "solid 1px",
            display: 'initial',
            padding: '5px',
        }
        //แผนผัง
        const initechOrg = {
            name: <div style={style}>{this.state.Ban_name}
                <img alt="add" src={Iadd} style={{ width: 30, height: 30, cursor: 'pointer' }} onClick={this.addOrg.bind(this, 0)}></img>
            </div>,
            actor: <div>{this.state.nameOrg} : {this.state.Ban_name}</div>,
            children: this.state.childrenOrg,
        };

        const MyNodeComponent = ({ node }) => {
            return (
                <div className="initechNode" >{node.name}</div>
            );
        };
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    <center>
                        <h2><strong>ระบบสุขภาพชุมชน : {Ban_name}</strong> </h2>
                        <hr></hr>
                    </center>
                    <Row>
                        <Col sm={8}>
                            <OrgChart tree={initechOrg} NodeComponent={MyNodeComponent} />
                        </Col>
                        <Col sm={4}>
                            {this.state.addb ?
                                <form onSubmit={this.onSubmitB}>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ชื่อทรัพยากร: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <input type="text" className="form-control" name="Geo_map_name" value={Geo_map_name} onChange={this.onChange} required />

                                        </Col>

                                    </Form.Group>

                                    <button type="submit" className="btn btn-success">บันทึก</button>
                                    <button type="button" className="btn btn-danger" onClick={() => this.setState({ addb: false, Geo_map_name: '' })}>ยกเลิก</button>

                                </form>

                                :
                                <div>
                                    <div style={{ display: 'flex' }}>
                                        <Link to={'/main_seven_tools'} className="btn btn-success">เพิ่มข้อมูลทรัพยากร</Link>
                                        <button className="btn btn-success" onClick={() => this.setState({ addb: true })}>เพิ่มหมวดหมู่หรือข้อมูลอื่น</button>
                                    </div>

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
