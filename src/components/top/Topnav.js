import React, { Component } from 'react';

import {
    MDBNavbarNav, MDBNavItem, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu,
} from 'mdbreact';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import firebase from '../../firebase';
import '../../App.css';

import { isEmptyValue } from '../methods';
import Spin from '../Spin';

import { connect } from 'react-redux';
class Topnav extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            Name: '', User_ID: '', Role: '', Avatar_URL: '',
        }



        // this.logout = this.logout.bind(this);


    }


    componentDidMount() {
        this.authListener();
        // const { Name, User_ID, Role, Avatar_URL } = this.props.user;


        // this.setState({
        //     Name, User_ID, Role, Avatar_URL,
        // })
    }

    getUser(id) {

        firebase.firestore().collection('USERS').doc(id).get().then((doc) => {

            if (doc.exists) {
                const { Name, Last_name, Role, Avatar_URL } = doc.data();

                this.setState({
                    Name, Last_name, Role, Avatar_URL
                })
            }

        }
        );

    }
    authListener() {
        firebase.auth().onAuthStateChanged((user) => {

            if (user) {


                this.setState({
                    user,
                    statusLogin: true,
                    User_ID: user.uid,
                });
                this.getUser(user.uid);

            } else {
                this.setState({ user: null, statusLogin: false });
            }
        });

    }
    logout = e => {
        e.preventDefault();
        firebase.auth().signOut().then(response => {
            console.log("log out success");
        });

    }
    render() {
        const { Name, User_ID, Role, Avatar_URL } = this.state;



        return (
            <div className='fixed-top' >
                {/* <button onClick={() => this.props.setName("test name")}>changeName</button> */}
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" >

                    <Navbar.Brand href="/"> <strong className="white-text">4CTPED</strong></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/list_user" className="white-text">ข้อมูลทำเนียบ</Nav.Link>
                            <Nav.Link href="/select_local" className="white-text">เครื่องมือเรียนรู้ชุมชน</Nav.Link>
                            <Nav.Link href="/children_data" className="white-text">ข้อมูลเด็กและเยาวชน</Nav.Link>
                            {/* <NavDropdown title="ข้อมูลระบบ" id="collasible-nav-dropdown">
                                    <NavDropdown.Item href="/import_data">นำเข้าข้อมูล</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                </NavDropdown> */}
                        </Nav>

                        <MDBNavbarNav right style={User_ID !== '' ? { display: 'flex' } : { display: 'none' }}>
                            <MDBNavItem>
                                <Navbar.Brand className="waves-effect waves-light">
                                    <h4 style={{ color: '#ffffff', justifyContent: 'center' }}>{Name}</h4>
                                </Navbar.Brand>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <img className="avatar" alt="avatar" style={{ width: 23, height: 23 }} src={Avatar_URL}></img>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu className="dropdown-default">
                                        <NavDropdown.Item href="/profile">โปรไฟล์</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="/" onClick={this.logout.bind(this)}>ออกจากระบบ</NavDropdown.Item>
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>

                        </MDBNavbarNav >
                        <MDBNavbarNav right style={User_ID !== '' ? { display: 'none' } : { display: 'inline' }}>
                            <Navbar.Brand href="/login"> <strong className="white-text">เข้าสู่ระบบ</strong></Navbar.Brand>
                            <Navbar.Brand href="/register_email"> <strong className="white-text">สมัครสมาชิก</strong></Navbar.Brand>
                        </MDBNavbarNav >
                    </Navbar.Collapse>

                </Navbar>


            </div >
        );


    }



}
// const mapStatetoProps = (state) => {
//     return {
//         User: state.User
//     }
// }
// const mapDispatchProps = (dispatch) => {
//     return {
//         setName: (Name) => {

//             dispatch({
//                 type: "SetUser",
//                 state: {
//                     Name: "heool"
//                 }
//             })

//         }
//     }
// }
// export default connect(mapStatetoProps, mapDispatchProps)(Topnav);
// export default connect(mapStatetoProps)(Topnav);
export default Topnav;

