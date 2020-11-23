import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { fetch_user } from "../actions";
import "../App.css";
import logo4ctped from "../assets/4ctped.png";
import silc from "../assets/SILC-LOGO.png";
import sss from "../assets/sss.png";
import data_provinces from "../data/provinces";
import Firebase from "../Firebase";

import Spin from "./Spin";
import Topnav from "./top/Topnav";
import { isEmptyValue } from "./Methods";

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,

    };
  }
  componentDidMount() {
    this.setState({
      loading: true
    });
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.email)
        Firebase.firestore()
          .collection("USERS").doc(user.uid).get().then(doc => {
            if (doc.exists) {
              const { Province_ID, District_ID, Sub_district_ID, Birthday, Area_PID,
                Area_DID, Area_SDID, Area_ID } = doc.data();
              console.log(doc.data());
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

              this.props.fetch_user({
                User_ID: user.uid, Province, District, Sub_district,
                bd, Ban_name, ...doc.data()
              });
              if (!this.props.fetchReducer.isFectching) {
                this.setState({
                  loading: false
                });
              }
            } else {
              this.props.fetch_user({ User_ID: user.uid, Email: user.email });
              this.setState({
                loading: false
              });
            }



          });
      } else {
        console.log("cann't login");
        this.setState({
          loading: false
        });
      }
    });
  }
  render() {
    if (this.state.loading) {
      return <Spin></Spin>;
    } else {
      return (
        <center>
          <Topnav></Topnav>
          <div className="project_detail">
            <div className="shodow"></div>
            {/* <img src={pencil} className="support_logo" alt="logo1"></img> */}
            <h1>
              <strong>
                โครงการสร้างเสริมสุขภาวะเด็กและเยาวชน จังหวัดอุบลราชธานี
              </strong>
            </h1>
            <hr style={{ width: "70%" }}></hr>
            <Row className="footer">
              <Col>
                <img
                  src={logo4ctped}
                  className="support_logo"
                  alt="logo1"
                  style={{ minWidth: 50 }}
                ></img>
              </Col>
              <Col>
                <img src={sss} className="support_logo" style={{ minWidth: 50 }} alt="logo1"></img>
              </Col>
              <Col>
                <img
                  src={silc}
                  style={{ minWidth: 50, width: '100%', height: '100%' }}
                  alt="logo1"
                ></img>
              </Col>
            </Row>
          </div>
        </center>
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
