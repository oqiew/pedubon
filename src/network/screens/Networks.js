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
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class Networks extends Component {
    constructor(props) {
        super(props);
        this.tbPlanNetwork = Firebase.firestore().collection(tableName.PlanNetwork);
        this.state = {
            loading: false,
            query_plans: [],
            plans: [],
            main_year: 2564,
            page: 'table',
            type1: [],
            type2: [],
            type3: [],
            type4: [],
            type5: [],
            type6: [],
            type7: [],
            query_type1: [],
            query_type2: [],
            query_type3: [],
            query_type4: [],
            query_type5: [],
            query_type6: [],
            query_type7: [],
            select_Type: 'ทั้งหมด',
            numAllplans: 0,
        }
    }
    componentDidMount() {
        this.tbPlanNetwork.onSnapshot(this.onListPlan)
    }
    onChangeYear(data) {
        let query = '';
        if (this.state.select_Type === 'มิติครอบครัว') {
            query = this.state.query_type1;
        } else if (this.state.select_Type === 'มิติสิทธิเด็ก') {
            query = this.state.query_type2;
        } else if (this.state.select_Type === 'มิติเด็กมีส่วนร่วม') {
            query = this.state.query_type3;
        } else if (this.state.select_Type === 'มิติสุขภาพ') {
            query = this.state.query_type4;
        } else if (this.state.select_Type === 'มิติปลอดภัย') {
            query = this.state.query_type5;
        } else if (this.state.select_Type === 'มิติการเรียนรู้') {
            query = this.state.query_type6;
        } else if (this.state.select_Type === 'มิติพื้นที่สร้างสรรค์') {
            query = this.state.query_type7;
        } else {
            query = this.state.query_plans
        }
        const main_year = data.target.value;
        const plans = query.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        this.setState({
            plans,
            main_year
        })

    }
    onSelectType(data) {
        let query = '';
        if (data === 'มิติครอบครัว') {
            query = this.state.query_type1;
        } else if (data === 'มิติสิทธิเด็ก') {
            query = this.state.query_type2;
        } else if (data === 'มิติเด็กมีส่วนร่วม') {
            query = this.state.query_type3;
        } else if (data === 'มิติสุขภาพ') {
            query = this.state.query_type4;
        } else if (data === 'มิติปลอดภัย') {
            query = this.state.query_type5;
        } else if (data === 'มิติการเรียนรู้') {
            query = this.state.query_type6;
        } else if (data === 'มิติพื้นที่สร้างสรรค์') {
            query = this.state.query_type7;
        } else {
            query = this.state.query_plans
        }
        const plans = query.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        this.setState({
            page: 'table',
            plans,
            select_Type: data
        })
    }
    // changeUserType(data) {
    //     const { query_plans } = this.state;
    //     const regex = new RegExp(`${data.trim()}`, 'i');
    //     const plans = query_plans.filter(data => data.P_year.search(regex) >= 0)
    //     this.setState({
    //         plans
    //     })
    // }
    onChangeYear2(data) {
        const query = this.state.query_plans
        const main_year = data.target.value;
        const plans = query.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type1 = this.state.query_type1.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type2 = this.state.query_type2.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type3 = this.state.query_type3.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type4 = this.state.query_type4.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type5 = this.state.query_type5.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type6 = this.state.query_type6.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))
        let temp_type7 = this.state.query_type7.filter(data => parseInt(data.P_year, 10) === parseInt(main_year, 10))

        this.setState({
            type1: temp_type1,
            type2: temp_type2,
            type3: temp_type3,
            type4: temp_type4,
            type5: temp_type5,
            type6: temp_type6,
            type7: temp_type7,
            plans,
            main_year
        })

    }
    onResult() {
        const query = this.state.query_plans
        const plans = query.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type1 = this.state.query_type1.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type2 = this.state.query_type2.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type3 = this.state.query_type3.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type4 = this.state.query_type4.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type5 = this.state.query_type5.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type6 = this.state.query_type6.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        let temp_type7 = this.state.query_type7.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))

        this.setState({
            plans,
            type1: temp_type1,
            type2: temp_type2,
            type3: temp_type3,
            type4: temp_type4,
            type5: temp_type5,
            type6: temp_type6,
            type7: temp_type7,
            select_Type: 'ทั้งหมด',
            page: 'result'
        })
    }
    onListPlan = (query) => {
        this.setState({
            loading: true
        })
        const query_plans = [];
        const query_type1 = [];
        const query_type2 = [];
        const query_type3 = [];
        const query_type4 = [];
        const query_type5 = [];
        const query_type6 = [];
        const query_type7 = [];
        let number = 1;
        let numAllplans = 0;
        query.forEach(doc => {
            const { P_type, P_date, M1, M2, Year, Year2, P_year } = doc.data();
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
                        query_type1.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติสิทธิเด็ก') {
                        query_type2.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติเด็กมีส่วนร่วม') {
                        query_type3.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติสุขภาพ') {
                        query_type4.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติปลอดภัย') {
                        query_type5.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติการเรียนรู้') {
                        query_type6.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    } else if (element === 'มิติพื้นที่สร้างสรรค์') {
                        query_type7.push({
                            ID: doc.id,
                            number,
                            ...doc.data(),
                            date,
                            types
                        })
                    }
                }
            });

            query_plans.push({
                ID: doc.id,
                number,
                ...doc.data(),
                date,
                types,

            })
            number++
        });
        const plans = query_plans.filter(data => parseInt(data.P_year, 10) === parseInt(this.state.main_year, 10))
        this.setState({
            query_plans,
            plans,
            loading: false,
            type1: query_type1,
            type2: query_type1,
            type3: query_type1,
            type4: query_type1,
            type5: query_type1,
            type6: query_type1,
            type7: query_type1,
            query_type1,
            query_type2,
            query_type3,
            query_type4,
            query_type5,
            query_type6,
            query_type7,
            numAllplans
        })
    }
    render() {
        const { type1, type2, type3, type4, type5, type6, type7, query_plans, numAllplans, main_year, plans } = this.state;
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
            rows: this.state.plans
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
                            <Button variant="info" onClick={this.onSelectType.bind(this, 'ทั้งหมด')}>ตารางข้อมูล</Button>
                            <Button variant="info" onClick={this.onResult.bind(this)}>สรุปข้อมูล</Button>
                            <ExcelFile>
                                <ExcelSheet data={query_plans} name="ดาวโหลดไฟล์">
                                    <ExcelColumn label="หน่วยงาน" value="Agency_name" />
                                    <ExcelColumn label="กิจกรรม" value="P_activity" />
                                    <ExcelColumn label="แผนงาน" value="P_plan" />
                                    <ExcelColumn label="ช่วงเวลา" value="date" />
                                    <ExcelColumn label="ปีงบประมาณ" value="P_year" />
                                    <ExcelColumn label="เมืองน่าอยู่" value="types" />
                                </ExcelSheet>
                            </ExcelFile>
                        </div>
                        <hr>
                        </hr>
                        <Button variant={this.state.select_Type === 'ทั้งหมด' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'ทั้งหมด')}>ทั้งหมด</Button>
                        <Button variant={this.state.select_Type === 'มิติครอบครัว' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติครอบครัว')}>มิติครอบครัว</Button>
                        <Button variant={this.state.select_Type === 'มิติสิทธิเด็ก' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติสิทธิเด็ก')}>มิติสิทธิเด็ก</Button>
                        <Button variant={this.state.select_Type === 'มิติเด็กมีส่วนร่วม' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติเด็กมีส่วนร่วม')}>มิติเด็กมีส่วนร่วม</Button>
                        <Button variant={this.state.select_Type === 'มิติสุขภาพ' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติสุขภาพ')}>มิติสุขภาพ</Button>
                        <Button variant={this.state.select_Type === 'มิติปลอดภัย' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติปลอดภัย')}>มิติปลอดภัย</Button>
                        <Button variant={this.state.select_Type === 'มิติการเรียนรู้' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติการเรียนรู้')}>มิติการเรียนรู้</Button>
                        <Button variant={this.state.select_Type === 'มิติพื้นที่สร้างสรรค์' ? "light" : "info"} onClick={this.onSelectType.bind(this, 'มิติพื้นที่สร้างสรรค์')}>มิติพื้นที่สร้างสรรค์</Button>
                        <hr></hr>
                        <select className="form-control" id="main_year" name="main_year" value={main_year} onChange={(str) => this.onChangeYear(str)}>
                            <option value="2564">2564</option>
                            <option value="2563">2563</option>
                        </select>
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
                            <Button variant="info" onClick={this.onSelectType.bind(this, 'ทั้งหมด')}>ตารางข้อมูล</Button>
                            <Button variant="info" onClick={this.onResult.bind(this)}>สรุปข้อมูล</Button>
                        </div>
                        <hr>
                        </hr>
                        <select className="form-control" id="main_year" name="main_year" value={main_year} onChange={(str) => this.onChangeYear2(str)}>
                            <option value="2564">2564</option>
                            <option value="2563">2563</option>
                        </select>
                        <hr></hr>
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