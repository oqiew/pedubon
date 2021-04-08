import { Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import React from "react";
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react";

import Firebase from "../../Firebase";
import Topnav from "../top/Topnav";

import "../../App.css";

//img
import Idelete from "../../assets/trash_can.png";
import Iedit from "../../assets/pencil.png";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue, alert_status, GetCurrentDate } from "../Methods";
class Person_historys extends React.Component {
  constructor(props) {
    super(props);
    this.tbPersonHistorys = Firebase.firestore().collection("PERSON_HISTORYS");
    //getl);
    this.state = {
      dataTimeline: [],
      localHistorys: [],
      localHistorys2: [],

      listYear: [],
      //data
      Name_activity: "",
      Description: "",
      Year_start: "",

      //data
      status_add: false,
      edit_ID: "",
      person_name: "",
      //getuser
      ...this.props.fetchReducer.user
    };
  }

  componentDidMount() {
    this.unsubscribe = this.tbPersonHistorys
      .where("Person_ID", "==", this.props.match.params.id)
      .onSnapshot(this.onCollectionUpdate);
  }

  delete(id) {
    Firebase.firestore()
      .collection("PERSON_HISTORYS")
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
      .collection("PERSON_HISTORYS")
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
        id: count,
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
      localHistorys,
      localHistorys2: localHistorys
    });
    this.sortBy("Year_start");
    //sort show timeline
    var listYear = ["0"];
    count = 0;
    // console.log(this.state.localHistorys2);
    this.state.localHistorys2.forEach(element => {
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
    let arrayCopy = [...this.state.localHistorys2];
    arrayCopy.sort(this.compareBy(key));
    this.setState({ localHistorys2: arrayCopy });
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
      Name,
      uid,
      edit_ID
    } = this.state;
    if (edit_ID !== "") {
      this.tbPersonHistorys
        .doc(edit_ID)
        .update({
          Name_activity,
          Description,
          Year_start,
          Create_By_ID: uid,
          Informer_name: Name,
          Person_ID: this.props.match.params.id,
          Create_date: GetCurrentDate('/'),
        })
        .then(docRef => {
          alert_status("update");
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
      this.tbPersonHistorys
        .add({
          Name_activity,
          Description,
          Year_start,
          Create_By_ID: uid,
          Informer_name: Name,
          Person_ID: this.props.match.params.id,
          Create_date: GetCurrentDate('/'),
        })
        .then(docRef => {
          alert_status("add");
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
          label: "#",
          field: "id",
          sort: "asc"
        },
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
                ประวัติบุคคลที่น่าสนใจ : {this.props.match.params.Pname}
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
              <Link to={"/persons"} className="btn btn-danger">
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

export default connect(mapStateToProps, mapDispatchToProps)(Person_historys);
