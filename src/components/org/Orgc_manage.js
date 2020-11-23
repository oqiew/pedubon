import React, { Component } from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import { connect } from 'react-redux';
import { fetch_user } from '../../actions';
import Topnav from '../top/Topnav';
import { Col, Container, Form, Row } from 'react-bootstrap';
import data_provinces from "../../data/provinces.json";
import Geolocation from '../seven_tools/Geolocation';
import Firebase from '../../Firebase';
export class Orgc_manage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            O_name: '',
            O_Address: '',
            O_position: { lat: 15.229399, lng: 104.857126 },
            O_description: '',
            O_number_phone: '',
            O_web_url: '',
            O_data: '',

            Provinces: [],
            Districts: [],
            Sub_districts: [],

            // map
            zoomMap: 14,
            // table data
            O_Province_ID: '', O_District_ID: '', O_Sub_district_ID: '',
            ...this.props.fetchReducer.user,
        }
        this.getGeolocation = this.getGeolocation.bind(this);
    }
    getGeolocation = (lat, lng) => {

        this.setState({
            O_position: { lat, lng },
            zoomMap: 16
        });


        // console.log(Lat + "" + Lng);
    }
    componentDidMount() {
        this.listProvinces();
    }
    onMapClicked = (t, map, coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();

        this.setState({
            O_position: { lat, lng }
        });

    }
    listProvinces = () => {
        const Provinces = [];
        data_provinces.forEach((doc, i) => {
            // console.log(doc)
            Provinces.push({
                Key: i,
                value: doc[0]
            })
        })
        this.setState({
            Provinces,

        })
    }
    listDistrict = (pid) => {
        const Districts = [];

        data_provinces[pid][1].forEach((doc, i) => {
            //  console.log(doc)
            Districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Districts,

            })
        } else {
            this.setState({
                Districts,
                O_District_ID: '',
                O_Sub_district_ID: '',
            })
        }

    }
    listSub_district = (pid, did) => {
        const Sub_districts = [];

        data_provinces[pid][1][did][2][0].forEach((doc, i) => {

            Sub_districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Sub_districts,

            })
        } else {
            this.setState({
                Sub_districts,
                O_Sub_district_ID: '',
            })
        }
    }

    onSelectProvince = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.Province_ID === '') {
            this.setState({
                Districts: [],
                O_District_ID: '',
                Sub_districts: [],
                O_Sub_district_ID: '',
            })
        } else {
            this.listDistrict(this.state.O_Province_ID);
        }
    }
    onSelectDistrict = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.District_ID === '') {
            this.setState({
                Sub_districts: [],
                O_Sub_district_ID: '',
            })
        } else {
            this.listSub_district(this.state.O_Province_ID, this.state.O_District_ID);
        }
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { O_Province_ID, O_District_ID, O_Sub_district_ID } = this.state;
        const { O_name, O_Address, O_position, O_description, O_data, O_number_phone, O_web_url } = this.state;
        Firebase.firestore().collection('ORGS').add({
            O_Province_ID, O_District_ID, O_Sub_district_ID,
            O_name, O_Address, O_position, O_description, O_data, O_number_phone, O_web_url
        }).then((doc) => {
            console.log('success')
        }).catch((error) => {
            console.log('error', error)
        })

    }
    render() {
        const { Provinces, Districts, Sub_districts } = this.state;
        const { O_Province_ID, O_District_ID, O_Sub_district_ID } = this.state;
        const { O_name, O_Address, O_position, O_description, O_data, O_number_phone, O_web_url } = this.state;

        return (

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    <center><h1>เพิ่มข้อมูลองค์กร</h1></center>
                    <form onSubmit={this.onSubmit}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">ชื่อองค์กร: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <input type="text" className="form-control" name="O_name" value={O_name} onChange={this.onChange} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">ข้อมูลที่หน่วยงานดำเนินการ: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <input type="text" className="form-control" placeholder="ข้อมูลจำนวนเด็ก ข้อมูลยาเสพติด ฯลฯ" name="O_data" value={O_data} onChange={this.onChange} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4" >อธิบายหน้าที่ขององค์กร: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <textarea className="form-control" name="O_description" value={O_description} onChange={this.onChange}
                                    placeholder="ลักษณะหน้าที่ขององค์กร"
                                    cols="80" rows="5" required>{O_description}</textarea>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">เลือกพิกัด: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <Geolocation getLocate={this.getGeolocation}></Geolocation>

                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4" ></Form.Label>
                            <Col style={{ height: 500, alignItems: 'center' }}>
                                <Map google={this.props.google}
                                    zoom={this.state.zoomMap}
                                    center={{
                                        lat: this.state.O_position.lat,
                                        lng: this.state.O_position.lng
                                    }}

                                    style={{ width: '90%', height: '90%' }}
                                    onClick={this.onMapClicked.bind(this)}
                                >
                                    <Marker
                                        name="add Marker"
                                        onClick={this.onMarkerClick}
                                        position={{
                                            lat: this.state.O_position.lat,
                                            lng: this.state.O_position.lng
                                        }}
                                    />
                                </Map>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Form.Label column sm="4">ที่อยู่เลขที่: </Form.Label>
                            <Col>
                                <input type="text" className="form-control" name="O_Address" value={O_Address} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">จังหวัด: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <select className="form-control" id="Province_ID" name="O_Province_ID" value={O_Province_ID} onChange={this.onSelectProvince} required>
                                    <option key='0' value=""></option>
                                    {Provinces.map((data, i) =>
                                        <option key={i + 1} value={data.Key}>{data.value}</option>
                                    )}

                                </select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">อำเภอ: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <select className="form-control" id="District_ID" name="O_District_ID" value={O_District_ID} onChange={this.onSelectDistrict} required>
                                    <option key='0' value=""></option>
                                    {Districts.map((data, i) =>
                                        <option key={i + 1} value={data.Key}>{data.value}</option>
                                    )}

                                </select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">ตำบล: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <select className="form-control" id="Sub_district_ID" name="O_Sub_district_ID" value={O_Sub_district_ID} onChange={this.onChange} required>
                                    <option key='0' value=""></option>
                                    {Sub_districts.map((data, i) =>
                                        <option key={i + 1} value={data.Key}>{data.value}</option>

                                    )}
                                </select>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">เว็บไซต์: </Form.Label>
                            <Col>
                                <input type="text" className="form-control" name="O_web_url" value={O_web_url} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="4">เบอร์โทรศัพท์: <label style={{ color: "red" }}>*</label></Form.Label>
                            <Col>
                                <input type="number" className="form-control" name="O_number_phone" value={O_number_phone} onChange={this.onChange} required />
                            </Col>
                        </Form.Group>
                        <center>
                            <button type="submit" className="btn btn-success">บันทึก</button>

                        </center>
                    </form>
                </div>
            </div>
        )

    }
}


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
        ((GoogleApiWrapper({ apiKey: ('AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8'), language: 'th' }))(Orgc_manage));
