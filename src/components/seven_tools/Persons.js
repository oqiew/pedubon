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
import { isEmptyValue, alert_status, GetCurrentDate, deleteSM } from "../Methods";
import { tableName } from "../../database/TableConstant";

class Persons extends React.Component {
  constructor(props) {
    super(props);
    this.tbUserHome = Firebase.firestore().collection(tableName.Social_maps);
    //getl);
    this.nameFocus = React.createRef();
    this.state = {
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
    const { Area_ID, } = this.state;
    this.tbUserHome
      .where("Geo_map_type", "==", "home")
      .where("Important", "==", true)
      .where("Area_ID", "==", Area_ID)
      .onSnapshot(this.onCollectionUpdate);
  }

  delete(id, data) {
    if (this.state.uid === data.Create_By_ID || this.state.Role === 'admin') {

      deleteSM(id, data)
    }
  }
  edit(data, id) {
    console.log(this)
    const { HName, HLastname, HAddress,
      HAge, HCareer, Geo_map_description, } = data;
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
      this.setState({
        HName,
        HLastname,
        HAddress,
        HAge,
        HCareer,
        Geo_map_description,
        edit_ID: id
      }, () => {
        this.nameFocus.focus();
      });
    }

  }
  cancelEdit = e => {
    this.nameFocus = null;
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
        Map_image_URL,
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
            src={Map_image_URL}
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
              onClick={this.edit.bind(this, doc.data(), doc.id)}
            ></img>
            <img
              alt="delete"
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              src={Idelete}
              onClick={this.delete.bind(this, doc.id, doc.data())}
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
      HName, HLastname, HAddress, HAge,
      HCareer, Geo_map_description, Area_ID, edit_ID, Name, uid
    } = this.state;
    this.tbUserHome
      .doc(edit_ID)
      .update({
        Informer_name: Name,
        Geo_ban_ID: Area_ID,
        HName,
        HLastname,
        HAddress,
        HAge,
        HCareer,
        Geo_map_description,
        Informer_ID: uid,
        Update_date: Firebase.firestore.Timestamp.now(),
      })
      .then(result => {
        this.nameFocus = null;
        this.setState({
          HName: '',
          HLastname: '',
          HAddress: '',
          HAge: '',
          HCareer: '',
          Geo_map_description: '',
          edit_ID: '',
          selected: 1,
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
      area
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
                ประวัติชีวิต : พื้นที่ {area.Area_name}
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

                            ref={(ref) => (this.nameFocus = ref)}
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
