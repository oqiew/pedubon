

import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import '../../App.css';
import cw from '../../assets/children_walk.gif';
import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue } from "../Methods";
import { tableName } from '../../database/TableConstant';
import Loading from '../Loading';
import { routeName } from '../../route/RouteConstant';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CanvasJSReact from '../../canvasjs.react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import { Button } from 'react-bootstrap';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const ColorNo1 = '#f19867';
const ColorNo2 = '#3e9eff';
const ColorNo3 = '#6ad500';
const BorderLinearProgress1 = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: ColorNo1,
    },
}))(LinearProgress);
const BorderLinearProgress2 = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: ColorNo2,
    },
}))(LinearProgress);
const BorderLinearProgress3 = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: ColorNo3,
    },
}))(LinearProgress);
export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbJourney = Firebase.firestore().collection(tableName.Journey);
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            q1: ["ท่านมีส่วนร่วมกับกิจกรรมต่าง ๆที่ชุมชนจัดขึ้นมากน้อยเพียงใด", "ท่านมีความรู้เกี่ยวกับบริบทต่าง ๆของชุมชน เช่น โครงสร้าง ต้นทุนทางสังคมและวัฒนธรรม สภาพแวดล้อม สุขภาวะของคนและชุมชนมากน้อยเพียงใด"],
            q2: ["ท่านสามารถหาวิธีแก้ไขปัญหาหรือส่งเสริมเสริมปัญญาจากต้นทุนของชุมชนซึ่งมีแนวโน้มที่จะสร้างให้เกิดการเปลี่ยนแปลงในชุมชนได้มากน้อยเพียงใด",
                "ท่านสามารถค้นหาวิธีการแก้ไขปัญหาหรือส่งเสริมปัญญาจากต้นทุนของชุมชนได้อย่างรวดเร็วภายใต้เงื่อนไขของเวลาในการพัฒนาข้อเสนอโครงการ มากน้อยเพียงใด",
                "ท่านสามารถค้นหาวิธีการแก้ไขปัญหาหรือส่งเสริมปัญญาจากต้นทุนของชุมชนได้อย่างหลาหลายภายใต้เงื่อนไขของเวลาในการพัฒนาข้อเสนอโครงการ มากน้อยเพียงใด",
                "ท่านสามารถแจกแจงรายละเอียดในการดำเนินงานในโครงการได้ มากน้อยเพียงใด"],
            q3: ["ท่านมีความรู้ความเข้าใจในบริบทแวดล้อมของชุมชน เช่น โครงสร้าง ต้นทุนทางสังคมและวัฒนธรรม สภาพแวดล้อม สุขภาวะของคนและชุมชน ที่มีความแตกต่างหลากหลายพร้อมทำงานร่วมกับผู้อื่น",
                "ท่านสามารถมองเห็นปัญหาและปัญญาจากต้นทุนของชุมชนและนำปัญหาหรือปัญญานั้นมาพัฒนาเป็นแนวคิดหรือวิธีการใหม่ๆ",
                "ท่านมีความรับผิดชอบต่อส่วนรวมมากน้อยเพียงใด",
                "ท่านมีการพัฒนาตัวเองและผู้อื่นอย่างสม่ำเสมอ"],
            C11: [],
            C12: [],
            C13: [],
            C21: [],
            C22: [],
            C23: [],
            C31: [],
            C32: [],
            C33: [],
            J11: '',
            J12: '',
            J13: '',
            J14: '',
            J21: '',
            J22: '',
            J23: '',
            J24: '',
            J31: '',
            J32: '',
            J33: '',
            J34: '',
            detail: false
        }

    }
    componentDidMount() {
        this.tbJourney.where('uid', '==', this.state.uid).onSnapshot(this.getJourney);
    }
    getJourney = (querySnapshot) => {
        let C11 = [];
        let C12 = [];
        let C13 = [];
        let C21 = [];
        let C22 = [];
        let C23 = [];
        let C31 = [];
        let C32 = [];
        let C33 = [];
        let J11 = '';
        let J12 = '';
        let J13 = '';
        let J14 = '';
        let J21 = '';
        let J22 = '';
        let J23 = '';
        let J24 = '';
        let J31 = '';
        let J32 = '';
        let J33 = '';
        let J34 = '';
        querySnapshot.forEach((doc) => {
            const { C1, C2, C3, J1, J2, J3, J4, Time } = doc.data();
            if (Time === 'ก่อนเข้าร่วมกิจกรรม') {
                C11 = C1;
                C12 = C2;
                C13 = C3;
                J11 = J1;
                J12 = J2;
                J13 = J3;
                J14 = J4;

            } else if (Time === 'ระหว่างร่วมกิจกรรม') {
                C21 = C1;
                C22 = C2;
                C23 = C3;
                J21 = J1;
                J22 = J2;
                J23 = J3;
                J24 = J4;
            } else if (Time === 'หลังร่วมกิจกรรม') {
                C31 = C1;
                C32 = C2;
                C33 = C3;
                J31 = J1;
                J32 = J2;
                J33 = J3;
                J34 = J4;
            }
        })
        this.setState({
            C11, C12, C13, C21, C22, C23, C31, C32, C33, J11, J12, J13, J14, J21, J22, J23, J24, J31, J32, J33, J34
        })
    }
    render() {

        //User Profile
        const { email, Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday_format, Position, Role,
            Avatar_URL, area, User_type

        } = this.state;

        const { C11, C12, C13, C21, C22, C23, C31, C32, C33, J11, J12, J13, J14, J21, J22, J23, J24, J31, J32, J33, J34 } = this.state;
        let ShowC110 = 0;
        let ShowC111 = 0;
        let ShowC120 = 0;
        let ShowC121 = 0;
        let ShowC130 = 0;
        let ShowC131 = 0;
        if (!isEmptyValue(C11)) {
            ShowC110 = (parseInt(C11[0], 10) * 100) / 5;
            ShowC111 = (parseInt(C11[1], 10) * 100) / 5;
        }
        if (!isEmptyValue(C21)) {
            ShowC120 = (parseInt(C21[0], 10) * 100) / 5;
            ShowC121 = (parseInt(C21[1], 10) * 100) / 5;
        }
        if (!isEmptyValue(C31)) {
            ShowC130 = (parseInt(C31[0], 10) * 100) / 5;
            ShowC131 = (parseInt(C31[1], 10) * 100) / 5;
        }
        const card_style = {
            backgroundColor: '#91c8c8',
            borderRadius: 10,
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            transition: "0.3s",
            padding: 30

        }
        if (this.state.loading) {
            return <Loading></Loading>
        } else {
            return (
                <div>
                    <Topnav user={this.state.User}></Topnav>
                    <div className='main_component'>
                        <div style={card_style}>
                            <Row >
                                <Col sm={4} style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                                    {Avatar_URL && <img className="avatar" alt="avatar" src={Avatar_URL} />}
                                </Col>
                                <Col style={{ flexDirection: 'column' }} sm="auto">
                                    <h6 style={{ padding: 2 }}>{email}  {Role === 'admin' && <b style={{ color: 'red' }}>({Role})</b>}</h6>
                                    <h6 style={{ padding: 2 }}><strong>ชื่อ : </strong>{Name} {Lastname}<strong> ชื่อเล่น : </strong>{Nickname}</h6>
                                    <h6 style={{ padding: 2 }}><strong> เพศ : </strong>{Sex}<strong>  วันเกิด : </strong>{Birthday_format}</h6>
                                    <h6 style={{ padding: 2 }}><strong>ประเภทผู้ใช้ : </strong>{User_type}<strong>  เบอร์โทรศัพท์มือถือ : </strong>{Phone_number}</h6>
                                    <h6 style={{ padding: 2 }}><strong>Facebook : </strong>{Facebook}<strong>  Line_ID : </strong>{Line_ID}</h6>
                                    <h6 style={{ padding: 2 }}><strong>ตำแหน่ง : </strong>{Position}</h6>
                                    <h6 style={{ padding: 2 }}><strong>อปท : </strong>{area.area_name}</h6>

                                </Col>
                            </Row>
                            <center><Link className="btn btn-success" to={'/register'}>แก้ไข</Link></center>
                            <hr style={{ margin: 10 }}></hr>
                            <Row>
                                <Col>
                                    <div style={{ height: 100 }}>
                                        <span >C101 {this.state.q1[0]}</span>
                                    </div>

                                    <div style={{ flexDirection: 'row' }}>
                                        <span>ก่อนเข้าร่วม</span>
                                        <BorderLinearProgress1 variant="determinate" value={ShowC110} />
                                    </div>
                                    <div>
                                        <span>ระหว่างเข้าร่วม</span>
                                        <BorderLinearProgress2 variant="determinate" value={ShowC120} />
                                    </div>
                                    <div>
                                        <span>หลังเข้าร่วม</span>
                                        <BorderLinearProgress3 variant="determinate" value={ShowC130} />
                                    </div>
                                </Col>
                                <Col>
                                    <div style={{ height: 100 }}>
                                        <span >C102 {this.state.q1[1]}</span>
                                    </div>
                                    <div style={{ flexDirection: 'row' }}>
                                        <span>ก่อนเข้าร่วม</span>
                                        <BorderLinearProgress1 variant="determinate" value={ShowC111} />
                                    </div>
                                    <div>
                                        <span>ระหว่างเข้าร่วม</span>
                                        <BorderLinearProgress2 variant="determinate" value={ShowC121} />
                                    </div>
                                    <div>
                                        <span>หลังเข้าร่วม</span>
                                        <BorderLinearProgress3 variant="determinate" value={ShowC131} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <RadarChart

                                        captions={{
                                            // columns
                                            Q1: 'C201',
                                            Q2: 'C202',
                                            Q3: 'C203',
                                            Q4: 'C204',
                                        }}
                                        data={[
                                            // data
                                            {
                                                data: {
                                                    Q1: parseInt(C12[0], 10) * 0.2,
                                                    Q2: parseInt(C12[1], 10) * 0.2,
                                                    Q3: parseInt(C12[2], 10) * 0.2,
                                                    Q4: parseInt(C12[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo1 }
                                            }, {
                                                data: {
                                                    Q1: parseInt(C22[0], 10) * 0.2,
                                                    Q2: parseInt(C22[1], 10) * 0.2,
                                                    Q3: parseInt(C22[2], 10) * 0.2,
                                                    Q4: parseInt(C22[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo2 }
                                            },
                                            {
                                                data: {
                                                    Q1: parseInt(C32[0], 10) * 0.2,
                                                    Q2: parseInt(C32[1], 10) * 0.2,
                                                    Q3: parseInt(C32[2], 10) * 0.2,
                                                    Q4: parseInt(C32[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo3 }
                                            },
                                        ]}
                                        size={this.state.detail ? 300 : 350}
                                    />
                                </Col>
                                <Col>
                                    <RadarChart

                                        captions={{
                                            // columns
                                            Q1: 'C301',
                                            Q2: 'C302',
                                            Q3: 'C303',
                                            Q4: 'C304',
                                        }}
                                        data={[
                                            // data
                                            {
                                                data: {
                                                    Q1: parseInt(C13[0], 10) * 0.2,
                                                    Q2: parseInt(C13[1], 10) * 0.2,
                                                    Q3: parseInt(C13[2], 10) * 0.2,
                                                    Q4: parseInt(C13[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo1 }
                                            }, {
                                                data: {
                                                    Q1: parseInt(C23[0], 10) * 0.2,
                                                    Q2: parseInt(C23[1], 10) * 0.2,
                                                    Q3: parseInt(C23[2], 10) * 0.2,
                                                    Q4: parseInt(C23[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo2 }
                                            },
                                            {
                                                data: {
                                                    Q1: parseInt(C33[0], 10) * 0.2,
                                                    Q2: parseInt(C33[1], 10) * 0.2,
                                                    Q3: parseInt(C33[2], 10) * 0.2,
                                                    Q4: parseInt(C33[3], 10) * 0.2,

                                                },
                                                meta: { color: ColorNo3 }
                                            },
                                        ]}
                                        size={this.state.detail ? 300 : 350}

                                    />
                                </Col>
                            </Row>
                            <center>{this.state.detail === false ? <Button variant="info" onClick={() => this.setState({ detail: true })}>ข้อมูล</Button>
                                : <Button variant="danger" onClick={() => this.setState({ detail: false })}>ปิด</Button>
                            }</center>
                            {this.state.detail && <Row>
                                <Col>
                                    {this.state.q2.map((element, i) =>
                                        <h6>C20{i + 1}{element}</h6>
                                    )}
                                </Col>
                                <Col>
                                    {this.state.q3.map((element, i) =>
                                        <h6>C30{i + 1}{element}</h6>
                                    )}
                                </Col>
                            </Row>}
                        </div>

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
    fetch_user
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

