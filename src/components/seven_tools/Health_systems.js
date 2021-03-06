import { MDBDataTable } from "mdbreact";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "react-datepicker/dist/react-datepicker.css";
import OrgChart from "react-orgchart";
import "react-orgchart/index.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetch_user } from "../../actions";
//img
import Iadd from "../../assets/add.png";
import Icheckmark from "../../assets/checkmark.png";
import Idelete from "../../assets/trash_can.png";
import Firebase from "../../Firebase";
import { isEmptyValue } from "../Methods";
import Topnav from "../top/Topnav";

class Health_systems extends React.Component {
  constructor(props) {
    super(props);
    this.tbSM = Firebase.firestore().collection("SOCIAL_MAPS");
    this.unsubscribe = null;
    //getl);
    this.state = {
      users: [],
      statusSave: "",
      childrenOrg: [],

      //data
      HName: "",
      HLastname: "",
      Haddress: "",
      HAge: "",
      HCareer: "",
      HS: [],
      HSO: [],
      //data
      status_add: false,
      edit_ID: "",
      //data b
      Geo_map_name: "",
      //getuser
      ...this.props.fetchReducer.user,

      //
      select_add: "",
      //
      addb: false
    };
  }

  componentDidMount() {

    const { Area_ID, Area_SDID, Area_DID, Area_PID } = this.state;
    console.log(this.state)
    this.unsubscribe = this.tbSM
      .where("Geo_map_type", "==", "resource")
      .where("Area_ID", "==", Area_ID)
      .where("Area_PID", "==", Area_PID)
      .where("Area_DID", "==", Area_DID)
      .where("Area_SDID", "==", Area_SDID)
      .onSnapshot(this.onCollectionUpdate);
  }
  componentWillUnmount() {
    this.unsubscribe = null;
  }
  onCollectionUpdate = querySnapshot => {

    const HS = [];
    const HSO = [];
    querySnapshot.forEach(doc => {
      const {
        Informer_name,
        Geo_Ban_name_ID,
        Status_hs,
        From,
        To,
        Geo_map_name,
        Map_image_URL,
        Geo_map_description
      } = doc.data();

      // var temp = parseInt();

      if (
        Status_hs !== "" ||
        Status_hs !== undefined ||
        From !== "" ||
        From !== undefined ||
        To !== "" ||
        To !== undefined
      ) {
        HSO.push({
          Key: doc.id,
          From,
          Geo_map_name,
          Geo_Ban_name_ID
        });
      }
      var tempIMG = "";
      if (
        Map_image_URL !== "" &&
        Map_image_URL !== null &&
        Map_image_URL !== undefined
      ) {
        tempIMG = (
          <img
            alt="imageURL"
            src={Map_image_URL}
            style={{ width: 50, height: 50 }}
          ></img>
        );
      }
      if (this.state.select_add === "") {
        HS.push({
          Key: doc.id,
          img: tempIMG,
          Geo_map_name,
          Geo_map_description,
          Informer_name,
          Status_hs,
          edit: (
            <div>
              <img
                alt="delete"
                style={{ widtha: 20, height: 20, cursor: "pointer" }}
                src={Idelete}
                onClick={this.deleteSM.bind(this, doc.id)}
              ></img>
            </div>
          )
        });
      } else {
        if (Status_hs === 0 || isEmptyValue(Status_hs)) {
          HS.push({
            img: tempIMG,
            Geo_map_name,
            Geo_map_description,
            Informer_name,
            Status_hs,
            edit: (
              <div>
                <img
                  alt="add"
                  style={{ widtha: 20, height: 20, cursor: "pointer" }}
                  onClick={this.saveHS.bind(this, doc.id)}
                  src={Icheckmark}
                ></img>

                <img
                  alt="delete"
                  style={{ widtha: 20, height: 20, cursor: "pointer" }}
                  src={Idelete}
                  onClick={this.deleteSM.bind(this, doc.id)}
                ></img>
              </div>
            )
          });
        }
      }
    });
    this.setState({
      HS,
      HSO
    });
    this.orgShow(HSO);
  };

  // HSO
  orgShow = org => {
    // console.log(org)
    const childrenOrg = [];

    org.forEach(element => {
      if (element.From === 0) {
        childrenOrg.push({
          children: [
            {
              name: (
                <div style={{ padding: 5 }}>
                  <h6>{element.Geo_map_name}</h6>
                  <Col>
                    <img
                      alt="add"
                      src={Iadd}
                      style={{ width: 30, height: 30, cursor: "pointer" }}
                      onClick={this.addOrg.bind(this, element.Key)}
                    ></img>
                    <img
                      alt="delete"
                      src={Idelete}
                      style={{ width: 30, height: 30, cursor: "pointer" }}
                      onClick={this.unsaveHS.bind(this, element.Key)}
                    ></img>
                  </Col>
                </div>
              ),
              children: this.orgloop(org, element.Key)
            }
          ]
        });
      }
    });

    this.setState({
      childrenOrg
    });
  };

  orgloop = (org, id) => {
    const c = [];
    try {
      org.forEach(element => {
        if (element.From === id) {
          c.push({
            name: (
              <div style={{ padding: 5 }}>
                <h6>{element.Geo_map_name}</h6>
                <Col>
                  <img
                    alt="add"
                    src={Iadd}
                    style={{ width: 30, height: 30, cursor: "pointer" }}
                    onClick={this.addOrg.bind(this, element.Key)}
                  ></img>
                  <img
                    alt="delete"
                    src={Idelete}
                    style={{ width: 30, height: 30, cursor: "pointer" }}
                    onClick={this.unsaveHS.bind(this, element.Key)}
                  ></img>
                </Col>
              </div>
            ),
            children: this.orgloop(org, element.Key)
          });
        }
      });
    } catch (e) {
      console.log("ยังไม่ได้เลือก");
    }
    return c;
  };

