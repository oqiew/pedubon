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
import { tableName } from "../../database/TableConstant";
import Firebase from "../../Firebase";
import { alert_status, GetCurrentDate, isEmptyValue } from "../Methods";
import Topnav from "../top/Topnav";
import { confirmAlert } from "react-confirm-alert"; // Import
import { Button } from "react-bootstrap";
class Local_historys extends React.Component {
  constructor(props) {
    super(props);
    this.tbLocalHistory = Firebase.firestore().collection(tableName.Local_historys);
    this.tbBans = Firebase.firestore().collection(tableName.Bans)
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
      selected_ban: {
        Name: '',
        ID: ''
      },
      query_bans: [],
      bans: [],
      selected: 1,
      ...this.props.fetchReducer.user
    };
  }

  componentDidMount() {
    this.tbBans.where('Area_ID', '==', this.state.Area_ID).onSnapshot(this.onListBans)
  }
  onListBans = (query) => {
    const query_bans = [];
    query.forEach(doc => {
      query_bans.push({
        ID: doc.id,
        ...doc.data()
      })
    });
    this.setState({
      query_bans,
      bans: query_bans
    })
  }
  delete(id) {
    this.tbLocalHistory
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }
  edit(data, id) {
    const { Name_activity, Description, Year_start } = data;
    this.setState({
      Name_activity,
      Description,
      Year_start,
      edit_ID: id
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
  onBack = () => {
    this.setState({
      Name_activity: "",
      Description: "",
      Year_start: "",
      edit_ID: "",
      selected_ban: {
        Name: '',
        ID: ''
      },
      selected: 1,
    });
  }
  onSelectedBan(Name, ID) {
    this.tbLocalHistory
      .where('Ban_ID', '==', ID)
      .onSnapshot(this.onCollectionUpdate);
    this.setState({
      selected_ban: { Name, ID },
      selected: 2
    })
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
        Create_By
      } = doc.data();

      localHistorys.push({
        Name_activity,
        Description,
        Year_start,
        Create_By,
        edit: (
          <div>
            <img
              style={{ widtha: 20, height: 20, cursor: "pointer" }}
              alt="edit"
              src={Iedit}
              onClick={this.edit.bind(this, doc.data(), doc.id)}
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
      Name_activity, Description, Year_start, Area_ID, Name, uid, edit_ID, selected_ban
    } = this.state;
    if (!isEmptyValue(selected_ban.ID)) {
      if (Year_start.length < 4) {
        confirmAlert({
          title: "บันทึกข้อมูลไม่สำเร็จ",
          message: 'ข้อมูลปีไม่ถูกต้อง',
          buttons: [
            {
              label: "ตกลง"
            }
          ]
        });
      } else {
        if (edit_ID !== "") {
          this.tbLocalHistory
            .doc(edit_ID)
            .set({
              Name_activity, Description,
              Update_date: Firebase.firestore.Timestamp.now(),
              Year_start,
              Create_By_ID: uid,
              Create_By: Name,
              Ban_ID: selected_ban.ID
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
              Name_activity, Description,
              Update_date: Firebase.firestore.Timestamp.now(),
              Create_date: Firebase.firestore.Timestamp.now(),
              Year_start,
              Create_By_ID: uid,
              Create_By: Name,
              Ban_ID: selected_ban.ID
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
      }
    }


  };
  render() {
    const { Year_start, Name_activity, Description, selected, bans, selected_ban } = this.state;
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
          field: "Create_By",
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
        {selected === 1 ?
          <div className="main_component">
            <center>
              <>
                <h2>
                  <strong>
                    เลือกหมู่บ้าน
              </strong>{" "}
                </h2>
                <Link to={"/main_seven_tools"} className="btn btn-danger">
                  กลับ
              </Link>
                <hr></hr>
                <center>{bans.length === 0 && <h3>กรุณาติดต่อพี่เลี้ยงเพื่อเพิ่มข้อมูล</h3>}</center>
                {bans.map((element, i) =>
                  <div key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                    <h6>{element.Name}</h6>
                    <h6>อำเภอ{element.District_name}</h6>
                    <h6>จังหวัด{element.Province_name}</h6>
                    <Button variant="primary" onClick={this.onSelectedBan.bind(this, element.Name, element.ID)}>เลือก</Button>
                  </div>
                )}
              </>
            </center>
          </div>
          :
          <div className="main_component">
            <center>
              <h2>
                <strong>
                  ประวัติศาสตร์ชุมชน : {selected_ban.Name}
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

                <Button variant="danger" onClick={this.onBack.bind(this)}>กลับ</Button>
                <br></br>
              </form>
              <hr></hr>
            </center>
            <Timeline lineColor={"#ddd"}>{this.state.dataTimeline}</Timeline>
          </div>}
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
