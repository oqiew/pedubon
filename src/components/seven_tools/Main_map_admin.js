import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import { MDBDataTable } from 'mdbreact';
import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import '../../App.css';
import accident from '../../assets/accident.png';
import flag_danger from '../../assets/flag_danger.png';
import flag_good from '../../assets/flag_good.png';
import home from '../../assets/home.png';
import organization from '../../assets/organization.png';
import Iedit from '../../assets/pencil.png';
import resource from '../../assets/resource.png';
import Idelete from '../../assets/trash_can.png';
import Izoom from '../../assets/zoom.png';
import data_provinces from '../../data/provinces.json';
import Firebase from "../../Firebase";
import { GetCurrentDate, isEmptyValue } from '../Methods';
import Geolocation from '../seven_tools/Geolocation';
import Topnav from '../top/Topnav';
import TabST from './Tab_seven_tools';

import { connect } from 'react-redux';
import { fetch_user } from '../../actions';

export class Main_map_admin extends Component {
    constructor(props) {
        super(props);
        this.tbSocialMap = Firebase.firestore().collection('SOCIAL_MAPS');
        this.unsubscribe = null;
        console.log(this.props)
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            position: { lat: 15.229399, lng: 104.857126 },
            zoomMap: 9,
            //data insert map
            Geo_map_name: '', Geo_map_type: '',
            Geo_map_description: '', Informer_ID: '', Create_date: '', Map_iamge_URL: '',
            //จุดดี เสี่ยง
            Geo_map_result_description: '',
            Geo_map_time: '',
            //input data profile
            ...this.props.fetchReducer.user,
            //ad
            status_add: false,
            edit_ID: '',
            //list show
            geoMaps: [],
            listshowMarker: [],

            sall: true,
            shome: false,
            sresource: false,
            sorganization: false,
            sflag_good: false,
            sflag_danger: false,
            saccident: false,

        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = this.tbSocialMap.onSnapshot(this.ListMark);
    }
    componentWillUnmount() {
        this.unsubscribe = null;
    }

