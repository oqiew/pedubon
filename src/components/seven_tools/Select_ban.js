import React, { Component } from "react";
import Firebase from "../../Firebase";
import { Link } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Topnav from "../top/Topnav";
import "../../App.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue } from "../Methods";
class Select_ban extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.fetchReducer.user,
      Provinces: [],
      Districts: [],
      Sub_districts: [],
      Bans: []
    };
  }
  getUArea() {
    const { Area_ID, Area_PID, Area_DID, Area_SDID } = this.state;
    this.listProvinces();
    this.listDistrict(Area_PID);
    this.listSub_district(Area_PID, Area_DID);
    this.listBans(Area_PID, Area_DID, Area_SDID);
  }
  authListener() {
    if (isEmptyValue(this.state.Area_ID)) {
      this.listProvinces();
    } else {
      this.getUArea();
    }
  }
  componentDidMount() {
    this.authListener();
  }
  listProvinces = () => {
    const Provinces = [];
    data_provinces.forEach((doc, i) => {
      // console.log(doc)
      Provinces.push({
        Key: i,
        value: doc[0]
      });
    });
    this.setState({
      Provinces
    });
  };
  listDistrict = pid => {
    const Districts = [];

    data_provinces[pid][1].forEach((doc, i) => {
      //  console.log(doc)
      Districts.push({
        Key: i,
        value: doc[0]
      });
    });
    if (this.state.uid !== "") {
      this.setState({
        Districts
      });
    } else {
      this.setState({
        Districts,
        Area_DID: "",
        Area_SDID: ""
      });
    }
  };
  listSub_district = (pid, did) => {
    const Sub_districts = [];

    data_provinces[pid][1][did][2][0].forEach((doc, i) => {
      Sub_districts.push({
        Key: i,
        value: doc[0]
      });
    });
    if (this.state.uid !== "") {
      this.setState({
        Sub_districts
      });
    } else {
      this.setState({
        Sub_districts,
        Area_SDID: ""
      });
    }
  };
  listBans = (pid, did, sdid) => {
    const Bans = [];

    data_provinces[pid][1][did][2][0][sdid][1][0].forEach((doc, i) => {
      Bans.push({
        Key: i,
        value: doc[1]
      });
    });
    if (this.state.uid !== "") {
      this.setState({
        Bans
      });
    } else {
      this.setState({
        Bans,
        Area_ID: ""
      });
    }
  };

  onSelectProvince = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.Area_PID === "") {
      this.setState({
        Districts: [],
        Area_DID: "",
        Sub_districts: [],
        Area_SDID: "",
        Bans: [],
        Area_ID: ""
      });
    } else {

      this.listDistrict(this.state.Area_PID);
    }
  };
  onSelectDistrict = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.Area_DID === "") {
      this.setState({
        Sub_districts: [],
        Area_SDID: "",
        Bans: [],
        Area_ID: ""
      });
    } else {
      this.listSub_district(this.state.Area_PID, this.state.Area_DID);
    }
  };
  onSelectSub_district = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.Area_SDID === "") {
      this.setState({
        Bans: [],
        Area_ID: ""
      });
    } else {
      this.listBans(
        this.state.Area_PID,
        this.state.Area_DID,
        this.state.Area_SDID
      );
    }
  };
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    const {
      uid, Province, District, Sub_district, User_type, bd,
      Ban_name, Name, Last_name, Nickname, Sex, Phone_number, Line_ID,
      Facebook, Birthday, Position, Department, Province_ID, District_ID,
      Sub_district_ID, Email, Avatar_URL, Add_date, Role, Area_ID,
      Area_PID, Area_DID, Area_SDID
    } = this.state;
    e.preventDefault();
    Firebase.firestore()
      .collection("USERS")
      .doc(this.state.uid)
      .update({
        Area_ID: parseInt(Area_ID, 10),
        Area_PID: parseInt(Area_PID, 10),
        Area_DID: parseInt(Area_DID, 10),
        Area_SDID: parseInt(Area_SDID, 10)
      })
      .then(doc => {
        const Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1]
        this.props.fetch_user({
          uid, Province, District, Sub_district, User_type, bd, Ban_name, Name, Last_name,
          Nickname, Sex, Phone_number, Line_ID, Facebook, Birthday, Position, Department, Province_ID,
          District_ID, Sub_district_ID, Email, Avatar_URL, Add_date, Role,

          Area_ID: parseInt(Area_ID, 10),
          Area_PID: parseInt(Area_PID, 10),
          Area_DID: parseInt(Area_DID, 10),
          Area_SDID: parseInt(Area_SDID, 10)
        });
        this.props.history.push('/main_seven_tools')
      })
      .catch(error => {
        console.log(error);
        confirmAlert({
          title: "เลือกไม่สำเร็จ",
          buttons: [
            {
              label: "ตกลง"
            }
          ]
        });
      });
  };

  render() {
    const { Provinces, Districts, Sub_districts, Bans } = this.state;
    const { Area_ID, uid, Area_PID, Area_DID, Area_SDID } = this.state;
    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          <center>
            <form onSubmit={this.onSubmit}>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  เลือก จังหวัด
                </Form.Label>
                <Col sm="10">
                  <select
                    className="form-control"
                    id="sel1"
                    name="Area_PID"
                    value={Area_PID}
                    onChange={this.onSelectProvince}
                    required
                  >
                    <option key="0" value="">
                      เลือก จังหวัด
                    </option>
                    {Provinces.map((data, i) => (
                      <option key={i + 1} value={data.Key}>
                        {data.value}
                      </option>
                    ))}
                  </select>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  เลือก อำเภอ
                </Form.Label>
                <Col sm="10">
                  <select
                    className="form-control"
                    id="sel1"
                    name="Area_DID"
                    value={Area_DID}
                    onChange={this.onSelectDistrict}
                    required
                  >
                    <option key="0" value="">
                      เลือก อำเภอ
                    </option>
                    {Districts.map((data, i) => (
                      <option key={i + 1} value={data.Key}>
                        {data.value}
                      </option>
                    ))}
                  </select>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  เลือก ตำบล.
                </Form.Label>
                <Col sm="10">
                  <select
                    className="form-control"
                    id="sel1"
                    name="Area_SDID"
                    value={Area_SDID}
                    onChange={this.onSelectSub_district}
                    required
                  >
                    <option key="0" value="">
                      เลือก ตำบล.
                    </option>
                    {Sub_districts.map((data, i) => (
                      <option key={i + 1} value={data.Key}>
                        {data.value}
                      </option>
                    ))}
                  </select>
                </Col>
              </Form.Group>

              <div>
                <Form.Group as={Row}>
                  <Form.Label column sm="2">
                    เลือกหมู่บ้าน
                  </Form.Label>
                  <Col sm="10">
                    <select
                      className="form-control"
                      id="sel1"
                      name="Area_ID"
                      value={Area_ID}
                      onChange={this.onChange}
                      required
                    >
                      <option key="0" value="">
                        เลือก หมู่บ้าน
                      </option>
                      {Bans.map((data, i) => (
                        <option key={i + 1} value={data.Key}>
                          {data.value} หมู่ที่ {i + 1}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Form.Group>
                <button type="submit" className="btn btn-success">
                  เลือกหมู่บ้าน
                </button>
                <Link to={`/select_local`} className="btn btn-danger">
                  กลับ
                </Link>
              </div>
            </form>
          </center>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Select_ban);
