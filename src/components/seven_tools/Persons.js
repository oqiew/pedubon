import { Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import React from "react";

import "react-datepicker/dist/react-datepicker.css";

import Firebase from "../../Firebase";
import Topnav from "../top/Topnav";

//img
import Idelete from "../../assets/trash_can.png";
import Iedit from "../../assets/pencil.png";
import Izoom from "../../assets/zoom.png";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue, alert_status, GetCurrentDate } from "../Methods";
class Persons extends React.Component {
  constructor(props) {
    super(props);
    this.tbUserHome = Firebase.firestore().collection("SOCIAL_MAPS");
    //getl);
    this.state = {
      users: [],

      //data
      HName: "",
      HLastname: "",
      Haddress: "",
      HAge: "",
      HCareer: "",
      listLifeStorys: [],
      //data
      status_add: false,
      edit_ID: "",
      //getuser
      ...this.props.fetchReducer.user
    };
  }

  componentDidMount() {
    const { Area_ID, Area_SDID, Area_DID, Area_PID } = this.state;
    this.tbUserHome
      .where("Geo_map_type", "==", "home")
      .where("Area_ID", "==", Area_ID)
      .where("Area_PID", "==", Area_PID)
      .where("Area_DID", "==", Area_DID)
      .where("Area_SDID", "==", Area_SDID)
      .onSnapshot(this.onCollectionUpdate);
  }

