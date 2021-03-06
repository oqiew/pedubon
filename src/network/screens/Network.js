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

export class Network extends Component {
    constructor(props) {
        super(props);
        this.tbUserNetwork = Firebase.firestore().collection(tableName.UserNetwork);
        this.tbAgency = Firebase.firestore().collection(tableName.Agency);
        this.tbPlanNetwork = Firebase.firestore().collection(tableName.PlanNetwork);
        if (isEmptyValue(this.props.fetchReducer.user_network.Agency_ID)) {
            this.state = {
                add: false,
                step: 1,
                list_agency: [],
                Agency_name: '',
                Caretaker_name: '',
                Caretaker_Last_name: '',
                Main_agency: '',
                laoding: false,
                mouth: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
                ...this.props.fetchReducer.user_network,
            }
        } else {

            this.state = {
                add_Plan: false,
                add: true,
                step: 2,
                laoding: false,
                ...this.props.fetchReducer.user_network,
                P_year: 2563,
                Year: 2563,
                Year2: 2563,
                P_plan: '',
                P_activity: '',
                P_type: ['', '', '', '', '', '', ''],
                mouth: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
                M1: '', M2: '',
                P_other: '',
                plans: [],
                Agency_name: '',
                Caretakers: '',
                Main_agency: '',
            }
        }

    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        this.tbAgency.onSnapshot(this.getListAgrncy);
        if (!isEmptyValue(this.state.Agency_ID)) {
            this.getAgency();
        } else {
            this.setState({
                step: 1,
                loading: false
            })
        }

    }
    selectAgency(Agency_name, id, Main_agency) {
        this.setState({ Agency_name, Agency_ID: id, Main_agency }, () => {
            this.getAgency()
        })

    }
    getListAgrncy = (query) => {
        const list_agency = [];
        query.forEach((doc) => {
            const { Agency_name, Main_agency } = doc.data();
            list_agency.push({
                ID: doc.id,
                ...doc.data(),
                edit: <div>
                    <Button variant="info" onClick={this.selectAgency.bind(this, Agency_name, doc.id, Main_agency)}>เลือก</Button>
                </div>
            })
        })
        this.setState({
            list_agency
        })
    }
    getAgency() {
        this.tbAgency.doc(this.state.Agency_ID).get().then((doc) => {
            this.setState({
                Agency_name: doc.data().Agency_name,
                Main_agency: doc.data().Main_agency,
                step: 2, loading: false
            })
        }).catch((error) => {
            this.setState({
                step: 1,
                loading: false
            })
        })
        this.tbPlanNetwork.where("Agency_ID", '==', this.state.Agency_ID).orderBy('Create_date', 'asc').onSnapshot(this.onListPlan)
    }
    onDeletePlans(id) {
        this.tbPlanNetwork.doc(id).delete().then((result) => {
            console.log('delete plan success')
        }).catch((error) => {
            console.log('can not delete plan')
        })
    }
    onListPlan = (query) => {
        const plans = [];
        let number = 1;
        query.forEach(doc => {
            const { P_type, M1, M2, Year, Year2, P_year } = doc.data();
            let types = ""
            P_type.forEach((element, i) => {
                if (!isEmptyValue(element)) {
                    types += P_type[i];
                    if (i !== 6) {
                        types += ","
                    }

                }
            });

            const date = (M1 === M2 && Year === Year2) ? M2 + " " + Year : M1 + "/" + Year + "-" + M2 + "/" + Year2;

            plans.push({
                ID: doc.id,
                number,
                ...doc.data(),
                date,
                types,
                edit: <Button variant="danger" onClick={this.onDeletePlans.bind(this, doc.id)}>ลบ</Button>
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
        const { Agency_name, Main_agency } = this.state;
        this.tbAgency.add({
            Agency_name,

            Create_By_ID: uid,
            Main_agency,
            Create_date: Firebase.firestore.Timestamp.now()
        }).then((result) => {
            this.tbUserNetwork.doc(this.state.uid).update({
                Agency_ID: result.id,
                Update_date: Firebase.firestore.Timestamp.now()
            }).then(() => {
                this.props.fetch_user_network({
                    uid: this.state.uid,
                    email: this.state.email,
                    Name, Last_name, Nickname, Sex, Phone_number, Birthday, Avatar_URL,
                    Agency_ID: result.id,
                    Agency_name,

                });
                this.setState({
                    loading: false,
                    step: 2,
                    Agency_ID: result.id,
                })

                confirmAlert({
                    title: 'บันทึกสำเร็จ',
                    message: '',
                    closeOnClickOutside: true,

                    buttons: [
                        {
                            label: 'ตกลง',
                            onClick: () => this.getAgency()
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
        const { Year, Year2, P_year, P_plan, P_activity, P_type, P_other, Agency_ID, M1, M2, Caretakers } = this.state;
        this.setState({
            laoding: true
        })
        this.tbPlanNetwork.add({
            Year, P_plan, P_activity, P_type, P_other, M1, M2, Year2, P_year,
            Agency_ID: this.state.Agency_ID,
            Caretakers,
            Agency_name: this.state.Agency_name,
            Create_date: Firebase.firestore.Timestamp.now(),
            Create_By_ID: this.state.uid
        }).then(() => {
            this.setState({
                P_year: 2563,
                Year: 2563,
                Year2: 2563,
                P_plan: '',
                P_activity: '',
                P_type: ['', '', '', '', '', '', ''],
                P_date2: '',
                P_other: '',
                M1: '', M2: '',
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
            Main_agency: '',
            add: false
        })
    }
    onCancelPlan = () => {
        this.setState({
            P_year: 2563,
            Year: 2563,
            Year2: 2563,
            P_plan: '',
            P_activity: '',
            P_type: ['', '', '', '', '', '', ''],
            P_date2: '',
            P_other: '',
            M1: '', M2: '',
            add_Plan: false,
            changeP_date: false,
            loading: false
        })
    }
    onTypeChange(index, value) {
        let temp_type = this.state.P_type;
        console.log(temp_type)
        if (isEmptyValue(temp_type[index])) {
            temp_type[index] = value;
        } else {
            temp_type[index] = "";
        }
        this.setState({
            P_type: temp_type
        })
    }
    onDateChange = (name, value) => {
        if (name === 'M1') {
            if (this.state.M2 === '') {
                this.setState({
                    M1: value,
                    M2: value
                })
            } else {

                this.setState({
                    M1: value
                })
            }
        } else {
            this.setState({
                M2: value
            })
        }
    }
    render() {
        const { Agency_name, Caretakers, Main_agency } = this.state;
        const { add, step, add_Plan } = this.state;
        const { Year, Year2, P_year, P_plan, P_activity, P_type, P_other, Role, mouth, M1, M2 } = this.state;
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
        const dataAgency = {
            columns: [

                {
                    label: "องค์กร",
                    field: "Agency_name",
                    sort: "asc",
                    width: 300
                },


                {
                    label: "แก้ไข",
                    field: "edit",
                    sort: "asc",
                    width: 150
                }
            ],
            rows: this.state.list_agency
        };
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else if (step === 1) {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content" style={{ justifyContent: 'center ', display: 'flex' }}>

                        {(add) ?
                            <form className="login100-form validate-form" style={{
                                border: '1px solid',
                                padding: 20, borderColor: '#808080', width: '90%',
                                justifyContent: 'center ', display: 'flex'
                            }}>
                                <Col sm={24}>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ชื่อหน่วยงาน: </Form.Label>
                                        <Col sm={5}>
                                            <input type="text" className="form-control" name="Agency_name" value={Agency_name} onChange={this.onChange} required />
                                        </Col>
                                        <Form.Label column sm="3">หน่วยงานหลัก: </Form.Label>
                                        <Col>
                                            <input type="text" className="form-control" name="Main_agency" value={Main_agency} onChange={this.onChange} required />
                                        </Col>
                                    </Form.Group>
                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <button className="login100-form-btn" type="submit" style={{ width: 175 }} onClick={this.onSubmitAgency}>บันทึก</button>
                                        <button className="login100-form-btn2" type="button" style={{ width: 175 }} onClick={this.onCancel}>ยกเลิก</button>
                                    </div>
                                </Col>
                            </form>
                            :
                            <div className="login100-form validate-form" style={{
                                border: '1px solid',
                                padding: 20, borderColor: '#808080', width: '90%',
                                justifyContent: 'center ', display: 'flex'
                            }}>
                                <button className="login100-form-btn" type="button" style={{ width: 175 }} onClick={() => this.setState({ add: true })}>เพิ่มข้อมูลหน่วยงาน</button>
                            </div>
                        }

                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    {Role === 'admin' && <div className="content" style={{ alignItems: 'center ', display: 'flex', flexDirection: 'column' }}>
                        <>
                            <MDBDataTable
                                striped
                                bordered
                                small
                                searchLabel="ค้นหา"
                                paginationLabel={["ก่อนหน้า", "ถัดไป"]}
                                infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
                                entriesLabel="แสดง รายการ"
                                data={dataAgency}
                            />
                            <form className="login100-form validate-form" style={{
                                border: '1px solid',
                                padding: 20, borderColor: '#808080', width: '90%',
                                justifyContent: 'center ', display: 'flex'
                            }}>
                                <Col sm={16}>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="3">ชื่อหน่วยงาน: </Form.Label>
                                        <Col>
                                            <input type="text" className="form-control" name="Agency_name" value={Agency_name} onChange={this.onChange} required />
                                        </Col>
                                        <Form.Label column sm="3">หน่วยงานหลัก: </Form.Label>
                                        <Col>
                                            <input type="text" className="form-control" name="Main_agency" value={Main_agency} onChange={this.onChange} required />
                                        </Col>
                                    </Form.Group>

                                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                                        <button className="login100-form-btn" type="submit" style={{ width: 175 }} onClick={this.onSubmitAgency}>บันทึก</button>
                                        <button className="login100-form-btn2" type="button" style={{ width: 175 }} onClick={this.onCancel}>ยกเลิก</button>
                                    </div>
                                </Col>
                            </form>
                        </>
                    </div>}

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
                                        <input type="text" disabled className="form-control" name="Agency_name" value={Agency_name} onChange={this.onChange} required />
                                    </Col>
                                    <Form.Label column sm="3">หน่วยงานหลัก: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" disabled className="form-control" name="Main_agency" value={Main_agency} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
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
                                            <Form.Label column sm="3">กิจกรรม: </Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="P_activity" value={P_activity} onChange={this.onChange}
                                                    placeholder="รายละเอียดกิจกรรม"
                                                    cols="80" rows="5" >{P_activity}</textarea>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">ผู้รับผิดชอบ: </Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="Caretakers" value={Caretakers} onChange={this.onChange}
                                                    placeholder="ผู้รับผิดชอบ"
                                                    cols="80" rows="5" >{Caretakers}</textarea>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">วันเวลาเรี่ม: </Form.Label>
                                            <Col>
                                                <Form.Control as="select" value={M1} onChange={str => this.onDateChange('M1', str.target.value)}>
                                                    <option value="">เลือก...</option>
                                                    {mouth.map((element, i) =>
                                                        <option key={i} value={element}>{element}</option>
                                                    )}
                                                </Form.Control>
                                            </Col>
                                            <Form.Label column sm="3">วันเวลาสิ้นสุด: </Form.Label>
                                            <Col>
                                                <Form.Control as="select" value={M2} onChange={str => this.onDateChange('M2', str.target.value)}>
                                                    <option value="">เลือก...</option>
                                                    {mouth.map((element, i) =>
                                                        <option key={i} value={element}>{element}</option>
                                                    )}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">ปีดำเนินการเริ่ม: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="number" placeholder="พ.ศ."
                                                    className="form-control" name="Year" value={Year} onChange={this.onChange} required />
                                            </Col>
                                            <Form.Label column sm="3">ปีดำเนินการสิ้นสุด: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="number" placeholder="พ.ศ."
                                                    className="form-control" name="Year2" value={Year2} onChange={this.onChange} required />
                                            </Col>

                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">ปีงบประมาณ: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="number" placeholder="พ.ศ."
                                                    className="form-control" name="P_year" value={P_year} onChange={this.onChange} required />
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
                </div >
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
    fetch_user_network
};

export default connect(mapStateToProps, mapDispatchToProps)(Network);