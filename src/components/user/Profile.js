

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

export class Register extends Component {
    constructor(props) {
        super(props);

        console.log(this.props.fetchReducer.user)
        this.state = {
            ...this.props.fetchReducer.user,
        }

    }
    render() {

        //User Profile
        const { Email, Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, bd, Position, Department, Role,
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
                            <h4 style={{ padding: 5 }}>{Email} : {Role === 'admin' && <b style={{ color: 'red' }}>{Role}</b>}</h4>
                            <h4 style={{ padding: 5 }}><strong>ชื่อ : </strong>{Name} {Last_name}<strong> ชื่อเล่น : </strong>{Nickname}<strong> เพศ : </strong>{Sex}<strong>  วันเกิด : </strong>{bd}</h4>
                            <h4 style={{ padding: 5 }}><strong>ประเภทผู้ใช้ : </strong>{User_type}<strong>  เบอร์โทรศัพท์มือถือ : </strong>{Phone_number}</h4>
                            <h4 style={{ padding: 5 }}><strong>Facebook : </strong>{Facebook}<strong>  Line_ID : </strong>{Line_ID}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำแหน่ง : </strong>{Position}<strong>  หน่วยงาน : </strong>{Department}</h4>
                            <h4 style={{ padding: 5 }}><strong>ตำบล : </strong>{Sub_district}<strong>  อำเภอ : </strong>{District}<strong> จังหวัด : </strong>{Province}</h4>
                        </div>

                    </div>
                    <Row>



                    </Row>
                    <center><Link className="btn btn-success" to={'/register'}>แก้ไข</Link>
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

//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

