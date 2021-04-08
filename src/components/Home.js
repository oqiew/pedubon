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

import Loading from "./Loading";
import Topnav from "./top/Topnav";
import { isEmptyValue } from "./Methods";
import { tableName } from "../database/TableConstant";
import { routeName } from "../route/RouteConstant";

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
        Firebase.firestore().collection(tableName.Users).doc(user.uid).get().then(async (doc) => {
          if (doc.exists) {
            const area = await this.setArea(doc.data().Area_ID)
            this.props.fetch_user({
              uid: user.uid, email: user.email, ...doc.data(),
              area
            });
            if (!this.props.fetchReducer.isFectching) {

              this.setState({
                loading: false
              });
            }
          } else {
            this.props.fetch_user({ uid: user.uid, email: user.email });
            this.props.history.push('register')
            this.setState({
              loading: false
            });
          }

        });
      } else {
        console.log("cann't login");
        this.props.fetch_user({});
        Firebase.auth()
          .signOut()
          .then(() => this.props.history.push("/"));
        this.setState({
          loading: false
        });
      }
    });
  }
  setArea = async (Area_ID) => {
    return new Promise((resolve, reject) => {
      Firebase.firestore().collection(tableName.Areas).doc(Area_ID).get().then((doc) => {
        if (doc.exists) {
          resolve({ ID: doc.id, ...doc.data(), area_name: doc.data().Dominance + " " + doc.data().Area_name + "(" + doc.data().Area_type + ")" })
        } else {
          reject('')
        }
      })
    })
  }
  render() {
    if (this.state.loading) {
      return <Loading></Loading>;
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
