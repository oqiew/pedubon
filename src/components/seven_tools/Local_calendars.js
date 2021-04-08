import { Form, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";

import Firebase from "../../Firebase";
import Topnav from "../top/Topnav";

import "../../App.css";

//img
import Idelete from "../../assets/trash_can.png";
import Iedit from "../../assets/pencil.png";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue, GetCurrentDate } from "../Methods";
import { confirmAlert } from "react-confirm-alert"; // Import
import { tableName } from "../../database/TableConstant";
import { Button } from "react-bootstrap";

class Local_calendar extends React.Component {
  constructor(props) {
    super(props);

    this.tbLocalCalendars = Firebase.firestore().collection(tableName.Local_calendars);
    this.tbBans = Firebase.firestore().collection(tableName.Bans)
    //getl);
    this.state = {
      status_add: false,
      edit_ID: "",

      //data class
      dataCalendar1: [],
      dataCalendar2: [],
      Month1: "",
      Month2: "",
      mouth: [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค."
      ],
      showMouth1: [],
      showMouth2: [],
      Name_activity: "",
      selected_ban: {
        Name: '',
        ID: ''
      },
      query_bans: [],
      bans: [],
      selected: 1,
      //getuser
      ...this.props.fetchReducer.user
    };
  }

  componentDidMount() {
    this.genrateMonth(0, 0);
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
  onCollectionUpdate = querySnapshot => {
    const dataCalendar1 = [];
    const dataCalendar2 = [];
    var count = 1;
    dataCalendar1.push(
      <tr key={0} style={{ backgroundColor: "#e9a58a" }}>
        <td>
          <strong>#</strong>
        </td>
        <td>
          <strong>เศรษฐกิจ</strong>
        </td>
        <td colSpan={13}></td>
      </tr>
    );
    dataCalendar2.push(
      <tr key={0} style={{ backgroundColor: "#e9a58a" }}>
        <td>
          <strong>#</strong>
        </td>
        <td>
          <strong>วัฒนธรรมประเพณี</strong>
        </td>
        <td colSpan={13}></td>
      </tr>
    );
    querySnapshot.forEach(doc => {
      const { Name_activity, Month1, Month2, Type_activity } = doc.data();
      const mn1 = parseInt(Month1, 10);
      const mn2 = parseInt(Month2, 10);
      var temp = [];
      temp.push(<td key={0}>{count} </td>);
      temp.push(<td key={1}>{Name_activity}</td>);

      if (Type_activity === "เศรษฐกิจ") {
        for (let index = 1; index <= 12; index++) {
          if (index === mn1) {
            temp.push(
              <td
                key={index + 1}
                colSpan={mn2 - mn1 + 1}
                bgcolor="#8ef21b"
              ></td>
            );
            index = mn2;
          } else {
            temp.push(<td key={index + 1}></td>);
          }
        }

        temp.push(
          <td key={14}>
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
              onClick={this.delete.bind(this, doc.id)}
            ></img>
          </td>
        );

        dataCalendar1.push(<tr key={count}>{temp}</tr>);
      } else {
        for (let index = 1; index <= 12; index++) {
          if (index === mn1) {
            temp.push(
              <td
                key={index + 1}
                colSpan={mn2 - mn1 + 1}
                bgcolor="#0693e3"
              ></td>
            );
            index = mn2;
          } else {
            temp.push(<td key={index + 1}></td>);
          }
        }

        temp.push(
          <td key={14}>
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
          </td>
        );

        dataCalendar2.push(<tr key={count}>{temp}</tr>);
      }

      count++;
    });
    this.setState({
      dataCalendar1,
      dataCalendar2
    });
  };

  delete(id) {
    this.tbLocalCalendars
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
    const { mouth } = this.state;
    const showMouth2 = [];
    for (let index = data.Month1; index <= 12; index++) {
      showMouth2.push(
        <option key={index} value={index}>
          {mouth[index - 1]}
        </option>
      );
    }

    this.setState({
      Name_activity: data.Name_activity,
      Month1: data.Month1,
      Month2: data.Month2,
      Type_activity: data.Type_activity,
      edit_ID: id,
      showMouth2
    });

  }
  cancelEdit = e => {
    this.setState({
      Name_activity: "",
      Month1: "",
      Month2: "",
      Type_activity: "",
      edit_ID: "",
    });
  };
  onBack = () => {
    this.setState({
      Name_activity: "",
      Month1: "",
      Month2: "",
      Type_activity: "",
      edit_ID: "",
      selected_ban: {
        Name: '',
        ID: ''
      },
      selected: 1,
    });
  }

  onChange = (e, value) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);

