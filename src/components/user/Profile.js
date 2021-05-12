

import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import '../../App.css';
import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import { isEmptyValue } from "../Methods";
import { tableName } from '../../database/TableConstant';
import Loading from '../Loading';
import { withStyles } from '@material-ui/core/styles';
import ReactApexCharts from 'react-apexcharts'
import LinearProgress from '@material-ui/core/LinearProgress';
import CanvasJSReact from '../../canvasjs.react';
export class Register extends Component {
    constructor(props) {
        super(props);
        this.tbJourney = Firebase.firestore().collection(tableName.Journey);
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            q1: ["ท่านเข้าใจปัญหาชุมชนมากน้อยเพียงใด", "ท่านรู้แนวทางแก้ไขปัญหาในชุมชนมากน้อยเพียงใด"],
            q2: ["ท่านมีความคิดสร้างสรรค์มากน้อยเพียงใด",
                "ท่านมีความกล้าแสดงออกมากน้อยเพียงใด",
                "ท่านมีแนวคิดหรือวิธีการใหม่ๆในการแก้ปัญหามากน้อยเพียงใด"],
            q3: ["ท่ท่านสามารถพัฒนาตนเองมากน้อยเพียงใด",
                "ท่านสามารถมองเห็นปัญหาและปัญญาจากต้นทุนของชุมชนและนำปัญหาหรือปัญญานั้นมาพัฒนาเป็นแนวคิดหรือวิธีการใหม่ๆ",
                "ท่านสามารถเป็นแบบอย่างให้เพื่อนในทางที่ดีมากน้อยเพียงใด",
                "ท่านคิดว่าตัวท่านกล้าคิด กล้าทำ กล้าตัดสินใจมากน้อยเพียงใด"],
            C11: [],
            C12: [],
            C13: [],
            C21: [],
            C22: [],
            C23: [],
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

        querySnapshot.forEach((doc) => {
            const { C1, C2, C3, Time } = doc.data();
            if (Time === 'ก่อนเข้าร่วมกิจกรรม') {
                C11 = C1;
                C12 = C2;
                C13 = C3;

            } else if (Time === 'หลังร่วมกิจกรรม') {
                C21 = C1;
                C22 = C2;
                C23 = C3;
            }
        })
        this.setState({
            C11, C12, C13, C21, C22, C23,
        })
    }
    render() {

        //User Profile
        const { email, Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday_format, Position, Role,
            Avatar_URL, area, User_type
        } = this.state;
        const { C11, C12, C13, C21, C22, C23, } = this.state;
        let series = [(((parseInt(C21[0], 10) * 20) + (parseInt(C21[1], 10) * 20)) / 2).toFixed(2),
        (((parseInt(C22[0], 10) * 20) +
            (parseInt(C22[1], 10) * 20) +
            (parseInt(C22[2], 10) * 20)) / 3).toFixed(2),
        (((parseInt(C23[0], 10) * 20) +
            (parseInt(C23[1], 10) * 20) +
            (parseInt(C23[2], 10) * 20)) / 3).toFixed(2)
        ];
        let options = {
            chart: {
                height: 390,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            show: false,
                        }
                    }
                }
            },
            colors: ['#1ab7ea', '#00e297', '#ff4646'],
            labels: ['สำนึกรักชุมชน :' + series[0], 'ความคิดสร้างสรรค์ :' + series[1], 'ผู้นำการเปลี่ยนแปลง :' + series[2]],
            legend: {
                show: true,
                floating: true,
                fontSize: '16px',
                position: 'left',
                offsetX: 160,
                offsetY: 15,
                labels: {
                    useSeriesColors: true,
                },
                markers: {
                    size: 0
                },
                itemMargin: {
                    vertical: 3
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        show: false
                    }
                }
            }]
        }
        let seriesScore = [{
            name: 'ก่อนเข้าร่วม',
            data: [(parseInt(C11[0], 10) * 20),
            (parseInt(C11[1], 10) * 20),
            (parseInt(C12[0], 10) * 20),
            (parseInt(C12[1], 10) * 20),
            (parseInt(C12[2], 10) * 20),
            (parseInt(C13[0], 10) * 20),
            (parseInt(C13[1], 10) * 20),
            (parseInt(C13[2], 10) * 20)],
        }, {
            name: 'หลังเข้าร่วม',
            data: [(parseInt(C21[0], 10) * 20),
            (parseInt(C21[1], 10) * 20),
            (parseInt(C22[0], 10) * 20),
            (parseInt(C22[1], 10) * 20),
            (parseInt(C22[2], 10) * 20),
            (parseInt(C23[0], 10) * 20),
            (parseInt(C23[1], 10) * 20),
            (parseInt(C23[2], 10) * 20)],
        }]
        let optionsScore = {
            chart: {
                height: 350,
                type: 'radar',
                dropShadow: {
                    enabled: true,
                    blur: 1,
                    left: 1,
                    top: 1
                }
            },
            // title: {
            //     text: ''
            // },
            stroke: {
                width: 2
            },
            fill: {
                opacity: 0.1
            },
            markers: {
                size: 0
            },
            xaxis: {
                categories: ['C11', 'C12', 'C21', 'C22', 'C23', 'C31', 'C32', 'C33']
            }
        }

        const card_style = {
            backgroundColor: '#f0f0f0',
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
                                    <h6 style={{ padding: 2 }}><strong>อปท : </strong>{area.Area_name}({area.Area_type})</h6>

                                </Col>
                            </Row>
                            <center><Link className="btn btn-success" to={'/register'}>แก้ไข</Link></center>
                            <hr style={{ margin: 10 }}></hr>
                            <div>
                                <ReactApexCharts options={options} series={series} type="radialBar" height={390} />
                            </div>
                            <div>
                                <Col>
                                    <ReactApexCharts options={optionsScore} series={seriesScore} type="radar" height={350} />
                                </Col>
                            </div>
                            <div>
                                <p>C11 : {this.state.q1[0]}</p>
                                <p>C12 : {this.state.q1[1]}</p>
                                <p>C21 : {this.state.q2[0]}</p>
                                <p>C22 : {this.state.q2[1]}</p>
                                <p>C23 : {this.state.q2[2]}</p>
                                <p>C31 : {this.state.q3[0]}</p>
                                <p>C32 : {this.state.q3[1]}</p>
                                <p>C33 : {this.state.q3[2]}</p>
                            </div>
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