  addOrg = fromid => {
    if (this.state.select_add === "") {
      console.log(fromid);
      this.setState({
        select_add: fromid
      });
    } else {
      this.setState({
        select_add: ""
      });
    }

    this.tbSM
      .where("Geo_map_type", "==", "resource")
      .where("Area_ID", "==", this.state.Area_ID)
      .where("Area_PID", "==", this.state.Area_PID)
      .where("Area_DID", "==", this.state.Area_DID)
      .where("Area_SDID", "==", this.state.Area_SDID)
      .onSnapshot(this.onCollectionUpdate);
  };

  saveHS = id => {
    console.log(id);
    this.tbSM
      .doc(id)
      .update({
        From: this.state.select_add,
        Status_hs: 1
      })
      .then(doc => {
        this.setState({
          select_add: ""
        });
        this.tbSM
          .where("Geo_map_type", "==", "resource")
          .where("Area_ID", "==", this.state.Area_ID)
          .where("Area_PID", "==", this.state.Area_PID)
          .where("Area_DID", "==", this.state.Area_DID)
          .where("Area_SDID", "==", this.state.Area_SDID)
          .onSnapshot(this.onCollectionUpdate);
      })
      .catch(error => {
        console.log(error);
      });
  };
  unsaveHS = id => {
    this.updateChild(id);
  };
  checkBan_namesName(id) {
    var docref = Firebase.firestore()
      .collection("Ban_nameS")
      .doc(id);

    docref.get().then(doc => {
      const { Name } = doc.data();
      console.log(Name);
      this.setState({
        Ban_name: Name
      });
    });
  }

  deleteSM = id => {
    this.updateChild(id);
    Firebase.firestore()
      .collection("SOCIAL_MAPS")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          var desertRef = Firebase.storage().refFromURL(
            doc.data().Map_image_URL
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
  };
  updateChild = id => {
    this.tbSM
      .doc(id)
      .get()
      .then(doc => {
        this.state.HSO.forEach(element => {
          if (element.From === id) {
            this.updateChild(element.Key);
          }
        });
        this.tbSM.doc(id).update({
          From: "",
          Status_hs: 0
        });
      });
  };
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
      edit_ID,
      Name,
      User_ID
    } = this.state;

    this.tbSM
      .doc(edit_ID)
      .update({
        Informer_name: Name,
        HName,
        HLastname,
        HAddress,
        HAge,
        HCareer,
        Geo_map_description,
        Informer_ID: User_ID
      })
      .then(result => {
        this.setState({});
      })
      .catch(error => {
        console.log(error);
      });
  };
  onSubmitB = e => {
    e.preventDefault();
    const { Geo_map_name, User_ID, Name } = this.state;
    const { Area_ID, Area_SDID, Area_DID, Area_PID } = this.state;
    this.tbSM
      .add({
        Geo_map_name,
        Informer_ID: User_ID,
        Informer_name: Name,
        Geo_map_type: "resource",
        Area_ID, Area_SDID, Area_DID, Area_PID


      })
      .then(doc => {
        this.setState({
          addb: false,
          Geo_map_name: ""
        });
      });
  };
  render() {
    const { Ban_name, Geo_map_name } = this.state;

    const data = {
      columns: [
        {
          label: "#",
          field: "img",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "Geo_map_name",
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
      rows: this.state.HS
    };
    const style = {
      border: "solid 1px",
      display: "initial",
      padding: "5px"
    };
    //แผนผัง
    const initechOrg = {
      name: (
        <div style={style}>
          {this.state.Ban_name}
          <img
            alt="add"
            src={Iadd}
            style={{ width: 30, height: 30, cursor: "pointer" }}
            onClick={this.addOrg.bind(this, 0)}
          ></img>
        </div>
      ),
      actor: (
        <div>
          {this.state.nameOrg} : {this.state.Ban_name}
        </div>
      ),
      children: this.state.childrenOrg
    };

    const MyNodeComponent = ({ node }) => {
      return <div className="initechNode">{node.name}</div>;
    };
    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          <center>
            <h2>
              <strong>
                ระบบสุขภาพชุมชน : {Ban_name}หมู่ที่
                {this.state.Area_ID + 1}
              </strong>{" "}
            </h2>
            <hr></hr>
          </center>
          <Row>
            <Col sm={8}>
              <OrgChart tree={initechOrg} NodeComponent={MyNodeComponent} />
            </Col>
            <Col sm={4}>
              {this.state.addb ? (
                <form onSubmit={this.onSubmitB}>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3">
                      ชื่อทรัพยากร: <label style={{ color: "red" }}>*</label>
                    </Form.Label>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        name="Geo_map_name"
                        value={Geo_map_name}
                        onChange={this.onChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <button type="submit" className="btn btn-success">
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      this.setState({ addb: false, Geo_map_name: "" })
                    }
                  >
                    ยกเลิก
                  </button>
                </form>
              ) : (
                  <div>
                    <div style={{ display: "flex" }}>
                      <Link to={"/main_seven_tools"} className="btn btn-success">
                        เพิ่มข้อมูลทรัพยากร
                    </Link>
                      <button
                        className="btn btn-success"
                        onClick={() => this.setState({ addb: true })}
                      >
                        เพิ่มหมวดหมู่หรือข้อมูลอื่น
                    </button>
                      <Link to={"/main_seven_tools"} className="btn btn-danger">
                        กลับ
                    </Link>
                    </div>

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
                  </div>
                )}
            </Col>
          </Row>

          <hr></hr>
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

export default connect(mapStateToProps, mapDispatchToProps)(Health_systems);
