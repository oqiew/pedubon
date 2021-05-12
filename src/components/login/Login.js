import React, { Component } from 'react';
import '../../css/Signup.css';
import Logo from '../../assets/4ctped.png';
import { Row } from 'react-bootstrap';
import Firebase from '../../Firebase';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: '',
            Password: '',
            login: true,
            reset_password: false,
            hiden_pass: 'password',
        }
    }
    onChange = e => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push('/');
            }
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { Email, Password } = this.state;
        Firebase.auth()
            .signInWithEmailAndPassword(Email, Password)
            .then(response => {
                console.log("login success");
                this.props.history.push('/');
            })
            .catch(error => {
                confirmAlert({
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    message: ' กรุณาเช็คอีเมลและพาสเวิร์ดของท่าน',
                    buttons: [
                        {
                            label: 'ตกลง',
                        },

                    ]
                });
            })
    }
    onResetPassword = (e) => {
        e.preventDefault();
        Firebase.auth().sendPasswordResetEmail(this.state.Email)
            .then((doc) => {
                confirmAlert({
                    title: 'ตั้งรหัสผ่านใหม่สำเร็จ',
                    message: ' กรุณาเช็คอีเมลของท่าน',
                    closeOnClickOutside: true,
                    buttons: [
                        {
                            label: 'ตกลง',
                            onClick: () => this.setState({
                                reset_password: false,
                                login: true,

                            })
                        },

                    ]
                });


            })
            .catch(error => {
                confirmAlert({
                    title: 'ตั้งรหัสผ่านใหม่ไม่สำเร็จ',
                    message: ' กรุณาเช็คอีเมลของท่าน',
                    buttons: [
                        {
                            label: 'ตกลง',
                        },

                    ]
                });
            });
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
    calcel = (e) => {
        e.preventDefault()
        this.setState({
            Email: '',
            Password: '',
            login: true,
            reset_password: false,
        })
    }
    render() {
        return (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        {/* <h4>เสริมสร้างสุขภาวะเด็กและเยาวชน จังหวัดอุบลราชธานี</h4> */}
                        <div className="login100-pic js-tilt" data-tilt>
                            <img src={Logo} alt="IMG"></img>
                        </div>

                        {this.state.login ?
                            <form className="login100-form validate-form" onSubmit={this.onSubmit}>
                                <span className="login100-form-title">
                                    <h2 style={{ color: '#00c161' }}>เข้าสู่ระบบ</h2>
                                </span>
                                <Row className="wrap-inputRow">
                                    <div className="wrap-input100 validate-input" data-validate="Valid Email is required: ex@abc.xyz">
                                        <input className="input100" type="text" name="Email" placeholder="Email" onChange={this.onChange} />
                                        <span className="focus-input100"></span>
                                        <span className="symbol-input100">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                </Row>
                                <Row className="wrap-inputRow">
                                    <div className="wrap-input100 validate-input" data-validate="Password is requir d">

                                        <input className="input100" type={this.state.hiden_pass} name="Password" placeholder="Password" onChange={this.onChange} />

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
                                <h6>{this.state.loginStatus}</h6>
                                <div className="container-login100-form-btn" style={{ marginTop: 10 }}>
                                    <button type="submit" className="login100-form-btn">
                                        เข้าสู่ระบบ
                                 </button>
                                </div>
                                <Link className="login100-form-btn2" to="/"> กลับ</Link>
                                <div className="text-center p-t-12">
                                    <h6 className="txt2" style={{ cursor: 'pointer' }} onClick={() => this.setState({ login: false, reset_password: true })} >
                                        ลืมรหัสผ่าน
                                    </h6>
                                </div>
                            </form>
                            :
                            //reset password
                            <form className="login100-form validate-form" onSubmit={this.onResetPassword}>
                                <span className="login100-form-title">
                                    <h2 style={{ color: '#00c161' }}>ตั้งรหัสผ่านใหม่</h2>
                                </span>

                                <div className="wrap-input100 validate-input" data-validate="Valid Email is required: ex@abc.xyz">
                                    <input className="input100" type="text" name="Email" placeholder="Email" onChange={this.onChange} />
                                    <span className="focus-input100"></span>
                                    <span className="symbol-input100">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                </div>
                                <h6>{this.state.loginStatus}</h6>
                                <div className="container-login100-form-btn">
                                    <button type="submit" className="login100-form-btn">
                                        ส่งลิ้ง
                                         </button>
                                </div>

                                <button className="login100-form-btn2" type="button"
                                    onClick={this.calcel.bind(this)}> กลับ</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;
