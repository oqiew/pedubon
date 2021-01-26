import { Row } from 'react-bootstrap';
import React, { Component } from 'react'
import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';
import '../../App.css';
import '../../css/Signup.css';
//img
import { confirmAlert } from 'react-confirm-alert'; // Import

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
export class Register_email extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            Confirm_password: '',
            alert_password: '',
            //
            hiden_pass: 'password'
        }
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    passOnChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        const { Password, Confirm_password } = this.state;

        if (Password !== Confirm_password) {
            console.log(Password + "!=" + Confirm_password)
            this.setState({
                alert_password: 'รหัสผ่านไม่ตรงกัน'
            })
        } else {
            this.setState({
                alert_password: ''
            })
        }


    }

    onSubmitEmail = (e) => {
        e.preventDefault();

        const { Email, Password } = this.state;
        if (this.state.alert_password === '') {
            Firebase.auth().createUserWithEmailAndPassword(Email, Password)
                .then(doc => {
                    this.props.fetch_user({
                        User_ID: doc.user.uid,
                        Email: doc.user.email
                    });
                    confirmAlert({
                        title: 'บันทึกสำเร็จ',
                        message: 'ไปยังหน้าเพิ่มข้อมูลโปรไฟล์',
                        closeOnClickOutside: true,
                        buttons: [
                            {
                                label: 'ตกลง',
                                onClick: () => this.props.history.push('/register')
                            },

                        ]
                    });

                }).catch(error => {
                    confirmAlert({
                        title: 'บันทึกไม่สำเร็จ',
                        message: ' อีเมลถูกใช้งานแล้ว',
                        closeOnClickOutside: true,
                        buttons: [
                            {
                                label: 'ตกลง',

                            },

                        ]
                    });
                })
        }


    }
    onSwitchHiddenPass = (e) => {
        e.preventDefault();
        if (this.state.hiden_pass === 'password') {
            this.setState({
                hiden_pass: 'text'
            })
        } else {
            this.setState({
                hiden_pass: 'password'
            })
        }

    }
    render() {
        //step create Email
        const { Email, Password, Confirm_password } = this.state;
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component' style={{ justifyContent: 'center ', display: 'flex' }}>
                    {/* step 1 create email */}
                    <form className="login100-form validate-form" onSubmit={this.onSubmitEmail}>
                        <span className="login100-form-title">
                            <h2 style={{ color: '#00c161' }}>สมัครสมาชิก</h2>
                        </span>
                        <Row className="wrap-inputRow">
                            <div className="wrap-input100 validate-input" data-validate="Valid Email is required: ex@abc.xyz">
                                <input className="input100" type="text" name="Email" placeholder="Email" onChange={this.onChange} value={Email} />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                </span>
                            </div>
                        </Row>
                        <Row className="wrap-inputRow">
                            <div className="wrap-input100 validate-input" data-validate="Password is requir d">
                                <input className="input100" type={this.state.hiden_pass} name="Password"
                                    placeholder="Password" maxLength="8" onChange={this.passOnChange} value={Password} />

                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                            {this.state.hiden_pass === 'password' ?
                                <IoMdEyeOff onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />
                                : <IoMdEye onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />

                            }

                        </Row>
                        <Row className="wrap-inputRow">
                            <div className="wrap-input100 validate-input" data-validate="Password is requir d">

                                <input className="input100" type={this.state.hiden_pass} name="Confirm_password"
                                    placeholder="Confirm_password" maxLength="8" onChange={this.passOnChange} value={Confirm_password} />

                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                            {this.state.hiden_pass === 'password' ?
                                <IoMdEyeOff onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />
                                : <IoMdEye onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />

                            }

                        </Row>
                        <h6>{this.state.alert_password}</h6>
                        <div className="container-login100-form-btn" style={{ marginTop: 10 }}>
                            <button type="submit" className="login100-form-btn">สมัครสมาชิก </button>
                        </div>

                    </form>


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

export default connect(mapStateToProps, mapDispatchToProps)(Register_email);