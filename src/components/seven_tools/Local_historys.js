import { MDBDataTable } from "mdbreact";
import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react";
import { fetch_user } from "../../actions";
import "../../App.css";
import Iedit from "../../assets/pencil.png";
//img
import Idelete from "../../assets/trash_can.png";
import Firebase from "../../Firebase";
import { alert_status, GetCurrentDate } from "../Methods";
import Topnav from "../top/Topnav";
class Local_historys extends React.Component {
  constructor(props) {
    super(props);
    this.tbLocalHistory = Firebase.firestore().collection("LOCAL_HISTORYS");
    //getl);
    this.state = {
      dataTimeline: [],
      localHistorys: [],

      listYear: [],
      //data
      Name_activity: "",
      Description: "",
      Year_start: "",

      //data
      status_add: false,
      edit_ID: "",
      //getuser
      ...this.props.fetchReducer.user
    };
  }

  componentDidMount() {
    const { Area_ID, Area_SDID, Area_DID, Area_PID } = this.state;
    this.tbLocalHistory
      .where("Area_ID", "==", Area_ID)
      .where("Area_PID", "==", Area_PID)
      .where("Area_DID", "==", Area_DID)
      .where("Area_SDID", "==", Area_SDID)
      .onSnapshot(this.onCollectionUpdate);
  }

  delete(id) {
    Firebase.firestore()
      .collection("LOCAL_HISTORYS")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }
  edit(id) {
    Firebase.firestore()
      .collection("LOCAL_HISTORYS")
      .doc(id)
      .get()
      .then(doc => {
        const { Name_activity, Description, Year_start } = doc.data();
        this.setState({
          Name_activity,
          Description,
          Year_start,
          edit_ID: id
        });
      })
      .catch(error => {
        console.error("Error document: ", error);
      });
  }
  cancelEdit = e => {
    this.setState({
      Name_activity: "",
      Description: "",
      Year_start: "",
      edit_ID: ""
    });
  };
  onCollectionUpdate = querySnapshot => {
    const dataTimeline = [];
    const localHistorys = [];
    var count = 1;

    querySnapshot.forEach(doc => {
      const {
        Name_activity,
        Year_start,
        Description,
        Informer_name
      } = doc.data();

      localHistorys.push({
        Name_activity,
        Description,
        Year_start,
        Informer_name,
        edit: (
          <div>
            <img
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              alt="edit"
              src={Iedit}
              onClick={this.edit.bind(this, doc.id)}
            ></img>
            <img
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              alt="delete"
              src={Idelete}
              onClick={this.delete.bind(this, doc.id)}
            ></img>
          </div>
        )
      });

      count++;
    });

    this.setState({
      localHistorys
    });
    this.sortBy("Year_start");
    //sort show timeline
    var listYear = ["0"];
    count = 0;
    // console.log(this.state.localHistorys);
    this.state.localHistorys.forEach(element => {
      var temp = false;
      listYear.forEach(e => {
        if (e === element.Year_start) {
          temp = false;
        } else {
          listYear.push(element.Year_start);
          temp = true;
          return;
        }
      });

      if (temp) {
        dataTimeline.push(
          <TimelineItem
            key={count++}
            dateText={element.Year_start}
            style={{ color: "#e86971" }}
          >
            <h1>{element.Name_activity}</h1>
            <p>{element.Description}</p>
          </TimelineItem>
        );
      } else {
        dataTimeline.push(
          <TimelineItem key={count++} dateComponent={<div></div>}>
            <h1>{element.Name_activity}</h1>

            <p>{element.Description}</p>
          </TimelineItem>
        );
      }
    });

    this.setState({
      dataTimeline
    });
  };
  compareBy(key) {
    return function (a, b) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    };
  }

  sortBy(key) {
    let arrayCopy = [...this.state.localHistorys];
    arrayCopy.sort(this.compareBy(key));
    this.setState({ localHistorys: arrayCopy });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      Name_activity,
      Description,
      Year_start,
      Area_ID,
      Area_PID,
      Area_DID,
      Area_SDID,
      Name,
      User_ID,
      edit_ID
    } = this.state;
    if (edit_ID !== "") {
      this.tbLocalHistory
        .doc(edit_ID)
        .set({
          Name_activity,
          Description,
          Year_start,
          Informer_ID: User_ID,
          Informer_name: Name,
          Area_ID,
          Area_PID,
          Area_DID,
          Area_SDID,
          Create_date: GetCurrentDate('/'),
        })
        .then(docRef => {

          this.setState({
            Name_activity: "",
            Year_start: "",
            Description: "",
            edit_ID: ""
          });
        })
        .catch(error => {
          alert_status("noupdate");
          console.error("Error adding document: ", error);
        });
    } else {
      this.tbLocalHistory
        .add({
          Name_activity,
          Description,
          Year_start,
          Informer_ID: User_ID,
          Informer_name: Name,
          Area_ID,
          Area_PID,
          Area_DID,
          Area_SDID,
          Create_date: GetCurrentDate('/'),
        })
        .then(docRef => {
          this.setState({
            Name_activity: "",
            Year_start: "",
            Description: ""
          });

        })
        .catch(error => {
          alert_status("noadd");
          console.error("Error adding document: ", error);
        });
    }
  };
  render() {
    const { Year_start, Name_activity, Description } = this.state;
    const data = {
      columns: [
        {
          label: "ชื่อกิจกรรม",
          field: "Name_activity",
          sort: "asc"
        },
        {
          label: "ข้อมูลกิจกรรม",
          field: "Description",
          sort: "asc"
        },
        {
          label: "ปีที่เริ่ม",
          field: "Year_start",
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
      rows: this.state.localHistorys
    };
    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          <center>
            <h2>
              <strong>
                ประวัติศาสตร์ชุมชน : {this.state.Ban_name}หมู่ที่
                {this.state.Area_ID + 1}
              </strong>{" "}
            </h2>
            <hr></hr>

            <form onSubmit={this.onSubmit}>
              <Row>
                <Col>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3">
                      ชื่อกิจกรรม
                    </Form.Label>
                    <Col>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ชื่อหัวข้อ เหตุการณ์ หรือกิจกรรม"
                        name="Name_activity"
                        value={Name_activity}
                        onChange={this.onChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3">
                      ข้อมูลกิจกรรม
                    </Form.Label>
                    <Col>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder="คำอธิบาย เหตุการณ์ หรือกิจกรรมที่เกิดขึ้นกับชุมชน"
                          name="Description"
                          value={Description}
                          onChange={this.onChange}
                          cols="80"
                          rows="5"
                          required
                        >
                          {Description}
                        </textarea>
                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="3">
                      ปีที่เริ่ม
                    </Form.Label>
                    <Col>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ปีที่เริ่ม พ.ศ."
                        maxLength={4}
                        minLength={4}
                        name="Year_start"
                        value={Year_start}
                        onChange={this.onChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
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
                </Col>
              </Row>
              <button
                type="submit"
                className="btn btn-success"
                style={{ borderRadius: "4px" }}
              >
                บันทึกข้อมูล
              </button>
              {this.state.edit_ID !== "" ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.cancelEdit.bind(this)}
                  style={{ borderRadius: "4px" }}
                >
                  ยกเลิก
                </button>
              ) : (
                  ""
                )}

              <Link to={"/main_seven_tools"} className="btn btn-danger">
                กลับ
              </Link>
              <br></br>
            </form>

            <hr></hr>
          </center>
          <Timeline lineColor={"#ddd"}>{this.state.dataTimeline}</Timeline>
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

export default connect(mapStateToProps, mapDispatchToProps)(Local_historys);
