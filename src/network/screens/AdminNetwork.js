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
import moment from 'moment'
export class AdminNetwork extends Component {
    constructor(props) {
        super(props);
        this.tbUserNetwork = Firebase.firestore().collection(tableName.UserNetwork);
        this.tbAgency = Firebase.firestore().collection(tableName.Agency);
        this.tbPlanNetwork = Firebase.firestore().collection(tableName.PlanNetwork);
        console.log(this.props)
        this.state = {
            add_Plan: false,
            add: true,
            step: 1,
            laoding: false,
            ...this.props.fetchReducer.user_network,
            P_year: '',
            P_plan: '',
            P_activity: '',
            P_type: ['', '', '', '', '', '', ''],
            P_date2: '',
            P_other: '',
            changeP_date: false,
            plans: [],
            agencys: [],
            Agency_name: '',
            Position: '',
            Caretaker_name: '',
            Caretaker_Last_name: '',
            Agency_phone_number: '',
            Main_agency: '',
            selected_agency: ''
        }
    }
    setMe = (e) => {
        this.setState({
            Caretaker_name: this.state.Name,
            Caretaker_Last_name: this.state.Last_name
        })
    }
    componentDidMount() {
        // this.setState({
        //     loading: true
        // })
        // this.tbAgency.doc(this.state.Agency_ID).get().then((doc) => {
        //     this.setState({
        //         Agency_name: doc.data().Agency_name,
        //         Position: doc.data().Position,
        //         Caretaker_name: doc.data().Caretaker_name,
        //         Caretaker_Last_name: doc.data().Caretaker_Last_name,
        //         Agency_phone_number: doc.data().Agency_phone_number,
        //         step: 2, loading: false
        //     })
        // }).catch((error) => {
        //     console.log('getAgency', error)
        // })
        if (!isEmptyValue(this.state.selected_agency)) {
            this.tbPlanNetwork.where("Agency_ID", '==', this.state.selected_agency.ID).onSnapshot(this.onListPlan)
        }
        // this.tbPlanNetwork.where("Agency_ID", '==', this.state.Agency_ID).onSnapshot(this.onListPlan)
        this.tbAgency.onSnapshot(this.onListAgency);
    }
    onSelectedAgency(data) {
        this.setState({
            selected_agency: data
        })
        console.log(data.ID)

        this.tbPlanNetwork.where("Agency_ID", '==', data.ID).onSnapshot(this.onListPlan)
    }
    onListAgency = (query) => {
        const agencys = [];
        let number = 1;
        query.forEach(doc => {
            const { Caretaker_name, Caretaker_Last_name, Create_Role } = doc.data();
            agencys.push({
                ...doc.data(),
                ID: doc.id,
                caretaker_name: Caretaker_name + " " + Caretaker_Last_name,
                Role: <p style={{ color: '#ff0000' }}>{Create_Role}</p>,
                edit: <button
                    style={{
                        backgroundColor: "#7bbdff", color: '#ffffff', borderColor: '#ffffff',
                        borderRadius: 5, border: "1px solid", padding: 3
                    }}
                    onClick={this.onSelectedAgency.bind(this, { ID: doc.id, ...doc.data() })}>เลือก</button>
            })
            number++
        })
        this.setState({
            agencys
        })
    }
    onListPlan = (query) => {
        const plans = [];
        let number = 1;
        query.forEach(doc => {
            const { P_type, P_date } = doc.data();
            let types = ""
            P_type.forEach((element, i) => {
                if (!isEmptyValue(element)) {
                    types += P_type[i];
                    if (i !== 6) {
                        types += ","
                    }

                }
            });
            const temp_date = new Date(P_date.seconds * 1000);
            const date = temp_date.getDate() + "/" + (parseInt(temp_date.getMonth(), 10) + 1)
                + "/" + (parseInt(temp_date.getFullYear(), 10) + 543);
            plans.push({
                ID: doc.id,
                number,
                ...doc.data(),
                date,
                types
            })
            number++
        });

        this.setState({
            plans
        })
    }
    onSubmitAgency = () => {
        this.setState({
            loading: true
        })
        const { Name, Last_name, Nickname, Sex, Phone_number, Birthday, Avatar_URL, uid } = this.state;
        const { Agency_name, Caretaker_name, Caretaker_Last_name, Position, Agency_phone_number, Main_agency } = this.state;
        this.tbAgency.add({
            Main_agency,
            Agency_name,
            Caretaker_name,
            Caretaker_Last_name,
            Position,
            Agency_phone_number,
            Create_By_ID: uid,
            Create_Role: 'admin',
            Create_date: Firebase.firestore.Timestamp.now()
        }).then((result) => {
            this.setState({
                loading: false,
                step: 2
            })
            confirmAlert({
                title: 'บันทึกสำเร็จ',
                message: '',
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: 'ตกลง',

                    },

                ]
            });

        }).catch((error) => {
            console.log('error', error)
            this.setState({
                loading: false
            })
            confirmAlert({
                title: 'บันทึกไม่สำเร็จ',
                message: ' ระบบผิดพลาด',
                closeOnClickOutside: true,
                buttons: [
                    {
                        label: 'ตกลง',

                    },

                ]
            });

        })


    }
    onSubmitPlan = (e) => {
        e.preventDefault();
        const { P_year, P_plan, P_activity, P_type, P_date2, P_other, P_date } = this.state;
        this.setState({
            laoding: true
        })
        let temp_date = ''
        if (this.state.changeP_date) {
            temp_date = P_date2
        } else {
            temp_date = P_date
        }
        this.tbPlanNetwork.add({
            P_year, P_plan, P_activity, P_type, P_date: temp_date, P_other,
            Agency_ID: this.state.selected_agency.ID,
            Agency_name: this.state.Agency_name,
            Create_date: Firebase.firestore.Timestamp.now(),
            Create_By_ID: this.state.uid
        }).then(() => {
            this.setState({
                P_year: '',
                P_plan: '',
                P_activity: '',
                P_type: ['', '', '', '', '', '', ''],
                P_date2: '',
                P_other: '',
                add_Plan: false,
                changeP_date: false,
                loading: false
            })
        }).catch((error) => {
            console.log('error', error)
            this.setState({
                loading: false
            })
        })
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onCancel = () => {
        this.setState({
            Agency_name: '',
            Position: '',
            Caretaker_name: '',
            Caretaker_Last_name: '',
            Agency_phone_number: '',
            add: false
        })
    }
    onCancelPlan = () => {
        this.setState({
            P_year: '',
            P_plan: '',
            P_activity: '',
            P_type: ['', '', '', '', '', '', ''],
            P_date2: '',
            P_other: '',
            add_Plan: false,
            changeP_date: false,
            loading: false
        })
    }
    onTypeChange(index, value) {
        let temp_type = this.state.P_type;

        if (isEmptyValue(temp_type[index])) {
            temp_type[index] = value;
        } else {
            temp_type[index] = "";
        }
        this.setState({
            P_type: temp_type
        })
    }
    render() {
        const { Agency_name, Caretaker_name, Caretaker_Last_name, Position, Agency_phone_number, Main_agency } = this.state;
        const { add, step, add_Plan } = this.state;
        const { P_year, P_plan, P_activity, P_type, P_date2, P_other, selected_agency, plans } = this.state;
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
                    label: "แก้ไข",
                    field: "edit",
                    sort: "asc",
                    width: 150
                }
            ],
            rows: this.state.plans
        };
        const dataAgencys = {
            columns: [
                {
                    label: "#",
                    field: "number",
                    sort: "asc",
                    width: 50
                },
                {
                    label: "หน่วยงาน",
                    field: "Agency_name",
                    sort: "asc",
                    width: 300
                },
                {
                    label: "ผู้รับผิดชอบ",
                    field: "caretaker_name",
                    sort: "asc",
                    width: 300
                },
                {
                    label: "ผู้รับผิดชอบ",
                    field: "Position",
                    sort: "asc",
                    width: 300
                },
                {
                    label: "เบอร์โทรติดต่อ",
                    field: "Agency_phone_number",
                    sort: "asc",
                    width: 100
                },
                {
                    label: "สถานะ",
                    field: "Role",
                    sort: "asc",
                    width: 100
                },
                {
                    label: "แก้ไข",
                    field: "edit",
                    sort: "asc",
                    width: 150
                }
            ],
            rows: this.state.agencys
        };
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else if (isEmptyValue(selected_agency)) {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>

                    <div className="content" style={{ alignItems: 'center ', display: 'flex', flexDirection: 'column' }}>
                        <form className="login100-form validate-form" style={{
                            border: '1px solid',
                            padding: 20, borderColor: '#808080', width: '90%',
                            justifyContent: 'center ', display: 'flex'
                        }}>
                            <Col sm={16}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ชื่อหน่วยงาน: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Agency_name" value={Agency_name} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">เบอร์โทรติดต่อ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="tel"
                                            className="form-control" name="Agency_phone_number" value={Agency_phone_number} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ชื่อผู้รับผิดชอบ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Caretaker_name" value={Caretaker_name} onChange={this.onChange} required />
                                        <button style={{ color: "#0080c0", cursor: 'pointer' }} onClick={this.setMe}><u>me</u></button>
                                    </Col>
                                    <Form.Label column sm="3">นามสกุลผู้รับผิดชอบ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Caretaker_Last_name" value={Caretaker_Last_name} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ตำแหน่ง: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Position" value={Position} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">หน่วยงานหลัก: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Main_agency" value={Main_agency} onChange={this.onChange} />
                                    </Col>
                                </Form.Group>
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <button className="login100-form-btn" type="submit" style={{ width: 175 }} onClick={this.onSubmitAgency}>บันทึก</button>
                                    <button className="login100-form-btn2" type="button" style={{ width: 175 }} onClick={this.onCancel}>ยกเลิก</button>
                                </div>
                            </Col>
                        </form>
                        <div className="login100-form validate-form" style={{
                            border: '1px solid',
                            padding: 20, borderColor: '#808080', width: '90%',
                            justifyContent: 'center ', marginTop: 10
                        }}>
                            <MDBDataTable
                                striped
                                bordered
                                small
                                searchLabel="ค้นหา"
                                paginationLabel={["ก่อนหน้า", "ถัดไป"]}
                                infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
                                entriesLabel="แสดง รายการ"
                                data={dataAgencys}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content" style={{ alignItems: 'center ', display: 'flex', flexDirection: 'column' }}>
                        <div className="login100-form validate-form" style={{
                            border: '1px solid',
                            padding: 20, borderColor: '#808080', width: '90%',
                            justifyContent: 'center ', display: 'flex'
                        }}>
                            <Col sm={16}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ชื่อหน่วยงาน: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Agency_name" value={selected_agency.Agency_name} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">เบอร์โทรติดต่อ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="tel" disabled
                                            className="form-control" name="Agency_phone_number" value={selected_agency.Agency_phone_number}
                                            onChange={this.onChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ชื่อผู้รับผิดชอบ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Caretaker_name" value={selected_agency.Caretaker_name} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">นามสกุลผู้รับผิดชอบ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Caretaker_Last_name" value={selected_agency.Caretaker_Last_name} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="3">ตำแหน่ง: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Position" value={selected_agency.Position} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">หน่วยงานหลัก: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Main_agency" value={selected_agency.Main_agency} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <button className="login100-form-btn2" type="button" style={{ width: 175 }} onClick={() => this.setState({ selected_agency: '' })}>ยกเลิก</button>
                                </div>
                            </Col>

                        </div>
                        <div className="login100-form validate-form" style={{
                            border: '1px solid',
                            padding: 20, borderColor: '#808080', width: '90%',
                            justifyContent: 'center ', marginTop: 10
                        }}>
                            {add_Plan ?
                                <form onSubmit={this.onSubmitPlan.bind(this)}>
                                    <Col sm={16}>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">แผนงาน: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="P_plan" value={P_plan} onChange={this.onChange}
                                                    placeholder="รายละเอียดแผนงาน"
                                                    cols="80" rows="5" required>{P_plan}</textarea>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">กิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="P_activity" value={P_activity} onChange={this.onChange}
                                                    placeholder="รายละเอียดกิจกรรม"
                                                    cols="80" rows="5" >{P_activity}</textarea>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="number" placeholder="พ.ศ."
                                                    className="form-control" name="P_year" value={P_year} onChange={this.onChange} required />
                                            </Col>
                                            <Form.Label column sm="3">วันเวลา: </Form.Label>
                                            <Col>
                                                <div className="form-control">
                                                    <DatePicker
                                                        locale="th"
                                                        dateFormat="dd/MM/yyyy"
                                                        selected={P_date2}
                                                        onChange={str => this.setState({
                                                            P_date2: str, changeP_date: true
                                                        })}
                                                        placeholderText="วัน/เดือน/ปี(ค.ศ.)"
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                    />
                                                </div>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">หมายเหตุ: </Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="P_other" value={P_other} onChange={this.onChange}
                                                    placeholder=""
                                                    cols="80" rows="5" >{P_other}</textarea>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">เมืองน่าอยู่ 7 มิติ: </Form.Label>
                                            <Col>
                                                <div style={{ marginTop: 5 }}>
                                                    <input type="checkbox" id="type1" name="type1" value="type1" onChange={this.onTypeChange.bind(this, 0, 'มิติครอบครัว')} />
                                                    <label htmlFor="type1" style={{ marginLeft: 5 }}><u>มิติครอบครัว</u></label>
                                                    <label htmlFor="type1" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่มีการส่งเสริมความเข้มแข็งของครอบครัว  เช่น  การจัดระบบสวัสดิการสำหรับครอบครัวที่ยากลำบาก
                                                        การมีครอบครัวทดแทนสำหรับเด็กที่กำพร้าหรือถูกทอดทิ้ง  การเสริมสร้างความรู้ในการเลี้ยงดูลูกให้แก่พ่อแม่และคู่แต่งงานใหม่
                                                      การปรับปรุงระบบการดูแลเด็กในระดับชุมชน  ตลอดจนการรณรงค์ทางสังคม</label>
                                                    <br></br>
                                                    <input type="checkbox" id="type2" name="type2" value="type2" onChange={this.onTypeChange.bind(this, 1, 'มิติสิทธิเด็ก')} />
                                                    <label htmlFor="type2" style={{ marginLeft: 5 }}>มิติสิทธิเด็ก</label>
                                                    <label htmlFor="type2" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มีกลไกที่มีประสิทธิภาพในการคุ้มครองสิทธิเด็ก   เช่น  การมีมาตรการคุ้มครองดูแลเด็กจากการถูกละเมิดสิทธิ์ในลักษณะต่างๆ
                                                    </label>
                                                    <br></br>
                                                    <input type="checkbox" id="type3" name="type3" value="type3" onChange={this.onTypeChange.bind(this, 2, 'มิติเด็กมีส่วนร่วม')} />
                                                    <label htmlFor="type3" style={{ marginLeft: 5 }}>มิติเด็กมีส่วนร่วม</label>
                                                    <label htmlFor="type3" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่ส่งเสริมการมีส่วนร่วมของเด็ก เช่น การส่งเสริมบทบาทของสภาเยาวชนและองค์กรเด็กในจังหวัด
                                                        การมีกลไกให้เด็กมีส่วนร่วมในการวิพากษ์แผนพัฒนาจังหวัดในส่วนที่มีผลกับเด็ก
                                                    การทำการศึกษาผลกระทบต่อเด็ก (child impact assessment)</label>
                                                    <br></br>
                                                    <input type="checkbox" id="type4" name="type4" value="type4" onChange={this.onTypeChange.bind(this, 3, 'มิติสุขภาพ')} />
                                                    <label htmlFor="type4" style={{ marginLeft: 5 }}>มิติสุขภาพ</label>
                                                    <label htmlFor="type4" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่ส่งเสริมเรื่องสุขภาพพลานามัยของเด็ก  เช่น  การปรับปรุงบริการสุขภาพสำหรับเด็กทั่วไป
                                                        การมีมาตรการพิเศษในการดูแลสุขภาพเด็กกลุ่มเสี่ยง  เช่น  กลุ่มพ่อแม่วัยรุ่น  เด็กพิการ  เด็กต่างด้าว  การรณรงค์ด้านสุขภาพอื่นๆ
                                                        เช่น  การรณรงค์ลดละเลิกเหล้าบุหรี่ในวัยรุ่น  การรณรงค์เรื่องนิสัยการกินและการบริโภคอาหารสุขภาพ
                                                        การรณรงค์เรื่องการออกกำลังกาย</label>
                                                    <br></br>
                                                    <input type="checkbox" id="type5" name="type5" value="type5" onChange={this.onTypeChange.bind(this, 4, 'มิติปลอดภัย')} />
                                                    <label htmlFor="type5" style={{ marginLeft: 5 }}>มิติปลอดภัย</label>
                                                    <label htmlFor="type5" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่ส่งเสริมความปลอดภัยสำหรับเด็ก   เช่น การออกแบบทางกายภาพให้ถนนหนทาง โรงเรียน
                                                        มีความปลอดภัยสำหรับการใช้งานของเด็ก  การลดพื้นที่เสี่ยงพื้นที่อันตรายสำหรับเด็กในเขตเมือง
                                                        โดยประเมินผลจากสถิติอุบัติเหตุที่เกิดกับเด็กในโรงเรียน ชุมชน ถนนหนทางที่ลดลง
                                                        สถิติอาชญากรรมที่เยาวชนเข้าไปเกี่ยวข้อง  สถิติการละเมิดทางเพศ
                                                        ตลอดจนการสำรวจความรู้สึกปลอดภัยในการใช้ชีวิตประจำวันของเด็ก  เป็นต้น</label>
                                                    <br></br>
                                                    <input type="checkbox" id="type6" name="type6" value="type6" onChange={this.onTypeChange.bind(this, 5, 'มิติการเรียนรู้')} />
                                                    <label htmlFor="type6" style={{ marginLeft: 5 }}>มิติการเรียนรู้</label>
                                                    <label htmlFor="type6" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่ส่งเสริมการเรียนรู้ของเด็ก  เช่น  การระดมทุนท้องถิ่นในการพัฒนาการศึกษา  การลงทุนในโครงสร้างพื้นฐานด้านการศึกษา
                                                        การพัฒนาครูในท้องถิ่น  การพัฒนาแหล่งเรียนรู้บนฐานภูมิปัญญาท้องถิ่น
                                                        การลงทุนในการพัฒนาโรงเรียนลักษณะพิเศษสำหรับเด็กด้อยโอกาส  เป็นต้น</label>
                                                    <br></br>
                                                    <input type="checkbox" id="type7" name="type7" value="type7" onChange={this.onTypeChange.bind(this, 6, 'มิติพื้นที่สร้างสรรค์')} />
                                                    <label htmlFor="type7" style={{ marginLeft: 5 }}>มิติพื้นที่สร้างสรรค์</label>
                                                    <label htmlFor="type7" style={{ marginLeft: 5, color: '#808080' }}>
                                                        มิติที่ส่งเสริมเรื่องพื้นที่สร้างสรรค์สำหรับเด็ก  เช่น  การปรับปรุงพื้นที่สาธารณะ  เช่น  สนามกีฬา  พิพิธภัณฑ์  สวนสาธารณะ
                                                      ลานกิจกรรม  ทั้งในด้านปริมาณและ  คุณภาพเพื่อให้เด็กเข้าถึงและใช้งานได้สะดวก  การเพิ่มสนามเด็กเล่น ลานเยาวชน  ถนนเด็กเดิน</label>
                                                    <br></br>
                                                </div>
                                            </Col>

                                        </Form.Group>
                                        <div style={{ justifyContent: 'center', display: 'flex' }}>
                                            <button className="login100-form-btn" type="submit" style={{ width: 175 }}>บันทึก</button>
                                            <button className="login100-form-btn2" type="button" style={{ width: 175 }} onClick={this.onCancelPlan}>ยกเลิก</button>
                                        </div>
                                    </Col>
                                </form>
                                :
                                <>
                                    <center>
                                        <button className="login100-form-btn" type="button" style={{ width: 175 }}
                                            onClick={() => this.setState({ add_Plan: true })}>เพิ่มข้อมูลแผน</button>
                                    </center>
                                    <MDBDataTable
                                        striped
                                        bordered
                                        small
                                        searchLabel="ค้นหา"
                                        paginationLabel={["ก่อนหน้า", "ถัดไป"]}
                                        infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
                                        entriesLabel="แสดง รายการ"
                                        data={data}
                                    /></>}
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminNetwork);