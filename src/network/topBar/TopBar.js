import React, { Component } from 'react'
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import {
    MDBNavbarNav,
    MDBNavItem,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu
} from "mdbreact";
import Firebase from "../../Firebase";
import { isEmptyValue } from '../../components/Methods';
import { routeName } from '../../route/RouteConstant';
import { connect } from 'react-redux';
import { fetch_user_network } from '../../actions';


export class TopBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.props.fetchReducer.user_network
        }
    }
    componentDidMount() {

    }
    logout = e => {
        this.props.fetch_user_network({});
        Firebase.auth()
            .signOut()
            .then(() => this.props.history.push(routeName.HomeNetworks));
    };
    render() {
        const { uid, Name, Role } = this.state;
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href={routeName.HomeNetworks}>
                    <strong className="white-text">4CTPED</strong>
                </Navbar.Brand>

                <Nav className="mr-auto">
                    {!isEmptyValue(uid) && <Nav.Link href={routeName.Network} className="white-text">
                        หน่วยงานของคุณ
                </Nav.Link>}
                    <Nav.Link href={routeName.Networks} className="white-text">
                        ข้อมูลเครือข่ายทั้งหมด
                </Nav.Link>
                    {(!isEmptyValue(Role) && Role === 'admin') && <Nav.Link href={routeName.AdminNetwork} className="white-text">
                        admin
                </Nav.Link>}
                </Nav>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <MDBNavbarNav
                        right
                        style={
                            !isEmptyValue(uid)
                                ? { display: "inline" }
                                : { display: "none" }
                        }
                    >
                        <Navbar.Brand href={routeName.ProfileNetwork}>
                            <strong className="white-text" ><u>คุณ{Name}</u></strong>
                        </Navbar.Brand>
                        <Navbar.Brand onClick={this.logout.bind(this)} style={{ cursor: 'pointer' }}>
                            <strong className="white-text">ออกจากระบบ</strong>
                        </Navbar.Brand>
                    </MDBNavbarNav>
                    <MDBNavbarNav
                        right
                        style={
                            isEmptyValue(uid)
                                ? { display: "inline" }
                                : { display: "none" }
                        }
                    >
                        <Navbar.Brand href={routeName.SigninNetwork}>
                            <strong className="white-text">เข้าสู่ระบบ</strong>
                        </Navbar.Brand>
                        <Navbar.Brand href={routeName.SignupNetwork}>
                            <strong className="white-text">สมัครสมาชิก</strong>
                        </Navbar.Brand>
                    </MDBNavbarNav>
                </Navbar.Collapse>
            </Navbar>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);