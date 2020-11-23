import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import { MDBDataTable } from 'mdbreact';
import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { connect } from 'react-redux';
import { fetch_user } from '../../actions';

export class Activity extends Component {
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
            //list show
            geoMaps: [],
            listshowMarker: [],
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
            list_act: [],


        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
    }

    componentDidMount() {
        if (isEmptyValue(this.state.User_ID)) {
            // Firebase.firestore().collection('ACT_PEOPLES').onSnapshot(this.List_activity_seft);
            this.tbActivity.onSnapshot(this.ListMark);
        } else {
            Firebase.firestore().collection('ACT_PEOPLES').where('User_ID', '==', this.state.User_ID).onSnapshot(this.List_activity_seft);
            this.tbActivity.onSnapshot(this.ListMark);
        }


    }
    List_activity_seft = (querySnapshot) => {
        const list_act = []
        querySnapshot.forEach((doc) => {
            list_act.push({ ID: doc.id, ...doc.data() })
        })
        console.log(list_act)
        this.setState({
            list_act
        })

    }
    check_act(id) {
        var st = '';
        this.state.list_act.forEach((doc) => {

        })
        for (let index = 0; index < this.state.list_act.length; index++) {
            if (this.state.list_act[index].Activity_ID === id) {
                st = this.state.list_act[index].ID;
                index = this.state.list_act.length;
            }
        }
        return st;
    }


    ListMark = (querySnapshot) => {

        const geoMaps = [];
        const listshowMarker = [];
        let count = 0;


        querySnapshot.forEach((doc) => {
            const { Activity_name, Activity_description, Activity_date, Activity_image_URL, Activity_image_name, Activity_position,
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
                // console.log(this.check_act(doc.id))
                if (!isEmptyValue(this.check_act(doc.id))) {
                    geoMaps.push({
                        Activity_name,
                        Activity_description,
                        Date_time: dt + "|" + Activity_time,
                        edit:
                            <Col>
                                <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="zoom" src={Izoom}
                                    onClick={this.onFocusMarker.bind(this, Activity_position.lat, Activity_position.lng, doc.data(), doc.id, this.check_act(doc.id))}></img>
                                <p>เข้าร่วม</p>
                            </Col>
                    });
                } else {
                    geoMaps.push({
                        Activity_name,
                        Activity_description,
                        Date_time: dt + "|" + Activity_time,
                        edit:
                            <div>
                                <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="zoom" src={Izoom}
                                    onClick={this.onFocusMarker.bind(this, Activity_position.lat, Activity_position.lng, doc.data(), doc.id, '')}></img>
                            </div>
                    });
                }

            }
            count++;
        });

        this.setState({
            geoMaps, listshowMarker
        });
    }
    onFocusMarker(lat, lng, data, id, regis_id) {
        setTimeout(() => {
            this.setState({
                Activity_position: { lat, lng },
                zoomMap: 18
            });

        }, 100);
        let d = new Date(data.Activity_date.seconds * 1000)
        let dt = d.getDate() + "/" + (parseInt(d.getMonth(), 10) + 1) + "/" + d.getFullYear();
        if (isEmptyValue(this.state.Name)) {
            confirmAlert({
                title: data.Activity_name,
                message: "วันเวลา" + dt + "|" + data.Activity_time + "\n รายละเอียด :" + data.Activity_description,
                buttons: [
                    {
                        label: "สมัครสมาชิกก่อนเข้าร่วม",
                        onClick: (() => {
                            this.props.history.push('/register_email')
                        })
                    },
                    {
                        label: "ปิด"
                    },
                ]
            });

        } else {
            if (!isEmptyValue(regis_id)) {
                confirmAlert({
                    title: data.Activity_name + ": เข้าร่วมแล้ว",
                    message: "วันเวลา" + dt + "|" + data.Activity_time + "\n รายละเอียด :" + data.Activity_description,
                    buttons: [
                        {
                            label: "ยกเลิกการเข้าร่วม",
                            onClick: (() => {
                                console.log(regis_id)
                                Firebase.firestore().collection('ACT_PEOPLES').doc(regis_id).delete().then((doc) => {
                                    Firebase.firestore().collection('ACT_PEOPLES').where('User_ID', '==', this.state.User_ID).onSnapshot(this.List_activity_seft);
                                    this.tbActivity.onSnapshot(this.ListMark);
                                    console.log('delete people success')
                                })
                                    .catch((error) => { console.log(error) })

                            })
                        },
                        {
                            label: "ปิด"
                        },
                    ]
                });
            } else {
                confirmAlert({
                    title: data.Activity_name,
                    message: "วันเวลา" + dt + "|" + data.Activity_time + "\n รายละเอียด :" + data.Activity_description,
                    buttons: [
                        {
                            label: "เข้าร่วม",
                            onClick: (() => {
                                Firebase.firestore().collection('ACT_PEOPLES').add({
                                    Activity_ID: id,
                                    Activity_name: data.Activity_name,
                                    User_ID: this.state.User_ID,
                                    Name: this.state.Name,
                                }).then((doc) => {
                                    Firebase.firestore().collection('ACT_PEOPLES').where('User_ID', '==', this.state.User_ID).onSnapshot(this.List_activity_seft);
                                    this.tbActivity.onSnapshot(this.ListMark);
                                    console.log('add people success')
                                })
                                    .catch((error) => { console.log(error) })

                            })
                        },
                        {
                            label: "ปิด"
                        },
                    ]
                });
            }

        }
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

    onSubmit = (e) => {
        e.preventDefault();

    }


    render() {

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
                        <h2><strong>แผนที่กิจกรรม</strong> </h2>
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
                                <div >
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
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div >
        )
    }
}
// export default Main_seven_tools;
// export default (GoogleApiWrapper({ apiKey: ('AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8'), language: 'th' }))(Main_seven_tools);

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
        ((GoogleApiWrapper({ apiKey: ('AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8'), language: 'th' }))(Activity));