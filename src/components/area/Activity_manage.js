import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import { MDBDataTable } from 'mdbreact';
import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import DatePicker, { registerLocale } from "react-datepicker";
import '../../App.css';
import Iedit from '../../assets/pencil.png';
import Idelete from '../../assets/trash_can.png';
import Izoom from '../../assets/zoom.png';
import data_provinces from '../../data/provinces.json';
import Firebase from "../../Firebase";
import { GetCurrentDate, isEmptyValue } from '../Methods';
import Geolocation from '../seven_tools/Geolocation';
import Topnav from '../top/Topnav';

import { connect } from 'react-redux';
import { fetch_user } from '../../actions';

export class Activity_manage extends Component {
    constructor(props) {
        super(props);
        this.tbActivity = Firebase.firestore().collection('ACTIVITYS');

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            zoomMap: 12,

            //input data profile
            ...this.props.fetchReducer.user,
            //ad
            status_add: false,
            edit_ID: '',
            //list show
            geoMaps: [],
            listshowMarker: [],
            // area
            Area_local_ID: this.props.match.params.id,
            AProvince_ID: '', ADistrict_ID: '', Dominance: '', Area_type: '', Create_date: '',
            Informer_name: '', Informer_ID: '', LGO_ID: '', Area_name: '', Activity: '', Project_name: '',
            Province: '', District: '', Mentor: '', Leader1: '', Leader2: '', Leader3: '', Description: '',
            leader_local: [], mentors: [], File_URL: '', isUploading: false, File_name: '', progress: 0,
            // Activity
            Activity_name: '',
            Activity_description: '',
            Activity_date: '',
            Activity_time: '',
            Activity_Informer_ID: '',
            Activity_Informer_Name: '',
            Activity_image_URL: '',
            Activity_image_name: '',
            Activity_position: { lat: 15.229399, lng: 104.857126 },


        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.getGeolocation = this.getGeolocation.bind(this);
    }

    componentDidMount() {
        Firebase.firestore().collection('AREAS').doc(this.props.match.params.id).get().then((doc) => {
            this.setState({
                Province: data_provinces[doc.data().AProvince_ID][0],
                District: data_provinces[doc.data().AProvince_ID][1][doc.data().ADistrict_ID][0],
                ...doc.data(),
            })
        })
        const { Area_local_ID } = this.state;
        this.tbActivity.where('Area_local_ID', '==', Area_local_ID).onSnapshot(this.ListMark);
    }


    ListMark = (querySnapshot) => {

        const geoMaps = [];
        const listshowMarker = [];
        let count = 0;

        querySnapshot.forEach((doc) => {
            const { Area_local_ID, Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name, Activity_position,
                Activity_iamge_URL, Activity_iamge_name,
                Activity_time, Activity_Informer_ID, Activity_Informer_Name, User_ID, Name } = doc.data();
            if (!isEmptyValue(Activity_position)) {
                listshowMarker.push(

                    <Marker key={count}
                        onClick={this.onMarkerClick}
                        name={Activity_name + ""}
                        position={Activity_position}
                        description={Activity_description}
                        image={Activity_image_URL}
                    // animation={this.props.google.maps.Animation.DROP}
                    />

                );
                let d = new Date(Activity_date.seconds * 1000)
                let dt = d.getDate() + "/" + (parseInt(d.getMonth(), 10) + 1) + "/" + d.getFullYear();
                geoMaps.push({
                    Activity_name,
                    Activity_description,
                    Date_time: dt + "|" + Activity_time,
                    edit:
                        <div>
                            <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="zoom" src={Izoom} onClick={this.onFocusMarker.bind(this, Activity_position.lat, Activity_position.lng)}></img>
                            <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="edit" src={Iedit} onClick={this.edit.bind(this, doc.data(), doc.id)}></img>
                            <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="delete" src={Idelete} onClick={this.delete.bind(this, doc.data(), doc.id)}></img>
                        </div>
                });
            }







            count++;
        });

        this.setState({
            geoMaps, listshowMarker
        });
    }
    onFocusMarker(lat, lng) {
        setTimeout(() => {
            this.setState({
                Activity_position: { lat, lng },
                zoomMap: 18
            });

        }, 100);
    }