    this.genrateMonth();
  };
  genrateMonth() {
    const showMouth1 = [],
      showMouth2 = [];
    const { mouth, Month1 } = this.state;
    const mn1 = parseInt(Month1, 10);

    for (let index = 1; index <= 12; index++) {
      showMouth1.push(
        <option key={index} value={index}>
          {mouth[index - 1]}
        </option>
      );
    }

    for (let index = mn1; index <= 12; index++) {
      showMouth2.push(
        <option key={index} value={index}>
          {mouth[index - 1]}
        </option>
      );
    }
    console.log(showMouth2, mn1);
    this.setState({
      showMouth1,
      showMouth2
    });
  }
  onSelectedBan(Name, ID) {
    this.tbLocalCalendars
      .where('Ban_ID', '==', ID)
      .onSnapshot(this.onCollectionUpdate);
    this.setState({
      selected_ban: { Name, ID },
      selected: 2
    })
  }
  onSubmit = e => {
    e.preventDefault();
    const {
      Name_activity, Month1, Month2, uid, Type_activity, Name, edit_ID,
      Area_ID, selected_ban
    } = this.state;

    if (!isEmptyValue(selected_ban.ID)) {
      if (edit_ID !== "") {
        this.tbLocalCalendars
          .doc(edit_ID)
          .set({
            Name_activity, Type_activity
            , Month1, Month2, Informer_ID: uid, Informer_name: Name
            , Ban_ID: this.state.selected_ban.ID,
            Update_date: Firebase.firestore.Timestamp.now()
          })
          .then(docRef => {
            this.setState({
              Name_activity: "",
              Month1: "",
              Month2: "",
              Type_activity: "",
              edit_ID: ""
            });
          })
          .catch(error => {
            confirmAlert({
              title: "บันทึกข้อมูลไม่สำเร็จ",
              buttons: [
                {
                  label: "ตกลง"
                }
              ]
            });
            console.error("Error adding document: ", error);
          });
      } else {
        this.tbLocalCalendars
          .add({
            Name_activity, Type_activity,
            Update_date: Firebase.firestore.Timestamp.now(),
            Create_date: Firebase.firestore.Timestamp.now()
            , Month1, Month2, Informer_ID: uid, Informer_name: Name
            , Area_ID, Ban_ID: this.state.selected_ban.ID,
          })
          .then(docRef => {

            this.setState({
              Name_activity: "",
              Month1: "",
              Month2: "",
              Type_activity: ""
            });
          })
          .catch(error => {
            confirmAlert({
              title: "เพิ่มข้อมูลไม่สำเร็จ",
              buttons: [
                {
                  label: "ตกลง"
                }
              ]
            });
            console.error("Error adding document: ", error);
          });
      }
    }

  };

  render() {
    const { Month1, Month2, Name_activity, Type_activity, selected, bans, selected_ban } = this.state;

    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          <center>
            {selected === 1 ?
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
                {bans.map((element, i) =>
                  <div key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                    <h6>{element.Name}</h6>
                    <h6>อำเภอ{element.District_name}</h6>
                    <h6>จังหวัด{element.Province_name}</h6>
                    <Button variant="primary" onClick={this.onSelectedBan.bind(this, element.Name, element.ID)}>เลือก</Button>
                  </div>
                )}
              </>
              :
              <>
                <h2>
                  <strong>
                    ปฏิทินชุมชน : {selected_ban.Name}
                  </strong>{" "}
                </h2>
                <hr></hr>
                <form onSubmit={this.onSubmit}>
                  <Form.Group as={Row}>
                    <Form.Label column sm="2">
                      ชื่อ
                </Form.Label>
                    <Col sm="4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ชื่อ กิจกรรม ประเพณี หรือสิ่งที่ทำ"
                        name="Name_activity"
                        value={Name_activity}
                        onChange={this.onChange}
                        required
                      />
                    </Col>
                    <Form.Label column sm="2">
                      กลุ่มกิจกรรม
                </Form.Label>
                    <Col sm="4">
                      <select
                        className="form-control"
                        name="Type_activity"
                        value={Type_activity}
                        onChange={this.onChange}
                        required
                      >
                        <option value=""></option>
                        <option value="วัฒนธรรมประเพณี">วัฒนธรรมประเพณี</option>
                        <option value="เศรษฐกิจ">เศรษฐกิจ</option>
                      </select>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column sm="2">
                      เดือนที่เริ่ม
                </Form.Label>
                    <Col sm="4">
                      <select
                        className="form-control"
                        name="Month1"
                        value={Month1}
                        onChange={this.onChange}
                        required
                      >
                        <option value=""></option>
                        {this.state.showMouth1}
                      </select>
                    </Col>
                    <Form.Label column sm="2">
                      เดือนที่สิ้นสุด
                </Form.Label>
                    <Col sm="4">
                      <select
                        className="form-control"
                        name="Month2"
                        value={Month2}
                        onChange={this.onChange}
                        required
                      >
                        <option value=""></option>
                        {this.state.showMouth2}
                      </select>
                    </Col>
                  </Form.Group>

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
                <Table bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>รายการ</th>
                      <th>ม.ค.</th>
                      <th>ก.พ.</th>
                      <th>มี.ค.</th>
                      <th>เม.ย.</th>
                      <th>พ.ค.</th>
                      <th>มิ.ย.</th>
                      <th>ก.ค.</th>
                      <th>ส.ค.</th>
                      <th>ก.ย.</th>
                      <th>ต.ค.</th>
                      <th>พ.ย.</th>
                      <th>ธ.ค.</th>
                      <th>แก้ไข</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataCalendar1}
                    {this.state.dataCalendar2}
                  </tbody>
                </Table>
              </>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(Local_calendar);
