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
import { Row } from "react-bootstrap";
import { tableName } from "../../database/TableConstant";
import Loading from "../Loading";

export class Select_local extends Component {
  constructor(props) {
    super(props);
    this.tbAreas = Firebase.firestore().collection(tableName.Areas);
    this.state = {
      ...this.props.fetchReducer.user,
      area: [],
      loading: false
    };
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    this.tbAreas.doc(this.state.Area_ID).get().then((doc) => {
      this.setState({
        area: doc.data(),
        loading: false
      })
    })
  }
  render() {
    const { area } = this.state;
    if (this.state.loading) {
      return (<Loading></Loading>)
    } else {
      return (
        <div>
          <Topnav></Topnav>
          <div className="main_component">
            <center>

              <div style={{ justifyContent: "center" }} >
                <h4>{area.Dominance + area.Area_name} {area.Area_type !== '' && area.Area_type}</h4>
                <Link className="btn btn-success" to="/main_seven_tools">
                  เปิดเครื่องมือ
                </Link>
              </div>
              <hr></hr>
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