    edit(data, id) {

        this.setState({
            Activity_name: data.Activity_name,
            Activity_position: data.Activity_position,
            Activity_description: data.Activity_description,
            Activity_image_URL: data.Activity_image_URL,
            status_add: true, edit_ID: id,
            Activity_time: data.Activity_time,
            Activity_date: new Date(data.Activity_date.seconds * 1000),
        })


    }
    delete(data, id) {

        if (this.state.User_ID === data.Informer_ID) {
            if (data.Activity_image_URL !== '') {
                var desertRef = Firebase.storage().refFromURL(data.Activity_image_URL);
                desertRef.delete().then(function () {
                    console.log("delete geomap and image sucess");
                }).catch(function (error) {
                    console.log("image No such document! " + data);
                });
            } else {
                console.log("geomap image  No such document! ");
            }
            this.tbActivity.doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                this.setState({
                    Activity_name: '', Activity_description: '', Activity_date: '', Activity_image_URL: '', Activity_image_name: '',
                    Activity_time: '',
                    status_add: false, edit_ID: '',
                });
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

        } else {
            console.log("can not delete")
        }
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }



    addCancel = (e) => {
        e.preventDefault();
        this.setState({
            Activity_name: '', Activity_description: '', Activity_date: '', Activity_image_URL: '', Activity_image_name: '',
            Activity_time: '',
            status_add: false, edit_ID: '',
        })
    }
    select_tool(value) {
        this.setState({
            selected: value
        })
    }
    onMarkMap(lat, lng) {
        this.setState({
            Activity_position: {
                lat: lat,
                lng: lng
            }
        });
    }
    //  map
    onMarkerClick(props, marker) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });
    }

    onMapClicked(t, map, coord) {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();


        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
        setTimeout(() => {
            this.setState({
                Activity_position: { lat, lng }
            });
        }, 100);



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
        this.setState({ Activity_image_name: filename, progress: 100, isUploading: false });
        Firebase
            .storage()
            .ref("Activity")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ Activity_image_URL: url }));
    };
    getGeolocation(lat, lng) {
        this.setState({
            Activity_position: {
                lat: lat,
                lng: lng
            }
        });
        // console.log(Lat + "" + Lng);
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { Area_local_ID, Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name, Activity_position,
            Activity_time, Activity_Informer_ID, Activity_Informer_Name, User_ID, Name } = this.state;

        if (Activity_image_URL !== '') {
            if (this.state.edit_ID !== '') {
                this.tbActivity.doc(this.state.edit_ID).update({
                    Area_local_ID, Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name, Activity_position,
                    Activity_time, Informer_ID: User_ID, Informer_Name: Name, Create_date: GetCurrentDate('/'),
                }).then((result) => {
                    this.setState({
                        Activity_name: '', Activity_description: '', Activity_date: '', Activity_image_URL: '', Activity_image_name: '',
                        Activity_time: '',
                        status_add: false, edit_ID: '',
                    })
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                this.tbActivity.add({
                    Area_local_ID, Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name, Activity_position,
                    Activity_time, Informer_ID: User_ID, Informer_Name: Name, Create_date: GetCurrentDate('/'),
                }).then((result) => {
                    this.setState({
                        Activity_name: '', Activity_description: '', Activity_date: '', Activity_image_URL: '', Activity_image_name: '',
                        Activity_time: '',
                        status_add: false, edit_ID: '',
                    })
                }).catch((error) => {
                    console.log(error);
                });
            }
        } else {
            confirmAlert({
                title: 'เพิ่มข้อมูลไม่สำเร็จ',
                message: 'กรุณาอัพโหลดรูปภาพ',
                buttons: [
                    {
                        label: 'ตกลง',
                    },

                ]
            });
        }

    }
    selectDate = date => {
        this.setState({
            Activity_date: date,
        });
    };

    render() {
        const { Dominance, District } = this.state;
        const { Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name,
            Activity_time, Activity_Informer_ID, Activity_Informer_Name, } = this.state
        const data = {
            columns: [
                {
                    label: 'กิจกรรม',
                    field: 'Activity_name',
                    sort: 'asc',
                },
                {
                    label: 'รายละเอียด',
                    field: 'Activity_description',
                    sort: 'asc',
                },
                {
                    label: 'วันเวลา',
                    field: 'Date_time',
                    sort: 'asc',
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                }
            ],
            rows: this.state.geoMaps
        };
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    <Row>
                        <h2><strong>แผนที่กิจกรรม {Dominance}{District}</strong> </h2>
                    </Row>
                    <hr></hr>
                    <Container>

                        <Row>
                            <Col sm={8} style={{ height: 500, alignItems: 'center' }}>
                                <br></br><br></br><br></br>
                                <Map google={this.props.google}
                                    zoom={this.state.zoomMap}
                                    center={{
                                        lat: this.state.Activity_position.lat,
                                        lng: this.state.Activity_position.lng
                                    }}

                                    style={{ width: '90%', height: '100%' }}
                                    onClick={this.onMapClicked}
                                >
                                    <Marker
                                        name="add Marker"
                                        onClick={this.onMarkerClick}
                                        position={{
                                            lat: this.state.Activity_position.lat,
                                            lng: this.state.Activity_position.lng
                                        }}
                                    />
                                    {this.state.listshowMarker}

                                    <InfoWindow
                                        marker={this.state.activeMarker}
                                        visible={this.state.showingInfoWindow}>
                                        <div style={{ overflow: 'hidden', justifyContent: 'center' }}>
                                            <img alt="infoMap" style={{ width: 150, height: 150 }} src={this.state.selectedPlace.image} />
                                            <h5>{this.state.selectedPlace.description}</h5>
                                        </div>
                                    </InfoWindow>
                                </Map>
                            </Col>
                            <Col sm={4} style={{ padding: 10 }}>
                                {this.state.status_add ?
                                    <form onSubmit={this.onSubmit}>
                                        <Form.Group as={Row}>
                                            <Form.Label column >
                                                เลือกพิกัดพื้นที่<label style={{ color: "red" }}>*</label>
                                            </Form.Label>
                                            <Form.Label column >
                                                Latitude : {this.state.Activity_position.Lat} longitude : {this.state.Activity_position.Lng}
                                            </Form.Label>
                                            <Col>

                                                <Geolocation getLocate={this.getGeolocation}></Geolocation>

                                            </Col>

                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">กิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="text" className="form-control" name="Activity_name" value={Activity_name} onChange={this.onChange} required />
                                            </Col>

                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">รายละเอียด: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <textarea className="form-control" name="Activity_description" value={Activity_description} onChange={this.onChange}
                                                    placeholder="รายละเอียดการจัดกิจกรรม"
                                                    cols="80" rows="5" required>{Activity_description}</textarea>

                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">วันที่จัด: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <DatePicker
                                                    className="form-control"
                                                    locale="th"
                                                    dateFormat="dd/MM/yyyy"
                                                    selected={Activity_date}
                                                    onChange={this.selectDate}
                                                    placeholderText="วัน/เดือน/ปี(ค.ศ.)"

                                                />

                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label column sm="3">เวลาที่จัดกิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                            <Col>
                                                <input type="time" className="form-control" name="Activity_time" value={Activity_time} onChange={this.onChange} required />

                                            </Col>

                                        </Form.Group>


                                        <center >
                                            <label >เพิ่มรูปพื้นที่ : <label style={{ color: "red" }}>*</label></label>


                                            {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                            {this.state.Activity_image_URL && <img className="imagearea" alt="mapURL" src={this.state.Activity_image_URL} />}
                                            <br></br>
                                            <CustomUploadButton
                                                accept="image/*"
                                                filename={"Activity" + Activity_name + this.props.match.params.id + (1 + Math.floor(Math.random() * (99)))}
                                                storageRef={Firebase.storage().ref('Activity')}
                                                onUploadStart={this.handleUploadStart}
                                                onUploadError={this.handleUploadError}
                                                onUploadSuccess={this.handleUploadSuccess}
                                                onProgress={this.handleProgress}
                                            // style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, width: 85, height: 35.3666 }}
                                            >

                                                <div type="button" className="btn btn-info"> เลือกไฟล์</div>
                                            </CustomUploadButton>
                                            <br></br>
                                            <button type="submit" className="btn btn-success">บันทึก</button>
                                            <button type="button" className="btn btn-danger" onClick={this.addCancel.bind()}>ยกเลิก</button>

                                        </center >



                                    </form>
                                    :
                                    <div >
                                        <button className="btn btn-success" onClick={() => this.setState({ status_add: true })}>เพิ่มข้อมูล</button>

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
                                }

                            </Col>


                        </Row>


                    </Container>


                </div>

            </div >
        )
    }
}
// export default Main_seven_tools;
// export default (GoogleApiWrapper({ apiKey: ('AIzaSyAz1FvLaAJGDrvPvRPbS_EITU30dNyd-eA'), language: 'th' }))(Main_seven_tools);

//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};

export default
    connect(mapStateToProps, mapDispatchToProps)
        ((GoogleApiWrapper({ apiKey: ('AIzaSyAz1FvLaAJGDrvPvRPbS_EITU30dNyd-eA'), language: 'th' }))(Activity_manage));