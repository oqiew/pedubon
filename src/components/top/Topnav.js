import React, { Component } from "react";

import {
  MDBNavbarNav,
  MDBNavItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu
} from "mdbreact";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import Firebase from "../../Firebase";
import "../../App.css";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import { isEmptyValue } from "../Methods";
import Avatar_user from '../../assets/user.png'
import { routeName } from "../../route/RouteConstant";
class Topnav extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    // console.log(this.props.fetchReducer)
    this.state = {
      ...this.props.fetchReducer.user
    };
  }
  logout = e => {
    this.props.fetch_user({});
    Firebase.auth()
      .signOut()
      .then(() => this.props.history.push("/"));
  };
  render() {
    const { Name, uid, Avatar_URL, Role } = this.state;


    return (
      <div className="fixed-top">
        {/* <button onClick={() => this.props.setName("test name")}>changeName</button> */}
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">
            {" "}
            <strong className="white-text">4CTPED</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/list_user" className="white-text">
                ข้อมูลทำเนียบ
                </Nav.Link>
              <Nav.Link href="/select_local" className="white-text">
                {!isEmptyValue(Role) && Role === 'admin' ? 'เครื่องมือชุมชน' : 'แผนที่ข้อมูลชุมชน'}
              </Nav.Link>
              {!isEmptyValue(Name) ?
                <NavDropdown title="ข้อมูลพื้นที่" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/area">จัดการข้อมูลพื้นที่</NavDropdown.Item>
                  {!isEmptyValue(Role) && Role === 'admin' &&
                    <NavDropdown.Item href="/projects">ตรวจสอบโครงการ</NavDropdown.Item>}

                </NavDropdown>
                :
                <Nav.Link href="/area_public" className="white-text">
                  ข้อมูลพื้นที่
              </Nav.Link>
              }

              <Nav.Link href="/activity" className="white-text">
                กิจกรรม
                </Nav.Link>
              <Nav.Link href="/course" className="white-text">
                คลังความรู้
                </Nav.Link>
              {!isEmptyValue(Role) && Role === 'admin' &&
                <>
                  <NavDropdown title="องค์กร" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/orgc_manage">เพิ่มองค์กร</NavDropdown.Item>
                    <NavDropdown.Item href="/orgcs">องค์กร</NavDropdown.Item>

                  </NavDropdown>
                  <NavDropdown title="จัดการข้อมูล" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/import_user">เพิ่มบัญชีผู้ใช้</NavDropdown.Item>
                  </NavDropdown>
                </>}
              <Nav.Link href="/cdata_manage" className="white-text">
                สุขภาวะ
                </Nav.Link>
              <Nav.Link href="/coach" className="white-text">
                <b>coach</b>
              </Nav.Link>
              {!isEmptyValue(Role) && Role === 'admin' ?
                <Nav.Link href="/adminCheck" className="white-text">
                  ตรวจสอบเอกสาร
                </Nav.Link>
                : <Nav.Link href="/docsManage" className="white-text">
                  ตรวจสอบเอกสาร
</Nav.Link>
              }

              {/* <Nav.Link href="/map_all" className="white-text">
                  แผนที่
                </Nav.Link> */}

              {/* <Nav.Link href="/children_data" className="white-text">ข้อมูลเด็กและเยาวชน</Nav.Lin */}
              {/* <NavDropdown title="ข้อมูลระบบ" id="collasible-nav-dropdown">
                                        <NavDropdown.Item href="/import_data">นำเข้าข้อมูล</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                    </NavDropdown> */}
            </Nav>

            <MDBNavbarNav
              right
              style={
                isEmptyValue(uid)
                  ? { display: "none" }
                  : { display: "flex" }
              }
            >
              <MDBNavItem>
                <Navbar.Brand className="waves-effect waves-light">
                  <h4 style={{ color: "#ffffff", justifyContent: "center" }}>
                    {Name}
                  </h4>
                </Navbar.Brand>
              </MDBNavItem>
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu className="dropdown-default">
                    {!isEmptyValue(Name) && <NavDropdown.Item href="/profile">
                      โปรไฟล์
                      </NavDropdown.Item>}
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/"
                      onClick={this.logout.bind(this)}
                    >
                      ออกจากระบบ
                      </NavDropdown.Item>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav
              right
              style={
                isEmptyValue(uid)
                  ? { display: "inline" }
                  : { display: "none" }
              }
            >
              <Navbar.Brand href="/login">
                {" "}
                <strong className="white-text">เข้าสู่ระบบ</strong>
              </Navbar.Brand>
              <Navbar.Brand href="/register_email">
                {" "}
                <strong className="white-text">สมัครสมาชิก</strong>
              </Navbar.Brand>
            </MDBNavbarNav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );


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

export default connect(mapStateToProps, mapDispatchToProps)(Topnav);
