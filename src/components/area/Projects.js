import React, { Component } from 'react';
import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';
import { MDBDataTable } from "mdbreact";
import { isEmptyValue } from '../Methods';
import { Row, Col } from 'react-bootstrap';
import { MdAssignmentTurnedIn, MdDeleteForever, MdKeyboardArrowLeft, MdEdit } from "react-icons/md";
export class Projects extends Component {
    constructor(props) {
        super(props);
        this.tbProject = Firebase.firestore().collection('PROJECTS');
        this.tbArea = Firebase.firestore().collection('AREAS');
        this.state = {
            list_projects: [],
            list_areas: [],
            view_data: null,
            Suggestion: '',
        }


    }
    componentDidMount() {
        this.tbArea.onSnapshot(this.get_list_areas);
        this.tbProject.onSnapshot(this.get_list_projects);
    }
    get_list_projects = (querySnapshot) => {
        const list_projects = [];

        querySnapshot.forEach((doc) => {
            var temp_data = this.getAreadata(doc.data().Area_local_ID);
            var Status = 'รอพิจารณา';
            if (!isEmptyValue(doc.data().Status)) {

                Status = doc.data().Status
            } else {
                Status = (<p color="#"></p>)
            }
            list_projects.push({
                ...doc.data(), PID: doc.id, ...temp_data,
                Dominance_full: temp_data.Dominance + temp_data.Area_name, Status,
                edit: (<div>
                    <button><MdAssignmentTurnedIn size="30" color="#ef03dd"
                        onClick={() => this.setState({
                            view_data: {
                                ...doc.data(), PID: doc.id, ...temp_data,
                                Dominance_full: temp_data.Dominance + temp_data.Area_name, Status,
                                Mentor_name: this.getUser(doc.data().Mentor),
                                Leader1_name: this.getUser(doc.data().Leader1),
                                Leader2_name: this.getUser(doc.data().Leader2),
                                Leader3_name: this.getUser(doc.data().Leader3),
                            }
                        })} /></button>
                    <button><MdDeleteForever size="30" color="#ff0000" onClick={this.delete.bind(this, doc.data(), doc.id)} /></button>
                </div>)
            })
        })
        this.setState({
            list_projects
        })
    }
    get_list_areas = (querySnapshot) => {
        const list_areas = [];

        querySnapshot.forEach((doc) => {
            list_areas.push({ ...doc.data(), ID: doc.id })
        })
        this.setState({
            list_areas
        })
    }
    getAreadata(id) {
        var data = [];
        for (let index = 0; index < this.state.list_areas.length; index++) {

            if (id === this.state.list_areas[index].ID) {

                data = this.state.list_areas[index];
                index = this.state.list_areas.length
            }
        }

        return data;
    }
    delete(data, id) {
        var desertRef = Firebase.storage().refFromURL(data.File_URL);
        desertRef.delete().then(function () {
            console.log("delete File and image sucess");
        }).catch(function (error) {
            console.log("image No such document! " + data);
        });
        this.tbProject.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({
                add: false, edit: '',
            });
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    getUser = (id) => {
        var data = "";
        if (!isEmptyValue(id)) {
            Firebase.firestore().collection("USERS").doc(id).get()
                .then((doc) => {
                    data = doc.Name + " " + doc.Last_name;
                    return data;
                }).catch((error) => {
                    console.log(error, "getUser")
                })
        }

        return data;
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    approve = (e) => {
        e.preventDefault()
        if (!isEmptyValue(this.state.view_data)) {
            this.tbProject.doc(this.state.view_data.PID).update({
                Status: 'ผ่านการพิจารณา'
            }).then((doc) => {
                this.setState({
                    view_data: null
                })
            }).catch((error) => {
                console.log(error, 'error update status')
            })
        }
    }
    reject = (e) => {
        e.preventDefault()
        console.log(this.state.view_data)
        if (!isEmptyValue(this.state.view_data)) {
            this.tbProject.doc(this.state.view_data.PID).update({
                Status: 'ปรับปรุง', Suggestion: this.state.Suggestion
            }).then((doc) => {
                this.setState({
                    view_data: null
                })
            }).catch((error) => {
                console.log(error, 'error update status')
            })
        }
    }
    render() {
        const { view_data, Suggestion } = this.state;

        const data = {
            columns: [
                {
                    label: "โครงการ",
                    field: "Project_name",
                    sort: "asc"
                },
                {
                    label: "ประเภทการปกครอง",
                    field: "Dominance_full",
                    sort: "asc"
                },
                {
                    label: "ประเภทพื้นที่",
                    field: "Area_type",
                    sort: "asc"
                },
                {
                    label: "สถานะ",
                    field: "Status",
                    sort: "asc"
                },
                {
                    label: "แก้ไข",
                    field: "edit",
                    sort: "asc"
                }
            ],
            rows: this.state.list_projects
        };
        return (

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    <h1>โครงการทั้งหมดของพื้นที่</h1>

                    {!isEmptyValue(view_data) ?
                        <div>
                            <Row>
                                <Col sm="4">
                                    <h4>ชื่อโครงการ : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Project_name}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>คำอธิบาย : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Description}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>พี่เลี้ยง : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Mentor_name}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>หัวหน้าโครงการ1 : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Leader1_name}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>หัวหน้าโครงการ2 : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Leader2_name}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>หัวหน้าโครงการ3 : </h4>
                                </Col>
                                <Col>
                                    <h4>{view_data.Leader3_name}</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="4">
                                    <h4>ไฟล์โครงการ : </h4>
                                </Col>
                                <Col>
                                    {view_data.File_URL !== '' && <a href={view_data.File_URL}
                                    >ดาวโหลด</a>}
                                </Col>
                            </Row>
                            <Row>
                                <p>*หากต้องปรับปรุงแก้ไข ให้เพิ่มความคิดเห็น คำแนะนำ และกดยื่นปรับปรุง</p>
                            </Row>
                            <Row>
                                <Col>
                                    <textarea className="form-control" name="Suggestion" value={Suggestion} onChange={this.onChange}
                                        placeholder="ความคิดเห็น คำแนะนำ ต่อโครงการ"
                                        cols="80" rows="5" required>{Suggestion}</textarea>
                                </Col>

                            </Row>
                            <center>
                                <button className="btn btn-danger" style={{ color: '#ffffff' }}
                                    onClick={() => this.setState({ view_data: null })}><MdKeyboardArrowLeft size={20} />กลับ</button>
                                <button className="btn btn-warning" style={{ color: '#ffffff' }}
                                    onClick={this.reject.bind(this)}><MdEdit size={20} />ปรับปรุง</button>
                                <button className="btn btn-success" style={{ color: '#ffffff' }}
                                    onClick={this.approve.bind(this)}><MdAssignmentTurnedIn size={20} />ผ่านการพิจารณา</button>
                            </center>
                        </div>

                        :
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
                    }
                </div>
            </div>
        )
    }
}

export default Projects