    ListMark = (querySnapshot) => {
        const geoMaps = [];
        const listshowMarker = [];
        let count = 0;

        querySnapshot.forEach((doc) => {
            const { Geo_map_position, Map_iamge_URL, Geo_map_name, Geo_map_type, Geo_map_description, Informer_name, } = doc.data();
            const { sall, shome, sresource, sorganization, sflag_good, sflag_danger, saccident, } = this.state;
            var icon_m = '';
            var name_type = '';
            // "home"=บ้าน
            // "resource"=แหล่งทรัพยากร
            // "organization"=องค์กร
            // "flag_good"=จุดดี
            // "flag_danger"=จุดเสี่ยง
            // "accident"=จุดอุบัติเหตุ
            let add = false;
            if (Geo_map_type === 'home') {
                if (shome) {
                    add = true;
                }
            } else if (Geo_map_type === 'resource') {
                if (sresource) {
                    add = true;
                }
            } else if (Geo_map_type === 'organization') {
                if (sorganization) {
                    add = true;
                }
            } else if (Geo_map_type === 'flag_good') {
                if (sflag_good) {
                    add = true;
                }
            } else if (Geo_map_type === 'flag_danger') {
                if (sflag_danger) {
                    add = true;
                }
            } else if (Geo_map_type === 'accident') {
                if (saccident) {
                    add = true;
                }
            }

            if (sall) {
                add = true;
            }


            if (add) {

                if (Geo_map_type === 'home') {
                    icon_m = home; name_type = 'บ้าน';
                } else if (Geo_map_type === 'resource') {
                    icon_m = resource; name_type = 'แหล่งทรัพยากร';
                } else if (Geo_map_type === 'organization') {
                    icon_m = organization; name_type = 'องค์กร';
                } else if (Geo_map_type === 'flag_good') {
                    icon_m = flag_good; name_type = 'จุดดี';
                } else if (Geo_map_type === 'flag_danger') {
                    icon_m = flag_danger; name_type = 'จุดเสี่ยง';
                } else if (Geo_map_type === 'accident') {
                    icon_m = accident; name_type = 'จุดอุบัติเหตุ';
                }
                if (!isEmptyValue(Geo_map_position)) {
                    listshowMarker.push(

                        <Marker key={count}
                            onClick={this.onMarkerClick}
                            name={Geo_map_name + ""}
                            position={Geo_map_position}
                            description={Geo_map_description}
                            image={Map_iamge_URL}
                            icon={icon_m}
                        // animation={this.props.google.maps.Animation.DROP}
                        // label={count}
                        />

                    );
                    geoMaps.push({
                        Geo_map_name,
                        name_type,
                        Informer_name,
                        edit:
                            <div>
                                <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="zoom" src={Izoom} onClick={this.onFocusMarker.bind(this, Geo_map_position.lat, Geo_map_position.lng)}></img>
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
    onFocusMarker(lat, lng) {
        setTimeout(() => {
            this.setState({
                position: { lat, lng },
                zoomMap: 18
            });

        }, 100);
    }
    onMarkMap(lat, lng) {
        this.setState({
            position: {
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
                position: { lat, lng }
            });
        }, 100);



    }

    SelectGeoType = (type) => {
        const { shome, sresource, sorganization, sflag_good, sflag_danger, saccident, } = this.state;
        if (type === 'all') {
            this.setState({
                sall: true,
                shome: false,
                sresource: false,
                sorganization: false,
                sflag_good: false,
                sflag_danger: false,
                saccident: false,
            })
            this.tbSocialMap.onSnapshot(this.ListMark);

        } else {


            this.setState({
                sall: false,
            })


            if (type === 'home') {
                if (shome) {
                    this.setState({
                        shome: false,
                    })
                } else {
                    this.setState({
                        shome: true,
                    })
                }
            }

            if (type === 'resource') {
                if (sresource) {
                    this.setState({
                        sresource: false,
                    })
                } else {
                    this.setState({
                        sresource: true,
                    })
                }
            }
            if (type === 'organization') {
                if (sorganization) {
                    this.setState({
                        sorganization: false,
                    })
                } else {
                    this.setState({
                        sorganization: true,
                    })
                }
            }
            if (type === 'flag_good') {
                if (sflag_good) {
                    this.setState({
                        sflag_good: false,
                    })
                } else {
                    this.setState({
                        sflag_good: true,
                    })
                }
            }
            if (type === 'flag_danger') {
                if (sflag_danger) {
                    this.setState({
                        sflag_danger: false,
                    })
                } else {
                    this.setState({
                        sflag_danger: true,
                    })
                }
            }
            if (type === 'accident') {
                if (saccident) {
                    this.setState({
                        saccident: false,
                    })
                } else {
                    this.setState({
                        saccident: true,
                    })
                }
            }
            this.tbSocialMap.onSnapshot(this.ListMark);
        }
    }

    render() {
        const { Ban_name, Area_ID } = this.state
        const { Geo_map_name, Geo_map_type,
            Geo_map_description, Geo_map_result_description, Geo_map_time, } = this.state;
        const data = {
            columns: [
                {
                    label: 'ชื่อพื้นที่',
                    field: 'Geo_map_name',
                    sort: 'asc',
                },
                {
                    label: 'ลักษณะพื้นที่',
                    field: 'name_type',
                    sort: 'asc',
                },
                {
                    label: 'ผู้เพิ่มข้อมูล',
                    field: 'Informer_name',
                    sort: 'asc',
                },
                // {
                //     label: 'ภาพ',
                //     field: 'image',
                //     sort: 'asc',
                // },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                }
            ],
            rows: this.state.geoMaps
        };

        let showStatus;
        if (this.state.statusSave === '2') {
            showStatus = <h6 className="text-success">บันทึกสำเร็จ</h6>;
        } else if (this.state.statusSave === '3') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ</h6>;
        } else if (this.state.statusSave === '4') {
            showStatus = <h6 className="text-danger">บันทึกไม่สำเร็จ โปรดอัพรูปภาพ</h6>;
        } else {
            showStatus = "";
        }




        return (
            <div>
                <div className='main_component'>
                    <Container>

                        <Row>
                            <Col sm={8} style={{ height: 500, alignItems: 'center' }}>
                                <Map google={this.props.google}
                                    zoom={this.state.zoomMap}
                                    center={{
                                        lat: this.state.position.lat,
                                        lng: this.state.position.lng
                                    }}

                                    style={{ width: '90%', height: '100%' }}
                                    onClick={this.onMapClicked}
                                >
                                    <Marker
                                        name="add Marker"
                                        onClick={this.onMarkerClick}
                                        position={{
                                            lat: this.state.position.lat,
                                            lng: this.state.position.lng
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
                            <Col style={{ padding: 10 }}>
                                <div >
                                    <Row style={{ margin: 10, alignItems: 'center' }}>

                                        <div style={!this.state.sall ? { justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#c0c0c0' } :
                                            { justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }
                                        } onClick={this.SelectGeoType.bind(this, "all")}><h4 style={{ padding: 2, alignItems: 'center   ' }}><strong>ทั้งหมด</strong></h4></div>
                                        <img alt="home" title="บ้าน" style={
                                            !this.state.shome ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={home} onClick={this.SelectGeoType.bind(this, "home")}></img>
                                        <img alt="resource" title="ทรัพยากร" style={
                                            !this.state.sresource ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={resource} onClick={this.SelectGeoType.bind(this, "resource")}></img>
                                        <img alt="organization" title="องค์กร" style={
                                            !this.state.sorganization ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={organization} onClick={this.SelectGeoType.bind(this, "organization")}></img>
                                        <img alt="flag_good" title="จุดดี" style={
                                            !this.state.sflag_good ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={flag_good} onClick={this.SelectGeoType.bind(this, "flag_good")}></img>
                                        <img alt="flag_danger" title="จุดเสี่ยง" style={
                                            !this.state.sflag_danger ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={flag_danger} onClick={this.SelectGeoType.bind(this, "flag_danger")}></img>
                                        <img alt="accident" title="อุบัติเหตุ" style={
                                            !this.state.saccident ? { cursor: 'pointer', filter: 'grayscale(100%)' } : { cursor: 'pointer' }
                                        } src={accident} onClick={this.SelectGeoType.bind(this, "")}></img>
                                    </Row>
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
        ((GoogleApiWrapper({ apiKey: ('AIzaSyAz1FvLaAJGDrvPvRPbS_EITU30dNyd-eA'), language: 'th' }))(Main_map_admin));