import React, { Component } from "react";
import Firebase from "../../Firebase";
import { Link } from "react-router-dom";
import Topnav from "../top/Topnav";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue } from "../Methods";
import "../../App.css";
import Main_map_admin from "./Main_map_admin";

export class Select_local extends Component {
  constructor(props) {
    super(props);
    this.tbLGOs = Firebase.firestore().collection("LGOS");
    this.state = {
      ...this.props.fetchReducer.user,
      LGOs: []
    };
  }
  componentDidMount() {

  }
  render() {
    const { Ban_name, Name } = this.state;
    if (!isEmptyValue(Name)) {
      return (
        <div>
          <Topnav></Topnav>
          <div className="main_component">
            <center>
              {!isEmptyValue(Ban_name) ? (
                <h2>
                  <strong>
                    บ้าน {Ban_name}หมู่ที่{this.state.Area_ID + 1}
                  </strong>{" "}
                </h2>
              ) : (
                  <h2>
                    <strong>กรุณาเลือกหมู่บ้านที่ทำการสำรวจ</strong>{" "}
                  </h2>
                )}

              <hr></hr>

              {!isEmptyValue(Ban_name) ? (
                <Link className="btn btn-success" to="/main_seven_tools">
                  เปิดเครื่องมือ
                </Link>
              ) : (
                  <div></div>
                )}
              <Link className="btn btn-success" to={`/select_ban`}>
                เลือกหมู่บ้าน
              </Link>
              <hr></hr>
              <Main_map_admin></Main_map_admin>
            </center>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Topnav></Topnav>
          <div className="main_component">
            <center>
              <Main_map_admin></Main_map_admin>
            </center>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Select_local);
