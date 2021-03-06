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
import { tableName } from '../../database/TableConstant';
import Loading from '../Loading';
import Resizer from 'react-image-file-resizer';
import no_image from '../../assets/no_image.jpg';
export class Main_seven_tools extends Component {
    constructor(props) {
        super(props);
        this.tbSocialMaps = Firebase.firestore().collection(tableName.Social_maps);
        this.tbAreas = Firebase.firestore().collection(tableName.Areas);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            position: { lat: 15.229399, lng: 104.857126 },
            zoomMap: 12,
            //data insert map
            Geo_map_name: '', Geo_map_type: '',
            Geo_map_description: '', Informer_ID: '', Create_date: '',
            Map_image_URL: '',
            map_image_uri: '',
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
            area: [],
            laoding: false,


        }
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.getGeolocation = this.getGeolocation.bind(this);
    }

    componentDidMount() {
        const { Area_ID } = this.state;
        this.setState({
            loading: true
        })

        this.tbSocialMaps
            .where('Area_ID', '==', Area_ID)
            .onSnapshot(this.ListMark);
    }


    ListMark = (querySnapshot) => {
        const geoMaps = [];
        const listshowMarker = [];
        let count = 0;
        this.tbAreas.doc(this.state.Area_ID).get().then((doc) => {
            this.setState({
                area: doc.data(),
            })
        })
        querySnapshot.forEach((doc) => {
            const { Geo_map_position, Map_image_URL, Geo_map_name, Geo_map_type, Geo_map_description, Informer_name, } = doc.data();
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
                            image={Map_image_URL}
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
                                <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="edit" src={Iedit} onClick={this.edit.bind(this, doc.data(), doc.id)}></img>
                                <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="delete" src={Idelete} onClick={this.delete.bind(this, doc.id)}></img>
                            </div>
                    });
                }




            }


            count++;
        });

        this.setState({
            geoMaps, listshowMarker,
            loading: false
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

    edit(data, id) {
        if (data.Geo_map_type === "flag_good" || data.Geo_map_type === "flag_danger") {
            this.setState({
                Geo_map_name: data.Geo_map_name,
                position: data.Geo_map_position,
                Geo_map_type: data.Geo_map_type,
                Geo_map_description: data.Geo_map_description,
                Map_image_URL: data.Map_image_URL,
                status_add: true, edit_ID: id,
                Geo_map_time: data.Geo_map_time,
                Geo_map_result_description: data.Geo_map_result_description
            })
        } else {
            this.setState({
                Geo_map_name: data.Geo_map_name,
                position: data.Geo_map_position,
                Geo_map_type: data.Geo_map_type,
                Geo_map_description: data.Geo_map_description,
                Map_image_URL: data.Map_image_URL,
                status_add: true, edit_ID: id,
            })
        }

    }
    delete(id) {
        const searchRef = Firebase.firestore().collection('SOCIAL_MAPS').doc(id);
        searchRef.get().then((doc) => {
            if (this.state.User_ID === doc.data().Informer_ID) {
                if (doc.exists && doc.data().Map_image_URL !== '') {
                    var desertRef = Firebase.storage().refFromURL(doc.data().Map_image_URL);
                    desertRef.delete().then(function () {
                        console.log("delete geomap and image sucess");
                    }).catch(function (error) {
                        console.log("image No such document! " + doc.data().areaImageName);
                    });
                } else {
                    console.log("geomap image  No such document! " + id);
                }
                Firebase.firestore().collection('SOCIAL_MAPS').doc(id).delete().then(() => {
                    console.log("Document successfully deleted!");
                    this.setState({
                        Geo_map_name: '', Geo_map_type: '',
                        Geo_map_description: '', Informer_ID: '', Create_date: '', Map_image_URL: '',
                        status_add: false, edit_ID: '',
                    });
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });

            } else {
                console.log("can not delete")
            }


        });

    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }



    addCancel = (e) => {
        e.preventDefault();
        this.setState({
            Geo_map_name: '', Geo_map_type: '',
            Geo_map_description: '', Informer_ID: '', Create_date: '', Map_image_URL: '',
            status_add: false
        })
    }
    select_tool(value) {
        this.setState({
            selected: value
        })
    }
    onMarkMap(lat, lng) {
        console.log(lat)
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

        this.setState({
            position: { lat, lng }
        });




    }
    fileChangedHandler = (event) => {
        var fileInput = false
        if (event.target.files[0]) {
            fileInput = true
        }
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0], 300, 300, 'JPEG', 100, 0,
                uri => {
                    // console.log(uri)
                    this.setState({
                        map_image_uri: uri,
                    })
                }, 'base64', 200, 200);
        }
    }
    uploadImage = async (id) => {
        return new Promise((resolve, reject) => {
            const imageRef = Firebase.storage().ref('GeoMaps').child('geo' + id + '.jpg')
            let mime = 'image/jpg';
            imageRef.putString(this.state.map_image_uri, 'data_url')
                .then(() => { return imageRef.getDownloadURL() })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    getGeolocation(lat, lng) {
        this.setState({
            position: {
                lat: lat,
                lng: lng
            }
        });
        // console.log(Lat + "" + Lng);
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
            const { Area_ID, Area_PID, Area_DID, Area_SDID, } = this.state;
            this.tbSocialMaps.where('Area_ID', '==', Area_ID).onSnapshot(this.ListMark);

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
            const { Area_ID, Area_PID, Area_DID, Area_SDID, } = this.state;
            this.tbSocialMaps.where('Area_ID', '==', Area_ID).onSnapshot(this.ListMark);
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { position, Map_image_URL, Geo_map_name, Geo_map_type, Geo_map_description,
            Geo_map_result_description, Geo_map_time, area,
            Area_ID, Area_PID, Area_DID, Area_SDID, } = this.state;

        if (this.state.Map_image_URL !== '') {
            if (this.state.edit_ID !== '') {
                this.tbSocialMaps.doc(this.state.edit_ID).update({
                    Geo_map_position: position, Informer_name: this.state.Name, Create_date: GetCurrentDate('/'),
                    Map_image_URL, Geo_map_name, Geo_map_type, Geo_map_description, Informer_ID: this.state.User_ID,
                    Geo_map_result_description, Geo_map_time,
                }).then((result) => {
                    this.setState({
                        Geo_map_name: '', Geo_map_type: '',
                        Geo_map_description: '', Informer_ID: '', Create_date: '', Map_image_URL: '',
                        status_add: false, edit_ID: '', Geo_map_result_description: '', Geo_map_time: '',
                    })
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                this.tbSocialMaps.add({
                    Geo_map_position: position, Informer_name: this.state.Name, Area_ID, Area_PID, Area_DID, Area_SDID, Create_date: GetCurrentDate('/'),
                    Map_image_URL, Geo_map_name, Geo_map_type, Geo_map_description, Informer_ID: this.state.User_ID,
                    Geo_map_result_description, Geo_map_time,
                }).then((result) => {
                    this.setState({
                        Geo_map_name: '', Geo_map_type: '',
                        Geo_map_description: '', Create_date: '', Map_image_URL: '',
                        status_add: false, edit_ID: '', Geo_map_result_description: '', Geo_map_time: '',
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

    render() {
        const { area } = this.state;
        const { Geo_map_name, Geo_map_type,
            Geo_map_description, Geo_map_result_description, Geo_map_time,
            Map_image_URL, map_image_uri } = this.state;
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

        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <div>
                    <Topnav></Topnav>
                    <div className='main_component'>
                        <Row>
                            <h2><strong>ข้อมูลแผนที่เดินดิน : {area.Dominance + area.Area_name} {area.Area_type !== '' && area.Area_type}     </strong> </h2>
                        </Row>
                        <hr></hr>
                        <TabST></TabST>
                        <hr></hr>
                        <Container>

                            <Row>
                                <Col sm={8} style={{ height: 500, alignItems: 'center' }}>
                                    <br></br><br></br><br></br>
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
                                <Col sm={4} style={{ padding: 10 }}>
                                    {this.state.status_add ?
                                        <form onSubmit={this.onSubmit}>
                                            <Form.Group as={Row}>
                                                <Form.Label column >
                                                    เลือกพิกัดพื้นที่<label style={{ color: "red" }}>*</label>
                                                </Form.Label>
                                                <Form.Label column >

                                                    Latitude : {this.state.position.lat} longitude : {this.state.position.lng}
                                                </Form.Label>
                                                <Col>

                                                    <Geolocation getLocate={this.getGeolocation}></Geolocation>

                                                </Col>

                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">ชื่อ: <label style={{ color: "red" }}>*</label></Form.Label>
                                                <Col>
                                                    <input type="text" className="form-control" name="Geo_map_name" value={Geo_map_name} onChange={this.onChange} required />

                                                </Col>

                                            </Form.Group>
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="3">ประเภท: <label style={{ color: "red" }}>*</label></Form.Label>
                                                <Col>
                                                    <select className="form-control" id="sel1" name="Geo_map_type" value={Geo_map_type} onChange={this.onChange} required>
                                                        <option value=""></option>
                                                        <option value="home">บ้าน</option>
                                                        <option value="resource">แหล่งทรัพยากร</option>
                                                        <option value="organization">องค์กร</option>
                                                        <option value="flag_good">จุดดี</option>
                                                        <option value="flag_danger">จุดเสี่ยง</option>
                                                        <option value="accident">จุดอุบัติเหตุ</option>
                                                    </select>
                                                </Col>

                                            </Form.Group>
                                            {Geo_map_type === "flag_good" || Geo_map_type === "flag_danger" ?
                                                <div>
                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm="3">เวลาที่เกิดเหตุ: <label style={{ color: "red" }}>*</label></Form.Label>
                                                        <Col>
                                                            <input type="time" className="form-control" name="Geo_map_time" value={Geo_map_time} onChange={this.onChange} required />

                                                        </Col>

                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm="3">ลักษณะกิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                                        <Col>
                                                            <textarea className="form-control" name="Geo_map_description" value={Geo_map_description} onChange={this.onChange}
                                                                placeholder="ลักษณะกิจกรรมที่เกิดขึ้นบนพื้นที่"
                                                                cols="80" rows="5" required>{Geo_map_description}</textarea>
                                                        </Col>

                                                    </Form.Group>
                                                    <Form.Group as={Row}>
                                                        <Form.Label column sm="3">ผลที่เกิดขึ้น: <label style={{ color: "red" }}>*</label></Form.Label>
                                                        <Col>
                                                            <textarea className="form-control" name="Geo_map_result_description" value={Geo_map_result_description} onChange={this.onChange}
                                                                placeholder="จากกิจกรรมบนพื้นที่ มีผลที่เกิดขึ้นยังไงบ้าง เช่น การรวมตัวของวัยรุ่นหลังวัดที่เสพสารเสพติด ทำให้เกิดเด็กติดยาและเกิดการลักขโมย"
                                                                cols="80" rows="5" required>{Geo_map_result_description}</textarea>
                                                        </Col>

                                                    </Form.Group>
                                                </div>
                                                : <Form.Group as={Row}>
                                                    <Form.Label column sm="3">คำอธิบาย: <label style={{ color: "red" }}>*</label></Form.Label>
                                                    <Col>
                                                        <textarea className="form-control" name="Geo_map_description" value={Geo_map_description} onChange={this.onChange}
                                                            placeholder="คำอธิบาย ของ บุคคล สถานที่ หรือกิจกรรมที่เกิดขึ้นบนพื้นที่"
                                                            cols="80" rows="5" required>{Geo_map_description}</textarea>
                                                    </Col>

                                                </Form.Group>}



                                            <center >
                                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                                                    <label >เพิ่มรูปพื้นที่: <label style={{ color: "red" }}>*</label></label>
                                                    {(isEmptyValue(map_image_uri) && isEmptyValue(Map_image_URL)) ?
                                                        <img className="imagearea" alt="map_image" src={no_image} />
                                                        : <img className="imagearea" alt="map_image" src={isEmptyValue(map_image_uri) ? Map_image_URL : map_image_uri} />}

                                                    <input type="file" placeholder="อัพโหลดรูปภาพ" style={{ width: 200, wordWrap: 'break-word' }}
                                                        onChange={this.fileChangedHandler} />
                                                </div>
                                                <br></br>
                                                <button type="submit" className="btn btn-success">บันทึก</button>
                                                <button type="button" className="btn btn-danger" onClick={this.addCancel.bind()}>ยกเลิก</button>

                                            </center >


                                            {showStatus}
                                        </form>
                                        :
                                        <div >
                                            <button className="btn btn-success" onClick={() => this.setState({ status_add: true })}>เพิ่มข้อมูล</button>
                                            {/* // "home"=บ้าน
                                        // "resource"=แหล่งทรัพยากร
                                        // "organization"=องค์กร
                                        // "flag_good"=จุดดี
                                        // "flag_danger"=จุดเสี่ยง
                                        // "accident"=จุดอุบัติเหตุ */}

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
                                    }

                                </Col>


                            </Row>


                        </Container>


                    </div>

                </div >
            )
        }
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
        ((GoogleApiWrapper({ apiKey: ('AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8'), language: 'th' }))(Main_seven_tools));