  delete(id) {
    Firebase.firestore()
      .collection("SOCIAL_MAPS")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          var desertRef = Firebase.storage().refFromURL(
            doc.data().Map_iamge_URL
          );
          desertRef
            .delete()
            .then(function () {
              Firebase.firestore()
                .collection("SOCIAL_MAPS")
                .doc(id)
                .delete()
                .then(() => {
                  console.log("delete user and image sucess");
                })
                .catch(error => {
                  console.error("Error removing document: ", error);
                });
            })
            .catch(function (error) {
              console.log("image No such document! ");
            });
        } else {
          console.log("user No such document! " + id);
        }
      });
  }
  edit(id) {
    Firebase.firestore()
      .collection("SOCIAL_MAPS")
      .doc(id)
      .get()
      .then(doc => {
        const {
          HName,
          HLastname,
          HAddress,
          HAge,
          HCareer,
          Geo_map_description
        } = doc.data();
        if (
          HName === "" ||
          HLastname === "" ||
          HAddress === "" ||
          HAge === "" ||
          HCareer === "" ||
          HName === undefined ||
          HLastname === undefined ||
          HAddress === undefined ||
          HAge === undefined ||
          HCareer === undefined
        ) {
          this.setState({
            Geo_map_description,
            edit_ID: id
          });
        } else {
          console.log("edit");
          this.setState({
            HName,
            HLastname,
            HAddress,
            HAge,
            HCareer,
            Geo_map_description,
            edit_ID: id
          });
        }
      })
      .catch(error => {
        console.error("Error document: ", error);
      });
  }
  cancelEdit = e => {
    this.setState({
      HName: "",
      HLastname: "",
      HAddress: "",
      HAge: "",
      HCareer: "",
      Geo_map_description: "",
      edit_ID: ""
    });
  };
  onCollectionUpdate = querySnapshot => {
    const listLifeStorys = [];

    querySnapshot.forEach(doc => {
      const {
        Informer_name,
        HAddress,
        HAge,
        HCareer,
        Map_iamge_URL,
        Geo_map_name,
        Geo_map_description,
        HName,
        HLastname
      } = doc.data();

      // var temp = parseInt();
      // console.log(HName)
      listLifeStorys.push({
        img: (
          <img
            src={Map_iamge_URL}
            alt="mapURL"
            style={{ width: 50, height: 50 }}
          ></img>
        ),
        Geo_map_name,
        HName,
        HLastname,
        HAddress,
        HAge,
        HCareer,
        Geo_map_description,
        Informer_name,
        edit: (
          <div>
            {HName !== undefined ? (
              <Link to={`/person_historys/${doc.id}/${HName}`}>
                <img
                  alt="zoom"
                  style={{ widtha: 20, height: 20, cursor: "pointer" }}
                  src={Izoom}
                ></img>
              </Link>
            ) : (
                <div></div>
              )}
            <img
              alt="edit"
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              src={Iedit}
              onClick={this.edit.bind(this, doc.id)}
            ></img>
            <img
              alt="delete"
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              src={Idelete}
              onClick={this.delete.bind(this, doc.id)}
            ></img>
          </div>
        )
      });
    });

    this.setState({
      listLifeStorys
    });
  };

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      HName,
      HLastname,
      HAddress,
      HAge,
      HCareer,
      Geo_map_description,
      Area_ID,
      Area_PID,
      Area_DID,
      Area_SDID,
      edit_ID,
      Name,
      User_ID
    } = this.state;

    this.tbUserHome
      .doc(edit_ID)
      .update({
        Informer_name: Name,
        Area_ID,
        Area_PID,
        Area_DID,
        Area_SDID,
        HName,
        HLastname,
        HAddress,
        HAge,
        HCareer,
        Geo_map_description,
        Informer_ID: User_ID,
      })
      .then(result => {
        this.setState({
          HName: "",
          HLastname: "",
          HAddress: "",
          HAge: "",
          HCareer: "",
          Geo_map_description: "",
          edit_ID: ""
        });
      })
      .catch(error => {
        alert_status("noupdate");
        console.log(error);
      });
  };
  render() {
    const {
      HName,
      HLastname,
      HAddress,
      HAge,
      HCareer,
      Geo_map_description,
      Ban_name
    } = this.state;
    const data = {
      columns: [
        {
          label: "#",
          field: "img",
          sort: "asc"
        },
        {
          label: "ชื่อในชุมชน",
          field: "Geo_map_name",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "HName",
          sort: "asc"
        },
        {
          label: "นามสกุล",
          field: "HLastname",
          sort: "asc"
        },
        {
          label: "ที่อยู่",
          field: "HAddress",
          sort: "asc"
        },
        {
          label: "อายุ",
          field: "HAge",
          sort: "asc"
        },
        {
          label: "อาชีพ",
          field: "HCareer",
          sort: "asc"
        },
        {
          label: "บริบทในชุมชน",
          field: "Geo_map_description",
          sort: "asc"
        },
        {
          label: "ผู้เพิ่มข้อมูล",
          field: "Informer_name",
          sort: "asc"
        },
        {
          label: "แก้ไข",
          field: "edit",
          sort: "asc"
        }
      ],
      rows: this.state.listLifeStorys
    };

    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          <center>
            <h2>
              <strong>
                ประวัติชีวิต : {Ban_name}หมู่ที่
                {this.state.Area_ID + 1}
              </strong>{" "}
            </h2>
            <hr></hr>
            <h4>
              <strong>รายชื่อบุคคลที่น่าสนใจในชุมชน</strong>{" "}
            </h4>
            <br></br>
            <MDBDataTable
              striped
              bordered
              small
              searchLabel="ค้นหา"
              paginationLabel={["ก่อนหน้า", "ถัดไป"]}
              infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
              entriesLabel="แสดง รายการ"
              data={data}
            />
            <hr></hr>

            {this.state.edit_ID !== "" ? (
              <div>
                <h4>
                  <strong>แก้ไขข้อมูลบุคคลน่าสนใจในชุมชน</strong>{" "}
                </h4>
                <br></br>
                <form onSubmit={this.onSubmit}>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          ชื่อ <label style={{ color: "red" }}>*</label>
                        </Form.Label>
                        <Col>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ชื่อ"
                            name="HName"
                            value={HName}
                            onChange={this.onChange}
                            required
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          นามสกุล <label style={{ color: "red" }}>*</label>{" "}
                        </Form.Label>
                        <Col>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="นามสกุล"
                            name="HLastname"
                            value={HLastname}
                            onChange={this.onChange}
                            required
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          ที่อยู่ <label style={{ color: "red" }}>*</label>
                        </Form.Label>
                        <Col>
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              name="HAddress"
                              value={HAddress}
                              onChange={this.onChange}
                              placeholder="บ้านเลขที่ หมู่บ้าน"
                              cols="80"
                              rows="5"
                              required
                            >
                              {HAddress}
                            </textarea>
                          </div>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          อายุ <label style={{ color: "red" }}>*</label>{" "}
                        </Form.Label>

                        <Col>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="อายุ"
                            name="HAge"
                            value={HAge}
                            onChange={this.onChange}
                            required
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          อาชีพ <label style={{ color: "red" }}>*</label>{" "}
                        </Form.Label>
                        <Col>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="อาชีพ"
                            name="HCareer"
                            value={HCareer}
                            onChange={this.onChange}
                            required
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm="3">
                          บทบาทในชุมชน <label style={{ color: "red" }}>*</label>{" "}
                        </Form.Label>
                        <Col>
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              name="Geo_map_description"
                              value={Geo_map_description}
                              onChange={this.onChange}
                              placeholder="คำอธิบาย บทบาท ความสัมพันธ์ ในชุมชน"
                              cols="80"
                              rows="5"
                              required
                            >
                              {Geo_map_description}
                            </textarea>
                          </div>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <button
                    type="submit"
                    className="btn btn-success"
                    style={{ borderRadius: "4px" }}
                  >
                    บันทึกข้อมูล
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.cancelEdit.bind(this)}
                    style={{ borderRadius: "4px" }}
                  >
                    ยกเลิก
                  </button>
                  <br></br>
                </form>
              </div>
            ) : (
                <div>
                  <Link to={"/main_seven_tools"} className="btn btn-danger">
                    กลับ
                </Link>
                </div>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Persons);
