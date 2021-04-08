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
export class Course_manage extends Component {
    constructor(props) {
        super(props);
        this.tbCourse = Firebase.firestore().collection('COURSES');
        this.state = {
            Course_name: '', Area_local_ID: this.props.match.params.id, ...this.props.fetchReducer.user,
            Area_local_name: '', Create_date: '', Create_By_ID: '', Informer_name: '', Description: '',

            File_URL: '', isUploading: false, File_name: '', progress: 0,
            list_course: [], add: false, edit: ''
        }
    }
    componentDidMount() {
        const { Area_local_ID } = this.state;
        Firebase.firestore().collection('AREAS').doc(Area_local_ID).get().then((doc) => {
            this.tbCourse.where('Area_local_ID', '==', Area_local_ID).onSnapshot(this.get_list_course);
            this.setState({
                Province: data_provinces[doc.data().AProvince_ID][0],
                District: data_provinces[doc.data().AProvince_ID][1][doc.data().ADistrict_ID][0],
                ...doc.data(),
            })
        })

    }
    get_list_course = (querySnapshot) => {
        const list_course = [];
        querySnapshot.forEach((doc) => {
            list_course.push({ ...doc.data(), ID: doc.id })
        })
        this.setState({
            list_course
        })
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }
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
            .ref("Course_area")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ File_URL: url }));
    };
    delete(id) {
        this.tbCourse.doc(id).get().then((doc) => {
            if (this.state.uid === doc.data().Create_By_ID) {

                var desertRef = Firebase.storage().refFromURL(doc.data().File_URL);
                desertRef.delete().then(function () {
                    console.log("delete file sucess");
                }).catch(function (error) {
                    console.log("file No such document! " + doc.data());
                });
            } else {
                console.log("file   No such document! " + id);
            }
            this.tbCourse.doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                this.setState({
                    add: false, edit: '',
                });
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });




        });

    }
    onSubmit = (e) => {
        e.preventDefault();


        const { Course_name, Area_local_ID, Name, uid, File_name, File_URL, Dominance, Area_name, Area_type,
            Description, } = this.state;
        if (isEmptyValue(this.state.edit)) {
            this.tbCourse.add({
                Course_name, Description,
                Create_date: GetCurrentDate("/"), Area_local_ID, Informer_name: Name, Create_By_ID: uid, Area_local_name: Area_name,
                Area_local_dominance: Dominance, File_name, File_URL, Area_local_type: Area_type
            }).then((doc) => {
                this.setState({
                    Course_name: '', Description: '', File_name: '', File_URL: '',
                    add: false, edit: ''
                })
            }).catch((error) => {
                console.log(error)
            })
        } else {
            this.tbCourse.doc(this.state.edit).update({
                Course_name, Description,
                Create_date: GetCurrentDate("/"), Area_local_ID, Informer_name: Name, Create_By_ID: uid, Area_local_name: Area_name,
                Area_local_dominance: Dominance, File_name, File_URL, Area_local_type: Area_type
            }).then((doc) => {
            }).then((doc) => {
                this.setState({
                    Course_name: '', Description: '', File_name: '', File_URL: '',
                    add: false, edit: ''
                })
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    render() {
        const { Course_name, Dominance, Area_name, Area_type, list_course, Description } = this.state;

        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    <h1>{Dominance + Area_name} {Area_type}</h1>
                    <hr></hr>
                    <h1>หลักสูตร {list_course.length} หลักสูตร</h1>
                    {list_course.length === 0 && <h1>ยังไม่มีหลักสูตร</h1>}
                    {list_course.map((element, i) =>
                        <Row key={i}>
                            <h1>{element.Course_name}</h1>
                            <button type="button" className="btn btn-success"
                                onClick={() =>
                                    this.setState({
                                        edit: element.ID,
                                        add: true,
                                        Course_name: element.Course_name,
                                        Description: element.Description,
                                        File_URL: element.File_URL

                                    })
                                }>แก้ไข</button>
                            <button type="button" className="btn btn-danger" onClick={this.delete.bind(this, element.ID)}>ลบ</button>
                        </Row>
                    )}
                    <hr></hr>
                    <Row>
                        <button type="button" className="btn btn-success" onClick={() => this.setState({ add: true })}>เพิ่มหลักสูตร</button>
                        <button type="button" className="btn btn-danger" style={{ fontSize: 20 }}
                            onClick={() => this.props.history.goBack()}>กลับ</button>
                    </Row>

                    {this.state.add &&
                        <div>
                            <form onSubmit={this.onSubmit}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>ชื่อหลักสูตร: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Course_name" value={Course_name} onChange={this.onChange} required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>อธิบายหลักสูตร(แบบย่อ): <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <textarea className="form-control" name="Description" value={Description} onChange={this.onChange}
                                            placeholder="อธิบายโครงการ"
                                            cols="80" rows="5" required>{Description}</textarea>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column sm="5" style={{ fontSize: 24 }}>อัพโหลดไฟล์บทเรียน: <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <CustomUploadButton
                                            accept="/*"
                                            filename={"course" + Course_name + this.props.match.params.id + (1 + Math.floor(Math.random() * (99)))}
                                            storageRef={Firebase.storage().ref('Course_area')}
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

export default connect(mapStateToProps, mapDispatchToProps)(Course_manage);

