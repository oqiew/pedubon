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
import { isEmptyValue } from "../Methods";
import { Modal } from "antd";
import { tableName } from "../../database/TableConstant";
import Loading from "../Loading";


export class List_user extends Component {
  constructor(props) {
    super(props);
    this.tbUsers = Firebase.firestore().collection(tableName.Users);
    this.tblog = Firebase.firestore().collection(tableName.log_history);
    this.state = {
      ...this.props.fetchReducer.user,
      list_user: [],
      loading: false,
      query_list_users: [],
      SUser_type: "",
      visible: false,
      view_data: {
        Area: {
          Dominance: '',
          Area_name: '',
          District_name: '',
          Province_name: ''
        }
      }
    };
  }

  setArea(Area_ID) {
    let result = '';
    const areas = this.props.fetchReducer.areas
    if (!isEmptyValue(areas)) {
      areas.forEach(element => {
        if (element.ID === Area_ID) {
          result = element;

        }
      });
    }

    return result
  }
  getUsers = (querySnapshot) => {
    const query_list_users = [];
    let count = 1;
    this.setState({
      loading: true
    })
    const users = querySnapshot.docs;
    for (const user of users) {
      if (isEmptyValue(this.state.Role)) {
        const {
          Name, Lastname, Nickname, Position,
          Avatar_URL, User_type, Area_ID
        } = user.data();
        let Area = '';
        try {
          Area = this.setArea(Area_ID);
        } catch (error) {
          console.log(error, Name, Area_ID)
        }

        query_list_users.push({
          number: count++,
          Avatar_URL: (
            <img
              style={{ widtha: 50, height: 50, cursor: "pointer" }}
              alt="avatar"
              src={Avatar_URL}
            ></img>
          ),
          Name: Name + " " + Lastname + "(" + Nickname + ")",
          User_type,
          Position: Position + " :: " + Area.Dominance + Area.Area_name,
        });

      } else if (this.state.Role === 'admin') {
        const {
          Name, Lastname, Nickname, Position, Birthday,
          Avatar_URL, User_type, Area_ID
        } = user.data();
        let Area = '';
        try {
          Area = this.setArea(Area_ID);
        } catch (error) {
          console.log(error, Name, Area_ID)
        }
        var d1 = new Date(Birthday.seconds * 1000);
        let bd =
          d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();

        query_list_users.push({
          // ...user.data()
          number: count++,
          bd,
          Avatar_URL: (
            <img
              style={{ widtha: 50, height: 50, cursor: "pointer" }}
              alt="avatar"
              src={Avatar_URL}
            ></img>
          ),
          Name: Name + " " + Lastname + "(" + Nickname + ")",
          User_type,
          Position: Position + " :: " + Area.Dominance + Area.Area_name,
          check: <p onClick={() => this.setState({ visible: true, view_data: { ...user.data(), bd, Area } })} style={{ cursor: 'pointer' }}>ตรวจสอบ</p>,
          edit: (<div>
            <button><MdAccountBox size="30" color="#ef03dd" onClick={this.approveRole.bind(this, user.id, Name)} /></button>
            <button><MdDeleteForever size="30" color="#ff0000" onClick={this.deleteuser.bind(this, user.id, Name)} /></button>
          </div>)
        });

      }
    }

    this.setState({
      query_list_users,
      list_user: query_list_users,
      loading: false
    });
  };
  onViewCancel() {
    this.setState({
      visible: false,
      view_data: {
        Area: {
          Dominance: '',
          Area_name: '',
          District_name: '',
          Province_name: ''
        }
      }
    })
  }
  approveRole = (id, name) => {
    confirmAlert({
      title: "การอนุญาติผู้ใช้",
      message: name + "(admin)",
      buttons: [
        {
          label: "อนุญาติ",
          onClick: () => {
            this.tbUsers.doc(id).update({
              Role: "admin"
            })
          }
        },
        {
          label: "ปฏิเสธ",
          onClick: () => {
            this.tbUsers.doc(id).update({
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
            const searchRef = this.tbUsers.doc(id);
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
              this.tbUsers.doc(id).delete().then(() => {
                console.log("Document successfully deleted!");
                this.tblog.add({
                  message: 'delete',
                  id
                })
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
    this.tbUsers.onSnapshot(this.getUsers);
  }
  changeUserType(name) {
    const { query_list_users } = this.state;
    const regex = new RegExp(`${name.trim()}`, 'i');
    const users = query_list_users.filter(name => name.User_type.search(regex) >= 0)
    this.setState({
      list_user: users
    })
  }
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.SUser_type === "") {
      this.setState({
        list_user: this.state.query_list_users
      })
    } else {
      this.changeUserType(e.target.value);
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
        // {
        //   label: "รูป",
        //   field: "Avatar_URL",
        //   sort: "asc",
        //   width: 50
        // },
        {
          label: "ชื่อ",
          field: "Name",
          sort: "asc",
          width: 270
        }, {
          label: "หน้าที่",
          field: "User_type",
          sort: "asc",
          width: 270
        }, {
          label: "ตำแหน่ง :: อปท",
          field: "Position",
          sort: "asc",
          width: 200
        }, {
          label: "ตรวจสอบ",
          field: "check",
          sort: "asc",
          width: 60
        }, {
          label: "แก้ไข",
          field: "edit",
          sort: "asc",
          width: 150
        }
      ],
      rows: this.state.list_user
    };
    const { SUser_type, loading } = this.state;
    if (loading) {
      return (<Loading></Loading>);
    } else {

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
              </select>
            </center>
            <Modal
              title={view_data.Name + " " + view_data.Lastname + "(" + view_data.Nickname + ")"}
              visible={this.state.visible}
              onOk={this.onViewCancel.bind(this)}
              onCancel={this.onViewCancel.bind(this)}
            >
              <img
                style={{ widtha: 100, height: 100, cursor: "pointer" }}
                alt="avatar"
                src={view_data.Avatar_URL}
              ></img>
              <p>ตำแหน่ง :{view_data.Position}  หน่วยงาน :{view_data.Area.Dominance + view_data.Area.Area_name}</p>
              <p>อำเภอ {view_data.Area.District_name} จังหวัด {view_data.Area.Province_name}</p>
              {this.state.Role === 'admin' &&
                <>
                  <p>Email :{view_data.Email} เบอร์โทร :{view_data.Phone_number}</p>
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
