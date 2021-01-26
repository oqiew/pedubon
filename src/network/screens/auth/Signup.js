import React, { Component } from 'react'
import TopBar from '../../topBar/TopBar'
// import '../../../css/main.css'
// import '../../../css/Signup.css'
import { connect } from 'react-redux'
import { fetch_user_network } from '../../../actions'
import Loading from '../../../components/Loading'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Row } from 'react-bootstrap';
import Firebase from '../../../Firebase'
import { tableName } from '../../database/TableName'
import { routeName } from '../../../route/RouteConstant'

export class Signup extends Component {
    constructor(props) {
        super(props)
        this.tbUserNetwork = Firebase.firestore().collection(tableName.UserNetwork)
        this.state = {
            loading: false,
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
                    this.tbUserNetwork.doc(doc.user.uid).get().then((profile) => {

                        this.props.fetch_user_network({
                            uid: doc.user.uid,
                            email: doc.user.email
                        });
                        confirmAlert({
                            title: 'บันทึกสำเร็จ',
                            message: 'ไปยังหน้าเพิ่มข้อมูลโปรไฟล์',
                            closeOnClickOutside: true,
                            buttons: [
                                {
                                    label: 'ตกลง',
                                    onClick: () => this.props.history.push(routeName.ProfileNetwork)
                                },

                            ]
                        });

                    })

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
        const { Email, Password, Confirm_password } = this.state;
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content" style={{ justifyContent: 'center ', display: 'flex' }}>

                        {/* step 1 create email */}
                        <form className="login100-form validate-form" onSubmit={this.onSubmitEmail}>
                            <span className="login100-form-title">
                                <h2 style={{ color: '#00c161' }}>สมัครสมาชิก</h2>
                            </span>
                            <Row className="wrap-inputRow" style={{ justifyContent: 'center ', display: 'flex' }}>
                                <div className="wrap-input100 validate-input" data-validate="Valid Email is required: ex@abc.xyz" >
                                    <input className="input100" type="text" name="Email" placeholder="Email" onChange={this.onChange} value={Email} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>
                            </Row>
                            <Row className="wrap-inputRow" style={{ justifyContent: 'center ', display: 'flex' }}>
                                <div className="wrap-input100 validate-input" data-validate="Password is requir d" >

                                    <input className="input100" type={this.state.hiden_pass} name="Password"
                                        placeholder="Password" maxLength="8" onChange={this.passOnChange} value={Password} />

                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true"></i>
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', zIndex: 1, marginLeft: 310 }}>
                                    {this.state.hiden_pass === 'password' ?
                                        <IoMdEyeOff onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />
                                        : <IoMdEye onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />

                                    }
                                </div>
                            </Row>
                            <Row className="wrap-inputRow" style={{ justifyContent: 'center ', display: 'flex' }}>
                                <div className="wrap-input100 validate-input" data-validate="Password is requir d" >

                                    <input className="input100" type={this.state.hiden_pass} name="Confirm_password"
                                        placeholder="Confirm_password" maxLength="8" onChange={this.passOnChange} value={Confirm_password} />

                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-lock" aria-hidden="true"></i>
                                    </span>
                                </div>
                                <div style={{ position: 'absolute', zIndex: 1, marginLeft: 310 }}>
                                    {this.state.hiden_pass === 'password' ?
                                        <IoMdEyeOff onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />
                                        : <IoMdEye onClick={this.onSwitchHiddenPass.bind(this)} size="20" style={{ cursor: 'pointer' }} />

                                    }
                                </div>
                            </Row>
                            <h6>{this.state.alert_password}</h6>
                            <center>
                                <button type="submit" className="login100-form-btn">สมัครสมาชิก </button>

                            </center>
                        </form>
                        {/* </div> */}
                    </div>
                </div>
            )
        }

    }
}

//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user_network
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);