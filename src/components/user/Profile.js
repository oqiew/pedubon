

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
        this.tbIIndicators = Firebase.firestore().collection(tableName.Indicators);
        this.tbJourney = Firebase.firestore().collection(tableName.Journey);
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            c1: [],
            c2: [],
            c3: [],
            journey: [],
        }

    }
    componentDidMount = async () => {
        if (!isEmptyValue(this.state.Name)) {
            this.tbJourney.where('Name', '==', '4ctped').onSnapshot(this.getJourney)
            this.tbIIndicators.where('n', '==', 'c1').onSnapshot(this.getC1)
            this.tbIIndicators.where('n', '==', 'c2').onSnapshot(this.getC2)
            this.tbIIndicators.where('n', '==', 'c3').onSnapshot(this.getC3)
        }
    }
    getJourney = (query) => {
        const journey = [];
        let index = 1;
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                journey.push(
                    doc
                )
            })
        });
        this.setState({
            journey
        })
    }
    getC1 = (query) => {
        const c1 = [];
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c1.push(
                    doc
                )
            })

        });
        this.setState({
            c1
        })
    }
    getC2 = (query) => {
        const c2 = [];
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c2.push(
                    doc
                )
            })

        });
        this.setState({
            c2
        })
    }
    getC3 = (query) => {
        const c3 = [];
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c3.push(
                    doc
                )
            })

        });
        this.setState({
            c3
        })
    }

    render() {

        //User Profile
        const { email, Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday_format, Position, Role,
            Avatar_URL, area

        } = this.state;

        const { c1, c2, c3, journey, User_type, C1, C2, C3, Journey } = this.state;

        // const ShowC10 = (C1[0] * 100) / 5;
        const ShowC10 = 50;
        // const ShowC11 = (C1[1] * 100) / 5;
        // const captionsC3 = {
        //     // columns
        //     Q1: 'C301',
        //     Q2: 'C302',
        //     Q3: 'C303',
        //     Q4: 'C304',

        // };


        // const dataC3 = {
        //     Q1: C3[0],
        //     Q2: C3[1],
        //     Q3: C3[2],
        //     Q4: C3[3],
        // }
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
                                    <h4 style={{ padding: 5 }}>{email}  {Role === 'admin' && <b style={{ color: 'red' }}>({Role})</b>}</h4>
                                    <h4 style={{ padding: 5 }}><strong>ชื่อ : </strong>{Name} {Lastname}<strong> ชื่อเล่น : </strong>{Nickname}</h4>
                                    <h4 style={{ padding: 5 }}><strong> เพศ : </strong>{Sex}<strong>  วันเกิด : </strong>{Birthday_format}</h4>
                                    <h4 style={{ padding: 5 }}><strong>ประเภทผู้ใช้ : </strong>{User_type}<strong>  เบอร์โทรศัพท์มือถือ : </strong>{Phone_number}</h4>
                                    <h4 style={{ padding: 5 }}><strong>Facebook : </strong>{Facebook}<strong>  Line_ID : </strong>{Line_ID}</h4>
                                    <h4 style={{ padding: 5 }}><strong>ตำแหน่ง : </strong>{Position}</h4>
                                    <h4 style={{ padding: 5 }}><strong>อปท : </strong>{area.area_name}</h4>

                                </Col>
                            </Row>
                            <Row style={{ justifyContent: 'center' }}>
                                {/* <Link className="btn btn-success" to={routeName.PowerUser}>แก้ไขพลัง</Link> */}
                                <Link className="btn btn-success" to={'/register'}>แก้ไข</Link>
                            </Row>
                            <hr style={{ margin: 10 }}></hr>
                            <Row style={{ marginTop: 20 }}>
                                <Col>

                                    <div style={{ flexDirection: 'row' }}>
                                        <span>การมีส่วนร่วมกับกิจกรรมต่าง ๆที่ชุมชนจัด</span>
                                        <span>C101</span>
                                        <div style={{ flexDirection: 'row' }}>
                                            <span>No.1</span>
                                            <BorderLinearProgress1 variant="determinate" value={ShowC10} />
                                        </div>
                                        <div>
                                            <span>No.2</span>
                                            <BorderLinearProgress2 variant="determinate" value={ShowC10} />
                                        </div>
                                        <div>
                                            <span>No.3</span>
                                            <BorderLinearProgress3 variant="determinate" value={ShowC10} />
                                        </div>
                                    </div>
                                    <div style={{ flexDirection: 'row' }}>
                                        <span>การมีส่วนร่วมกับกิจกรรมต่าง ๆที่ชุมชนจัด</span>
                                        <span>C102</span>
                                        <div style={{ flexDirection: 'row' }}>
                                            <span>No.1</span>
                                            <BorderLinearProgress1 variant="determinate" value={ShowC10} />
                                        </div>
                                        <div>
                                            <span>No.2</span>
                                            <BorderLinearProgress2 variant="determinate" value={ShowC10} />
                                        </div>
                                        <div>
                                            <span>No.3</span>
                                            <BorderLinearProgress3 variant="determinate" value={ShowC10} />
                                        </div>
                                    </div>

                                </Col>

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
                                                // data: {
                                                //     Q1: C2[0] * 0.2,
                                                //     Q2: C2[1] * 0.2,
                                                //     Q3: C2[2] * 0.2,
                                                //     Q4: C2[3] * 0.2,

                                                // },
                                                data: {
                                                    Q1: 1 * 0.2,
                                                    Q2: 2 * 0.2,
                                                    Q3: 3 * 0.2,
                                                    Q4: 4 * 0.2,

                                                },
                                                meta: { color: ColorNo1 }
                                            },
                                        ]}
                                        size={400}
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
                                                // data: {
                                                //     Q1: C3[0] * 0.2,
                                                //     Q2: C3[1] * 0.2,
                                                //     Q3: C3[2] * 0.2,
                                                //     Q4: C3[3] * 0.2,

                                                // },
                                                data: {
                                                    Q1: 1 * 0.2,
                                                    Q2: 2 * 0.2,
                                                    Q3: 3 * 0.2,
                                                    Q4: 4 * 0.2,

                                                },
                                                meta: { color: ColorNo1 }
                                            }, {
                                                // data: {
                                                //     Q1: C3[0] * 0.2,
                                                //     Q2: C3[1] * 0.2,
                                                //     Q3: C3[2] * 0.2,
                                                //     Q4: C3[3] * 0.2,

                                                // },
                                                data: {
                                                    Q1: 2 * 0.2,
                                                    Q2: 3 * 0.2,
                                                    Q3: 4 * 0.2,
                                                    Q4: 4 * 0.2,

                                                },
                                                meta: { color: ColorNo2 }
                                            }, {
                                                // data: {
                                                //     Q1: C3[0] * 0.2,
                                                //     Q2: C3[1] * 0.2,
                                                //     Q3: C3[2] * 0.2,
                                                //     Q4: C3[3] * 0.2,

                                                // },
                                                data: {
                                                    Q1: 5 * 0.2,
                                                    Q2: 5 * 0.2,
                                                    Q3: 5 * 0.2,
                                                    Q4: 4 * 0.2,

                                                },
                                                meta: { color: ColorNo3 }
                                            },

                                        ]}
                                        size={400}

                                    />
                                </Col>
                            </Row>
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

