import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import "react-datepicker/dist/react-datepicker.css";
import { MdAccountBox, MdDeleteForever } from "react-icons/md";
import Firebase from "../../Firebase";
import Topnav from "../top/Topnav";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { confirmAlert } from "react-confirm-alert"; // Import
import "../../App.css";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue } from "../Methods";
import { Button, Modal } from "antd";


export class List_user extends Component {
  constructor(props) {
    super(props);
    this.tbUsers = Firebase.firestore().collection("USERS");
    this.state = {
      ...this.props.fetchReducer.user,
      List_users: [],
      SUser_type: "",
      visible: false,
      view_data: ''
    };
  }


  getUsers = querySnapshot => {
    const List_users = [];
    let count = 1;
    if (isEmptyValue(this.state.Role)) {
      querySnapshot.forEach(doc => {
        const {
          Name, Last_name, Nickname, Position, Department, Email,
          Province_ID, District_ID, Sub_district_ID, Avatar_URL, User_type
        } = doc.data();

        const Province = data_provinces[Province_ID][0];
        const District = data_provinces[Province_ID][1][District_ID][0];
        const Sub_district =
          data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
        List_users.push({
          number: count++,
          Avatar_URL: (
            <img
              style={{ widtha: 50, height: 50, cursor: "pointer" }}
              alt="avatar"
              src={Avatar_URL}
            ></img>
          ),
          Name: Name + " " + Last_name + "(" + Nickname + ")",
          User_type,
          work: Position + ":" + Department,
          District,
          Sub_district,
        });
      });
    } else if (this.state.Role === 'admin') {

      querySnapshot.forEach(doc => {
        const {
          Name, Last_name, Nickname, Position, Department, Email, Birthday,
          Province_ID, District_ID, Sub_district_ID, Avatar_URL, User_type
        } = doc.data();


        const Province = data_provinces[Province_ID][0];
        const District = data_provinces[Province_ID][1][District_ID][0];
        if (Birthday === undefined) {
          console.log(doc.data())
        }
        var d1 = new Date(Birthday.seconds * 1000);
        let bd =
          d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
        const Sub_district =
          data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
        if (doc.data().Province_ID === undefined) {
          console.log(doc.id)
        }
        List_users.push({
          // ...doc.data()
          number: count++,
          bd,
          Avatar_URL: (
            <img
              style={{ widtha: 50, height: 50, cursor: "pointer" }}
              alt="avatar"
              src={Avatar_URL}
            ></img>
          ),
          Name: Name + " " + Last_name + "(" + Nickname + ")",
          User_type,
          work: Position + ":" + Department,
          // District,
          // Sub_district,
          check: <p onClick={() => this.setState({ visible: true, view_data: { ...doc.data(), District, Province, Sub_district, bd } })} style={{ cursor: 'pointer' }}>ตรวจสอบ</p>,
          edit: (<div>
            <button><MdAccountBox size="30" color="#ef03dd" onClick={this.approveRole.bind(this, doc.id, Name)} /></button>
            <button><MdDeleteForever size="30" color="#ff0000" onClick={this.deleteuser.bind(this, doc.id, Name)} /></button>
          </div>)
        });
      });
    }


    this.setState({
      List_users
    });
  };
  approveRole = (id, name) => {
    confirmAlert({
      title: "การอนุญาติผู้ใช้",
      message: name + "(admin)",
      buttons: [

        {
          label: "อนุญาติ",
          onClick: () => {
            Firebase.firestore().collection("USERS").doc(id).update({
              Role: "admin"
            })
          }
        },
        {
          label: "ปฏิเสธ",
          onClick: () => {
            Firebase.firestore().collection("USERS").doc(id).update({
              Role: ""
            })
          },
        },
        {
          label: "ยกเลิก",
        }
      ]

    })
  }
  deleteuser = (id, name) => {
    confirmAlert({
      title: "ลบผู้ใช้",
      message: "คุณต้องการลบ" + name,
      buttons: [

        {
          label: "ยืนยัน",
          onClick: () => {
            const searchRef = Firebase.firestore().collection('USERS').doc(id);
            searchRef.get().then((doc) => {

              if (doc.exists && doc.data().Avatar_URL !== '') {
                var desertRef = Firebase.storage().refFromURL(doc.data().Avatar_URL);
                desertRef.delete().then(function () {
                  console.log("delete user and image sucess");
                }).catch(function (error) {
                  console.log("image No such document! " + doc.data().Name);
                });
              } else {
                console.log("user image  No such document! " + id);
              }
              Firebase.firestore().collection('USERS').doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
              }).catch((error) => {
                console.error("Error removing document: ", error);
              });




            });
          }
        },
        {
          label: "ยกเลิก",
        },

      ]

    })

  }
  selectDate = date => {
    this.setState({
      Birthday: date
    });
  };
  componentDidMount() {
    this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
  }
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);

    if (this.state.SUser_type === "") {
      this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
    } else {
      const ref = Firebase.firestore()
        .collection("USERS")
        .where("User_type", "==", this.state.SUser_type);
      this.unsubscribe = ref.onSnapshot(this.getUsers);
    }
  };
  render() {
    const { view_data } = this.state;
    const data = {
      columns: [
        {
          label: "#",
          field: "number",
          sort: "asc",
          width: 50
        },
        {
          label: "รูป",
          field: "Avatar_URL",
          sort: "asc",
          width: 50
        },
        {
          label: "ชื่อ",
          field: "Name",
          sort: "asc",
          width: 270
        },
        {
          label: "หน้าที่",
          field: "User_type",
          sort: "asc",
          width: 270
        },
        {
          label: "ตำแหน่ง : หน่วยงาน",
          field: "work",
          sort: "asc",
          width: 200
        },
        // {
        //   label: "อำเภอ",
        //   field: "District",
        //   sort: "asc",
        //   width: 150
        // },
        {
          label: "ตรวจสอบ",
          field: "check",
          sort: "asc",
          width: 60
        },
        {
          label: "แก้ไข",
          field: "edit",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.List_users
    };
    const { SUser_type, User_types } = this.state;
    return (
      <div>
        <Topnav></Topnav>
        <div className="main_component">
          {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> */}
          <center>
            <h5>ทำเนียบด้านเด็กและเยาวชน จังหวัดอุบลราชธานี</h5>
            <br></br>
            <select
              className="form-control"
              id="sel1"
              name="SUser_type"
              value={SUser_type}
              onChange={this.onChange}
              required
            >
              <option value="">ทั้งหมด</option>
              <option value="ผู้บริหาร">ผู้บริหาร</option>
              <option value="พี่เลี้ยง">พี่เลี้ยง</option>
              <option value="แกนนำเด็ก">แกนนำเด็ก</option>
              <option value="coach">coach</option>
            </select>
          </center>
          <Modal
            title={view_data.Name + " " + view_data.Last_name + "(" + view_data.Nickname + ")"}
            visible={this.state.visible}
            onOk={() => this.setState({ visible: false, view_data: '' })}
            onCancel={() => this.setState({ visible: false, view_data: '' })}
          >
            <img
              style={{ widtha: 50, height: 50, cursor: "pointer" }}
              alt="avatar"
              src={view_data.Avatar_URL}
            ></img>
            <p>ตำแหน่ง :{view_data.Position}  หน่วยงาน :{view_data.Department}</p>
            <p>ตำบล {view_data.Sub_district} อำเภอ {view_data.District} จังหวัด {view_data.Province}</p>
            {this.state.Role === 'admin' &&
              <>
                <p>Email :{view_data.Email} เบอร์โทร :{view_data.Number_phone}</p>
                <p>ประเภทผู้ใช้ :{view_data.User_type} วันเกิด :{view_data.bd}</p>
                <p>Facebok :{view_data.Facebook} Line ID :{view_data.Line_ID}</p>


              </>
            }
          </Modal>
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
          {/* </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(List_user);
