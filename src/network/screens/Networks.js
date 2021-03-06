import React, { Component } from 'react'
import { connect } from 'react-redux'
import Firebase from '../../Firebase'
import { fetch_user_network } from '../../actions'
import Loading from '../../components/Loading'
import { isEmptyValue, isEmptyValues } from '../../components/Methods'
import { TopBar } from '../topBar/TopBar'
import Resizer from 'react-image-file-resizer';
import { Form, Col, Row, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { tableName } from '../database/TableName'
import { routeName } from '../../route/RouteConstant'
import { confirmAlert } from 'react-confirm-alert'; // Import
import { MDBDataTable } from "mdbreact";
import CanvasJSReact from '../../canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export class Networks extends Component {
    constructor(props) {
        super(props);
        this.tbPlanNetwork = Firebase.firestore().collection(tableName.PlanNetwork);
        this.state = {
            loading: false,
            plans: [],
            page: 'table',
            type1: [],
            type2: [],
            type3: [],
            type4: [],
            type5: [],
            type6: [],
            type7: [],
            select_Type: [],
            numAllplans: 0,
        }
    }
    componentDidMount() {
        this.tbPlanNetwork.onSnapshot(this.onListPlan)
    }
    onListPlan = (query) => {
        this.setState({
            loading: true
        })
        const plans = [];
        const type1 = [];
        const type2 = [];
        const type3 = [];
        const type4 = [];
        const type5 = [];
        const type6 = [];
        const type7 = [];
        let number = 1;
        let numAllplans = 0;
        query.forEach(doc => {
            const { P_type, P_date, M1, M2, Year, Year2 } = doc.data();
            let types = ""
            const date = (M1 === M2 && Year === Year2) ? M2 + " " + Year : M1 + "/" + Year + "-" + M2 + "/" + Year2;
            P_type.forEach((element, i) => {
                if (!isEmptyValue(element)) {
                    types += P_type[i];
                    numAllplans++
                    if (i !== 6) {
                        types += ","
                    }
                    if (element === 'มิติครอบครัว') {
                        type1.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติสิทธิเด็ก') {
                        type2.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติเด็กมีส่วนร่วม') {
                        type3.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติสุขภาพ') {
                        type4.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติปลอดภัย') {
                        type5.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติการเรียนรู้') {
                        type6.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติพื้นที่สร้างสรรค์') {
                        type7.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    }
                }
            });

            plans.push({
                ID: doc.id,
                number,
                ...doc.data(),
                date,
                types,

            })
            number++
        });

        this.setState({
            plans,
            loading: false,
            type1,
            type2,
            type3,
            type4,
            type5,
            type6,
            type7,
            select_Type: plans,
            numAllplans
        })
    }
    render() {
        const { type1, type2, type3, type4, type5, type6, type7, plans, numAllplans } = this.state;
        const data = {
            columns: [
                {
                    label: "#",
                    field: "number",
                    sort: "asc",
                    width: 50
                },
                {
                    label: "แผน",
                    field: "P_plan",
                    sort: "asc",
                    width: 300
                },
                {
                    label: "กิจกรรม",
                    field: "P_activity",
                    sort: "asc",
                    width: 300
                },
                {
                    label: "วันเวลา",
                    field: "date",
                    sort: "asc",
                    width: 100
                },
                {
                    label: "ปี",
                    field: "P_year",
                    sort: "asc",
                    width: 50
                },
                {
                    label: "เมืองน่าอยู่",
                    field: "types",
                    sort: "asc",
                    width: 150
                },

                {
                    label: "หมายเหตุ",
                    field: "P_other",
                    sort: "asc",
                    width: 60
                },
                {
                    label: "หน่วยงาน",
                    field: "Agency_name",
                    sort: "asc",
                    width: 150
                }
            ],
            rows: this.state.select_Type
        };
        const optionsNetworks = {
            animationEnabled: true,
            exportEnabled: true,
            theme: "light1", // "light1", "dark1", "dark2"
            title: {
                text: 'ข้อมูลการดำเนินงาน ',
                fontSize: 20
            },
            data: [{
                type: "pie",
                indexLabel: "{label}: {y}%",
                // startAngle: -10 ,
                // dataPoints: [
                //     { y: (sSex[0] * 100 / scount).toFixed(2), label: 'ชาย' },
                //     { y: (sSex[1] * 100 / scount).toFixed(2), label: 'หญิง' },
                // ]
                dataPoints: [
                    { y: (type1.length * 100 / numAllplans).toFixed(2), label: "มิติครอบครัว" },
                    { y: (type2.length * 100 / numAllplans).toFixed(2), label: "มิติสิทธิเด็ก" },
                    { y: (type3.length * 100 / numAllplans).toFixed(2), label: "มิติเด็กมีส่วนร่วม" },
                    { y: (type4.length * 100 / numAllplans).toFixed(2), label: "มิติสุขภาพ" },
                    { y: (type5.length * 100 / numAllplans).toFixed(2), label: "มิติปลอดภัย" },
                    { y: (type6.length * 100 / numAllplans).toFixed(2), label: "มิติการเรียนรู้" },
                    { y: (type7.length * 100 / numAllplans).toFixed(2), label: "มิติพื้นที่สร้างสรรค์" }
                ]
            }]
        }
        const { page } = this.state;
        const myData = [{ angle: 10, label: 'name' }, { angle: 5, label: 'name' }, { angle: 2, label: 'name' }]
        if (this.state.laoding) {
            return <Loading></Loading>
        } else if (page === 'table') {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content">
                        <div style={{ flexDirection: 'row' }}>
                            <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.plans })}>ตารางข้อมูล</Button>
                            <Button variant="info" onClick={() => this.setState({ page: 'result' })}>สรุปข้อมูล</Button>
                        </div>
                        <hr>
                        </hr>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type1 })}>มิติครอบครัว</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type2 })}>มิติสิทธิเด็ก</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type3 })}>มิติเด็กมีส่วนร่วม</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type4 })}>มิติสุขภาพ</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type5 })}>มิติปลอดภัย</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type6 })}>มิติการเรียนรู้</Button>
                        <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.type7 })}>มิติพื้นที่สร้างสรรค์</Button>
                        <hr></hr>
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
                </div >
            )
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content">
                        <div style={{ flexDirection: 'row' }}>
                            <Button variant="info" onClick={() => this.setState({ page: 'table', select_Type: this.state.plans })}>ตารางข้อมูล</Button>
                            <Button variant="info" onClick={() => this.setState({ page: 'result' })}>สรุปข้อมูล</Button>
                        </div>
                        <hr>
                        </hr>
                        <CanvasJSChart options={optionsNetworks} />
                    </div>
                </div >
            )
        }
    }
}
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});
//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user_network
};
export default connect(mapStateToProps, mapDispatchToProps)(Networks);