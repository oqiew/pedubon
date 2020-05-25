

import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import '../../App.css';
import cw from '../../assets/children_walk.gif';


import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue } from "../Methods";

export class View_User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            User_ID: '', Province: '', District: '', Sub_district: '', User_type: '', bd: '',
            Ban_name: '', Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '', Line_ID: '',
            Facebook: '', Birthday: '', Position: '', Department: '', Province_ID: '', District_ID: '',
            Sub_district_ID: '', Email: '', Avatar_URL: '', Add_date: '', Role: '', Area_ID: '',
            Area_PID: '', Area_DID: '', Area_SDID: '',
        }

    }
    componentDidMount() {

        Firebase.firestore().collection('USERS').doc(this.props.match.params.id).get().then((doc) => {
            const { Province_ID, District_ID, Sub_district_ID, Birthday, Area_PID,
                Area_DID, Area_SDID, Area_ID } = doc.data();
            var Ban_name = '';
            const Province = data_provinces[Province_ID][0];
            const District = data_provinces[Province_ID][1][District_ID][0];
            if (!isEmptyValue(Area_ID)) {
                Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1];
            }
            const Sub_district = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
            var d1 = new Date(Birthday.seconds * 1000);
            let bd =
                d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
            this.setState({
                User_ID: doc.uid, Province, District, Sub_district, bd, Ban_name,
                ...doc.data()
            })
        })
    }
    render() {

        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, bd, Position, Department,
            Avatar_URL,

        } = this.state;

        const { Province, District, Sub_district, User_type } = this.state;
        return (
            <div>
                <Topnav user={this.state.User}></Topnav>
                <div className='main_component'>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <div>
                            {Avatar_URL && <img className="avatar" alt="avatar" style={{ marginRight: 30 }} src={Avatar_URL} />}
                        </div>
                        <div style={{ flexDirection: 'column' }}>
                            <h4 style={{ padding: 5 }}><strong>ชื่อ : </strong>{Name} {Last_name}<strong> ชื่อเล่น : </strong>{Nickname}<strong> เพศ : </strong>{Sex}<strong>  วันเกิด : </strong>{bd}</h4>
                            <h4 style={{ padding: 5 }}><strong>ประเภทผู้ใช้ : </strong>{User_type}<strong>  เบอร์โทรศัพท์มือถือ : </strong>{Phone_number}</h4>
                            <h4 style={{ padding: 5 }}><strong>Facebook : </strong>{Facebook}<strong>  Line_ID : </strong>{Line_ID}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำแหน่ง : </strong>{Position}<strong>  หน่วยงาน : </strong>{Department}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำบล : </strong>{Sub_district}<strong>  อำเภอ : </strong>{District}<strong> จังหวัด : </strong>{Province}</h4>
                        </div>

                    </div>
                    <Row>



                    </Row>
                    <center>
                        <Link className="btn btn-success" to={'/register'}>แก้ไข</Link>
                        <br></br>
                        <img src={cw} alt="bg_gif" style={{ width: '50%', height: '50%' }}></img>
                    </center>
                    <div style={{ right: 0 }}>

                    </div>
                </div>
            </div>
        )
    }
}



export default View_User;

