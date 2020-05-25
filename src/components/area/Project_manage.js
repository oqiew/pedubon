import React, { Component } from 'react';
import Firebase from '../../Firebase';
import Topnav from "../top/Topnav";
import file from '../../test.docx';
import { Form, Row, Col } from "react-bootstrap";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue, GetCurrentDate } from "../Methods";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { connect } from "react-redux";
import { fetch_user } from "../../actions";
export class Project_manage extends Component {
    constructor(props) {
        super(props);
        this.tbProject = Firebase.firestore().collection('PROJECTS')
        this.state = {
            AProvince_ID: '', ADistrict_ID: '', Dominance: '', Area_type: '', Create_date: '',
            Informer_name: '', Informer_ID: '', LGO_ID: '', Area_name: '', Activity: '', Project_name: '',
            Province: '', District: '', Mentor: '', Leader1: '', Leader2: '', Leader3: '', Description: '',
            leader_local: [], mentors: [], File_URL: '', isUploading: false, File_name: '', progress: 0,
            list_projects: [], add: false, edit: '',
            // user
            ...this.props.fetchReducer.user,
        }
    }
    componentDidMount() {
        Firebase.firestore().collection('AREAS').doc(this.props.match.params.id).get().then((doc) => {
            Firebase.firestore().collection('USERS').where('User_type', '==', 'แกนนำเด็ก')
                .where('Area_PID', '==', doc.data().AProvince_ID).where('Area_DID', '==', doc.data().ADistrict_ID).onSnapshot(this.list_leader);
            Firebase.firestore().collection('USERS').where('User_type', '==', 'พี่เลี้ยง')
                .where('Area_PID', '==', doc.data().AProvince_ID).where('Area_DID', '==', doc.data().ADistrict_ID).onSnapshot(this.list_leader);
            this.tbProject.where('Area_local_ID', '==', this.props.match.params.id).onSnapshot(this.get_list_project);
            this.setState({
                Province: data_provinces[doc.data().AProvince_ID][0],
                District: data_provinces[doc.data().AProvince_ID][1][doc.data().ADistrict_ID][0],
                ...doc.data(),
            })
        })

    }
    get_list_project = (querySnapshot) => {
        const list_projects = [];
        querySnapshot.forEach((doc) => {
            list_projects.push({ ...doc.data(), ID: doc.id })
        })
        this.setState({
            list_projects
        })
    }
    list_leader = (querySnapshot) => {
        const leader_local = [];
        querySnapshot.forEach((doc) => {
            leader_local.push({ ...doc.data(), ID: doc.id })
        })
        this.setState({
            leader_local
        })
    }
    list_leader = (querySnapshot) => {
        const leader_local = [];
        querySnapshot.forEach((doc) => {
            leader_local.push({ ...doc.data(), ID: doc.id })
        })
        this.setState({
            leader_local
        })
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }
    handleChangeUsername = event =>
        this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        this.setState({ File_name: filename, progress: 100, isUploading: false, });
        Firebase
            .storage()
            .ref("Project_area")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ File_URL: url }));
    };
    delete(data) {
        if (this.state.User_ID === data.Informer_ID) {

            var desertRef = Firebase.storage().refFromURL(data.File_URL);
            desertRef.delete().then(function () {
                console.log("delete File and image sucess");
            }).catch(function (error) {
                console.log("image No such document! " + data);
            });
        } else {
            console.log("File image  No such document! ");
        }
        this.tbProject.doc(data.ID).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({
                add: false, edit: '',
            });
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });






    }
    onSubmitP = (e) => {
        e.preventDefault();

        console.log('save')
        const { Description, File_name, File_URL,
            Project_name, Name, User_ID,
            Leader1, Leader2, Leader3, Mentor } = this.state;
        if (isEmptyValue(this.state.edit)) {
            this.tbProject.add({
                Create_date: GetCurrentDate("/"), Area_local_ID: this.props.match.params.id,
                Informer_name: Name, Informer_ID: User_ID,
                Leader1, Leader2, Leader3, Mentor, Description, Project_name, File_name, File_URL,
            }).then((doc) => {
                this.setState({
                    Project_name: '',
                    Description: '',
                    Leader1: '', Leader2: '', Leader3: '', Mentor: '',
                    File_name: '', File_URL: '',
                    add: false, edit: ''
                })
            }).catch((error) => {
                console.log(error)
            })
        } else {
            this.tbProject.doc(this.state.edit).update({
                Create_date: GetCurrentDate("/"), Area_local_ID: this.props.match.params.id,
                Informer_name: Name, Informer_ID: User_ID,
                Leader1, Leader2, Leader3, Mentor, Description, Project_name, File_name, File_URL,
            }).then((doc) => {
                this.setState({
                    Project_name: '',
                    Description: '',
                    Leader1: '', Leader2: '', Leader3: '', Mentor: '',
                    File_name: '', File_URL: '',
                    add: false, edit: ''
                })
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    render() {
        const { Area_name, Dominance, Area_type, Description,
            Project_name,
            Leader1, Leader2, Leader3, Mentor } = this.state;

        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    <h1>{Dominance + Area_name} {Area_type}</h1>
                    <hr></hr>
                    <h1>โครงการจำนวน {this.state.list_projects.length} โครงการ</h1>
                    {this.state.list_projects.length === 0 && <h1>ยังไม่มีโครงการ</h1>}
                    {this.state.list_projects.map((element, i) =>
                        <Row key={i}>
                            <h1>{element.Project_name}</h1>
                            <button type="button" className="btn btn-success"
                                onClick={() =>
                                    this.setState({
                                        edit: element.ID,
                                        add: true,
                                        Project_name: element.Project_name,
                                        Description: element.Description,
                                        Leader1: element.Leader1, Leader2: element.Leader2, Leader3: element.Leader3
                                        , Mentor: element.Mentor, File_URL: element.File_URL

                                    })
                                }>แก้ไข</button>
                            <button type="button" className="btn btn-danger" onClick={this.delete.bind(this, element)}>ลบ</button>
                        </Row>
                    )}
                    <hr></hr>
                    <Row>
                        <button type="button" className="btn btn-success" onClick={() => this.setState({ add: true })}>เพิ่มโครงการ</button>
                        <button type="button" className="btn btn-danger" style={{ fontSize: 20 }}
                            onClick={() => this.props.history.goBack()}>กลับ</button>
                    </Row>

                    {this.state.add &&
                        <div>
                            <form onSubmit={this.onSubmitP}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>โครงการ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Project_name" value={Project_name} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>อธิบายโครงการ(แบบย่อ): <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <textarea className="form-control" name="Description" value={Description} onChange={this.onChange}
                                            placeholder="อธิบายโครงการ"
                                            cols="80" rows="5" required>{Description}</textarea>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>พี่เลี้ยง: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="sel1" name="Mentor" value={Mentor} onChange={this.onChange} >
                                            <option value=""></option>
                                            {this.state.leader_local.map((element) =>
                                                <option value={element.ID}>{element.Name + " " + element.Last_name} </option>
                                            )}
                                        </select>
                                    </Col>

                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>หัวหน้าโครงการ1: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="sel1" name="Leader1" value={Leader1} onChange={this.onChange} >
                                            <option value=""></option>
                                            {this.state.leader_local.map((element) =>
                                                <option value={element.ID}>{element.Name + " " + element.Last_name} </option>
                                            )}
                                        </select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>หัวหน้าโครงการ2: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="sel1" name="Leader2" value={Leader2} onChange={this.onChange} >
                                            <option value=""></option>
                                            {this.state.leader_local.map((element) =>
                                                <option value={element.ID}>{element.Name + " " + element.Last_name} </option>
                                            )}
                                        </select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>หัวหน้าโครงการ3: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="sel1" name="Leader3" value={Leader3} onChange={this.onChange} >
                                            <option value=""></option>
                                            {this.state.leader_local.map((element) =>
                                                <option value={element.ID}>{element.Name + " " + element.Last_name} </option>
                                            )}
                                        </select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>อัพโหลดไฟล์โครงการ: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <CustomUploadButton
                                            accept="/*"
                                            filename={"project" + Project_name + this.props.match.params.id + (1 + Math.floor(Math.random() * (99)))}
                                            storageRef={Firebase.storage().ref('Project_area')}
                                            onUploadStart={this.handleUploadStart}
                                            onUploadError={this.handleUploadError}
                                            onUploadSuccess={this.handleUploadSuccess}
                                            onProgress={this.handleProgress}
                                            style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4 }}
                                        >
                                            เลือกไฟล์
                                </CustomUploadButton>
                                    </Col>
                                    <Col>
                                        {this.state.isUploading && <Form.Label>{this.state.progress}</Form.Label>}
                                        {this.state.File_URL !== '' && <a href={this.state.File_URL}
                                        >ดาวโหลด</a>}

                                    </Col>
                                </Form.Group>
                                <hr></hr>
                                <center>
                                    <button type="submit" className="btn btn-success" style={{ fontSize: 20 }} >บันทึก</button>
                                </center>
                            </form>
                        </div>
                    }


                </div>
            </div>
        )

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

export default connect(mapStateToProps, mapDispatchToProps)(Project_manage);

