import React, { Component } from "react";
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import data_provinces from "../../data/provinces.json";
import { isEmptyValue, GetCurrentDate } from "../Methods";
import Topnav from "../top/Topnav";
import { Form, Row, Col } from "react-bootstrap";
import Firebase from '../../Firebase';
import { MDBDataTable } from "mdbreact";
import ImageMapper from 'react-image-mapper';
import { Link } from "react-router-dom";
import XLSX from 'xlsx';
import { make_cols } from '../excel/MakeColumns';
import SheetJSFT from '../excel/Excel_type';
import { Modal, Button } from 'antd';
import { database } from "firebase";
import { tableName } from "../../database/TableConstant";
// ทำเพิ่มหมู่บ้าน เข้ากับ อปท
import LinearProgress from '@material-ui/core/LinearProgress';
import CanvasJSReact from '../../canvasjs.react';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
import { makeStyles, withStyles } from '@material-ui/core/styles';
// map
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import accident from '../../assets/accident.png';
import flag_danger from '../../assets/flag_danger.png';
import flag_good from '../../assets/flag_good.png';
import home from '../../assets/home.png';
import organization from '../../assets/organization.png';
import resource from '../../assets/resource.png';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const ColorNo1 = '#f19867';
const ColorNo2 = '#3e9eff';
const ColorNo3 = '#6ad500';
const BorderLinearProgress1 = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: ColorNo1,
  },
}))(LinearProgress);
const BorderLinearProgress2 = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: ColorNo2,
  },
}))(LinearProgress);
const BorderLinearProgress3 = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: ColorNo3,
  },
}))(LinearProgress);
export class Area extends Component {
  constructor(props) {
    super(props);
    this.tbAreas = Firebase.firestore().collection(tableName.Areas);
    this.tbJourney = Firebase.firestore().collection(tableName.Journey);
    this.tbSocialMaps = Firebase.firestore().collection(tableName.Social_maps);
    this.state = {
      ...this.props.fetchReducer.user,
      // journey
      c1: [],
      c2: [],
      c3: [],
      q1: ["ท่านมีส่วนร่วมกับกิจกรรมต่าง ๆที่ชุมชนจัดขึ้นมากน้อยเพียงใด", "ท่านมีความรู้เกี่ยวกับบริบทต่าง ๆของชุมชน เช่น โครงสร้าง ต้นทุนทางสังคมและวัฒนธรรม สภาพแวดล้อม สุขภาวะของคนและชุมชนมากน้อยเพียงใด"],
      q2: ["ท่านสามารถหาวิธีแก้ไขปัญหาหรือส่งเสริมเสริมปัญญาจากต้นทุนของชุมชนซึ่งมีแนวโน้มที่จะสร้างให้เกิดการเปลี่ยนแปลงในชุมชนได้มากน้อยเพียงใด",
        "ท่านสามารถค้นหาวิธีการแก้ไขปัญหาหรือส่งเสริมปัญญาจากต้นทุนของชุมชนได้อย่างรวดเร็วภายใต้เงื่อนไขของเวลาในการพัฒนาข้อเสนอโครงการ มากน้อยเพียงใด",
        "ท่านสามารถค้นหาวิธีการแก้ไขปัญหาหรือส่งเสริมปัญญาจากต้นทุนของชุมชนได้อย่างหลาหลายภายใต้เงื่อนไขของเวลาในการพัฒนาข้อเสนอโครงการ มากน้อยเพียงใด",
        "ท่านสามารถแจกแจงรายละเอียดในการดำเนินงานในโครงการได้ มากน้อยเพียงใด"],
      q3: ["ท่านมีความรู้ความเข้าใจในบริบทแวดล้อมของชุมชน เช่น โครงสร้าง ต้นทุนทางสังคมและวัฒนธรรม สภาพแวดล้อม สุขภาวะของคนและชุมชน ที่มีความแตกต่างหลากหลายพร้อมทำงานร่วมกับผู้อื่น",
        "ท่านสามารถมองเห็นปัญหาและปัญญาจากต้นทุนของชุมชนและนำปัญหาหรือปัญญานั้นมาพัฒนาเป็นแนวคิดหรือวิธีการใหม่ๆ",
        "ท่านมีความรับผิดชอบต่อส่วนรวมมากน้อยเพียงใด",
        "ท่านมีการพัฒนาตัวเองและผู้อื่นอย่างสม่ำเสมอ"],
      C11: [],
      C12: [],
      C13: [],
      C21: [],
      C22: [],
      C23: [],
      C31: [],
      C32: [],
      C33: [],
      num1: 0,
      num2: 0,
      num3: 0,
      detail: false,

      addAllcomponent: '',
      list_area: [],
      add_status: false,
      Provinces: [],
      Districts: [],
      SubDistricts: [],
      // data Area
      Area_name: '',
      AProvince_ID: 0,
      ADistrict_ID: '',
      ASubDistrict_ID: '',
      Dominance: '',
      Area_type: '',
      LGO_ID: '',
      Activity: '',
      Projects: [],
      file: [],
      iarea: [],

      // model add ban
      visible: false,
      selectLocalData: {},
      list_bans: '',
      bans: [false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false,],
      area_detail: {
        area_name: '',
        arae_number1: 0,
        arae_number2: 0,
        arae_number3: 0,
        child_number: 0,
        population: 0
      },
      // map
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      position: { lat: 15.229399, lng: 104.857126 },
      zoomMap: 12,
      listshowMarker: [],
      sall: true,
      shome: false,
      sresource: false,
      sorganization: false,
      sflag_good: false,
      sflag_danger: false,
      saccident: false,
      shome_num: 0,
      sresource_num: 0,
      sorganization_num: 0,
      sflag_good_num: 0,
      sflag_danger_num: 0,
      saccident_num: 0,
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
  }
  getJourney = (querySnapshot) => {
    let C11 = [0, 0];
    let C12 = [0, 0, 0, 0];
    let C13 = [0, 0, 0, 0];
    let C21 = [0, 0];
    let C22 = [0, 0, 0, 0];
    let C23 = [0, 0, 0, 0];
    let C31 = [0, 0];
    let C32 = [0, 0, 0, 0];
    let C33 = [0, 0, 0, 0];
    let num1 = 0;
    let num2 = 0;
    let num3 = 0;
    querySnapshot.forEach((doc) => {
      const { C1, C2, C3, Time } = doc.data();
      if (Time === 'ก่อนเข้าร่วมกิจกรรม') {
        if (!isEmptyValue(C1)) {
          C11[0] += parseInt(C1[0], 10);
          C11[1] += parseInt(C1[1], 10);
        }
        if (!isEmptyValue(C2)) {
          C12[0] += parseInt(C2[0], 10);
          C12[1] += parseInt(C2[1], 10);
          C12[2] += parseInt(C2[2], 10);
          C12[3] += parseInt(C2[3], 10);
        }
        if (!isEmptyValue(C3)) {
          C13[0] += parseInt(C3[0], 10);
          C13[1] += parseInt(C3[1], 10);
          C13[2] += parseInt(C3[2], 10);
          C13[3] += parseInt(C3[3], 10);
        }
        num1++;

      } else if (Time === 'ระหว่างร่วมกิจกรรม') {
        if (!isEmptyValue(C1)) {
          C21[0] += parseInt(C1[0], 10);
          C21[1] += parseInt(C1[1], 10);
        }
        if (!isEmptyValue(C2)) {
          C22[0] += parseInt(C2[0], 10);
          C22[1] += parseInt(C2[1], 10);
          C22[2] += parseInt(C2[2], 10);
          C22[3] += parseInt(C2[3], 10);
        }
        if (!isEmptyValue(C3)) {
          C23[0] += parseInt(C3[0], 10);
          C23[1] += parseInt(C3[1], 10);
          C23[2] += parseInt(C3[2], 10);
          C23[3] += parseInt(C3[3], 10);
        }
        num2++;
      } else if (Time === 'หลังร่วมกิจกรรม') {
        if (!isEmptyValue(C1)) {
          C31[0] += parseInt(C1[0], 10);
          C31[1] += parseInt(C1[1], 10);
        }
        if (!isEmptyValue(C2)) {
          C32[0] += parseInt(C2[0], 10);
          C32[1] += parseInt(C2[1], 10);
          C32[2] += parseInt(C2[2], 10);
          C32[3] += parseInt(C2[3], 10);
        }
        if (!isEmptyValue(C3)) {
          C33[0] += parseInt(C3[0], 10);
          C33[1] += parseInt(C3[1], 10);
          C33[2] += parseInt(C3[2], 10);
          C33[3] += parseInt(C3[3], 10);
        }
        num3++;
      }
    })

    this.setState({
      C11, C12, C13, C21, C22, C23, C31, C32, C33, num1, num2, num3
    })
  }
  componentDidMount() {
    Firebase.firestore().collection('PROJECTS').onSnapshot(this.list_project);
    this.tbSocialMaps.onSnapshot(this.ListMark);
    this.tbJourney.onSnapshot(this.getJourney);
    this.tbAreas.onSnapshot(this.getModuleC);
    this.listProvinces();
    this.listDistrict(0)
  }
  listProvinces = () => {
    const Provinces = [];
    data_provinces.forEach((doc, i) => {
      // console.log(doc)
      Provinces.push({
        Key: i,
        value: doc[0]
      })
    })
    this.setState({
      Provinces
    })
  }
  listDistrict = (pid) => {
    const Districts = [];

    data_provinces[pid][1].forEach((doc, i) => {
      //  console.log(doc)
      Districts.push({
        Key: i,
        value: doc[0]
      })
    })
    if (this.state.Name !== '') {
      this.setState({
        Districts,

      })
    } else {
      this.setState({
        Districts,
        ADistrict_ID: '',
      })
    }

  }
  listSubDistrict = (pid, did) => {
    const SubDistricts = [];

    data_provinces[pid][1][did][2][0].forEach((doc, i) => {
      SubDistricts.push({
        Key: i,
        value: doc[0]
      });
    });
    if (this.state.uid !== "") {
      this.setState({
        SubDistricts
      });
    } else {
      this.setState({
        SubDistricts,
        Area_SDID: ""
      });
    }
  };
  onSelectProvince = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.AProvince_ID === '') {
      this.setState({
        Districts: [],
        ADistrict_ID: '',
      })
    } else {
      this.listDistrict(this.state.AProvince_ID);
    }
  }
  onSelectDistrict = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    if (this.state.ADistrict_ID === "") {
      this.setState({
        SubDistricts: [],
        ASubDistrict_ID: "",
      });
    } else {
      this.listSubDistrict(this.state.AProvince_ID, this.state.ADistrict_ID);
    }
  };
  edit(data, id) {
    this.listDistrict(data.AProvince_ID);
    this.listSubDistrict(data.AProvince_ID, data.ADistrict_ID);
    this.setState({ ...data, LGO_ID: id })
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }
  handleCancel = e => {
    this.setState({
      visible: false,
      addAllcomponent: '',
      selectLocalData: {},
      list_bans: '',
      bans: [false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false,],
    });
  };
  handleOk = e => {
    var temp_bans = [];
    //ข้อมูลพื้นที่ ที่กดเปิด
    const { selectLocalData } = this.state;
    if (selectLocalData.ID !== undefined || selectLocalData.ID !== '') {
      Firebase.firestore().collection('AREAS').doc(selectLocalData.ID).update({
        bans: this.state.bans
      }).then((r) => {
        this.setState({
          visible: false,
          addAllcomponent: '',
          selectLocalData: {},
          list_bans: '',
          bans: [false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false,],
        });
        console.log("update ban sucess");
      }).catch((error) => {
        console.log("error update ban");
      })
    }

  };

  Tempbans = (index) => {
    var tempstate = this.state.bans;
    tempstate[index] = !tempstate[index];

    this.setState({
      bans: tempstate,
      list_bans: <>
        {data_provinces[this.state.selectLocalData.AProvince_ID][1][this.state.selectLocalData.ADistrict_ID][2][0][this.state.selectLocalData.ASubDistrict_ID][1][0].map((element, i) =>
          <Row>
            <Col>หมู่ที่ {element[2]}</Col>
            <Col><h6 key={i} value={i}>{element[1]}</h6></Col>
            <Col>
              <Button onClick={this.Tempbans.bind(this, i)} style={tempstate[i] ? { color: 'red' } : { color: 'green' }}>{(tempstate[i]) ? "ลบ" : "เพิ่ม"}</Button>
            </Col>
          </Row>

        )}
      </>
    })
    console.log(this.state.bans)
  }
  addBansAll(size) {
    console.log(size)
    var tempstate = this.state.bans;
    for (let index = 0; index < size; index++) {
      tempstate[index] = true;

    }
    console.log(tempstate)
    this.setState({
      bans: tempstate,
      list_bans: <>
        {data_provinces[this.state.selectLocalData.AProvince_ID][1][this.state.selectLocalData.ADistrict_ID][2][0][this.state.selectLocalData.ASubDistrict_ID][1][0].map((element, i) =>
          <Row>
            <Col>หมู่ที่ {element[2]}</Col>
            <Col><h6 key={i} value={i}>{element[1]}</h6></Col>
            <Col>
              <Button onClick={this.Tempbans.bind(this, i)} style={tempstate[i] ? { color: 'red' } : { color: 'green' }}>{(tempstate[i]) ? "ลบ" : "เพิ่ม"}</Button>
            </Col>
          </Row>

        )}
      </>
    })
  }
  handleOpen = (data) => {
    // console.log(data_provinces[data.AProvince_ID][1][data.ADistrict_ID][2][0][data.ASubDistrict_ID][1][0])
    // console.log(data_provinces[data.AProvince_ID][1][data.ADistrict_ID][2][0], data.ASubDistrict_ID)
    if (data.ASubDistrict_ID !== "" && data.ASubDistrict_ID !== undefined) {
      var tb = this.state.bans;

      if (data.bans !== "" && data.bans !== undefined) {

        tb = data.bans;

      }

      this.setState({
        visible: true,
        selectLocalData: data,
        bans: tb,
        addAllcomponent: <Button onClick={this.addBansAll.bind(this, data_provinces[data.AProvince_ID][1][data.ADistrict_ID][2][0][data.ASubDistrict_ID][1][0].length)}>เพิ่มทั้งหมด</Button>,
        list_bans: <>
          {data_provinces[data.AProvince_ID][1][data.ADistrict_ID][2][0][data.ASubDistrict_ID][1][0].map((element, i) =>
            <Row>
              <Col>หมู่ที่ {element[2]}</Col>
              <Col><h6 key={i} value={i}>{element[1]}</h6></Col>
              <Col>

                <Button onClick={this.Tempbans.bind(this, i)} style={tb[i] ? { color: 'red' } : { color: 'green' }}>{tb[i] ? "ลบ" : "เพิ่ม"}</Button>
              </Col>
            </Row>

          )}
        </>
      })
    }
  };

  getModuleC = async querySnapshot => {
    const c1 = [];
    const c2 = [];
    const c3 = [];
    const list_area = [];//ตาราวข้อมูลทั้งหมด
    try {
      for (const doc of querySnapshot.docs) {
        // const Province = data_provinces[doc.data().AProvince_ID][0];
        // const District = data_provinces[doc.data().AProvince_ID][1][doc.data().ADistrict_ID][0];
        var stb = 0;
        if (doc.data().bans !== undefined) {
          doc.data().bans.forEach((d) => {
            if (d) {
              stb++;
            }
          })
        }

        // list_area.push({
        //   ID: doc.id,
        //   Province,
        //   District,
        //   ...doc.data(),
        //   nban: stb,
        //   edit: (
        //     <div>
        //       <button
        //         className="btn btn-pimary"
        //         onClick={this.handleOpen.bind(this, { ID: doc.id, Province, District, ...doc.data() })}
        //       >
        //         เปิด
        //     </button>
        //       <button
        //         className="btn btn-success"
        //         onClick={this.edit.bind(this, doc.data(), doc.id)}
        //       >
        //         แก้ไข
        //     </button>
        //       <button
        //         className="btn btn-danger"
        //         onClick={this.delete_area.bind(this, doc.id)}
        //       >
        //         ลบ
        //     </button>
        //     </div>

        //   )
        // })
        if (doc.data().Area_type === 'พื้นที่พัฒนา') {

          c1.push({
            ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data()
            , Project_name: this.get_project(doc.id),
            edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),

          });
        } else if (doc.data().Area_type === 'พื้นที่นำร่อง') {
          c2.push({
            ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data(), Project_name: this.get_project(doc.id),
            edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),
          });
        } else if (doc.data().Area_type === 'พื้นที่ต้นแบบ') {
          c3.push({
            ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data(), Project_name: this.get_project(doc.id),
            edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            // course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
            edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),
          });
        }
      }
    } catch (error) {
      console.log('error', error)
    }

    this.setState({
      c1, c2, c3, list_area
    })
  }
  list_project = querySnapshot => {
    const Projects = [];
    querySnapshot.forEach(doc => {
      Projects.push({ ...doc.data(), ID: doc.id })
    })
    this.setState({
      Projects
    })
  }
  get_project(id) {
    var data = '';
    this.state.Projects.forEach(element => {

      if (element.Area_local_ID === id) {
        data += element.Project_name + '\n';
      }
    });
    return data;
  }
  // import filter: 

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.setState({ file: files[0] });
  };
  // check_DID = (name) => {
  //   for (let index = 0; index < this.state.Districts.length; index++) {

  //     if (name === this.state.Districts[index].value) {
  //       return index;
  //     }

  //   }
  //   return null;
  // }

  delete_area(id) {
    Firebase.firestore().collection('AREAS').doc(id).delete().
      then(function () {
        console.log("delete file sucess");
      }).catch(function (error) {
        console.log("file No such document!");
      });
  }
  // handleFile() {
  //   /* Boilerplate to set up FileReader */
  //   // firebase.auth().onAuthStateChanged((user) => {
  //   //      console.log(user)
  //   // })
  //   const reader = new FileReader();
  //   const rABS = !!reader.readAsBinaryString;

  //   reader.onload = (e) => {
  //     /* Parse data */
  //     const bstr = e.target.result;
  //     const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
  //     /* Get first worksheet */
  //     const wsname = wb.SheetNames[0];
  //     const ws = wb.Sheets[wsname];
  //     /* Convert array of arrays */
  //     const data = XLSX.utils.sheet_to_json(ws);
  //     /* Update state */
  //     this.setState({ data: data, cols: make_cols(ws['!ref']) });
  //     let iarea = [];

  //     if (this.state.Tb_name !== '') {

  //       // const tb = Firebase.firestore().collection(this.state.Tb_name);

  //       const { Name, uid, } = this.state;
  //       this.state.data.forEach((element, i) => {
  //         var temp_DID = this.check_DID(element.District_name)
  //         // console.log(element.ID)
  //         if (temp_DID === null) {
  //           console.log(element.District_name)
  //         }


  //         iarea.push({
  //           ID: element.ID,
  //           AProvince_ID: element.AProvince_ID,
  //           ADistrict_ID: temp_DID,
  //           Dominance: element.Dominance,
  //           Area_name: element.Area_name,
  //           Zip_code: element.Zip_code,
  //           Informer_name: Name,
  //           Create_By_ID: uid,
  //         })
  //       });
  //     }
  //     this.setState({
  //       iarea,
  //     })


  //   };

  //   if (rABS) {
  //     reader.readAsBinaryString(this.state.file);
  //   } else {
  //     reader.readAsArrayBuffer(this.state.file);
  //   };
  // }
  //end  imnport file
  areaClicked(area) {
    let area_name = "";
    let arae_number1 = 0;
    let arae_number2 = 0;
    let arae_number3 = 0;
    let child_number = 0;
    let population = 0;
    const { c1, c2, c3 } = this.state;
    for (let index = 0; index < 20; index++) {
      if (index < 15) {
        if (c1[index].District_name === area.name) {
          arae_number1++;
        }
        if (c2[index].District_name === area.name) {
          arae_number2++;
        }
        if (c3[index].District_name === area.name) {
          arae_number3++;
        }
      } else {
        if (c1[index].District_name === area.name) {
          arae_number1++;
        }
      }
    }
    this.setState({
      area_detail:
      {
        area_name: area.name,
        arae_number1,
        arae_number2,
        arae_number3,
        child_number,
        population,
      }
    })
    // this.setState({
    // 	msg: `You clicked on ${area.shape} at coords ${JSON.stringify(
    // 		area.coords
    // 	)} !`
    // });
  }
  enterArea(area) {
    // console.log(area);
    // this.setState({
    // 	hoveredArea: area,
    // 	msg: `You entered ${area.shape} ${area.name} at coords ${JSON.stringify(
    // 		area.coords
    // 	)} !`
    // });
  }
  clickedOutside(evt) {
    const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
    // console.log(evt)

    // this.setState({
    // 	msg: `You clicked on the image at coords ${JSON.stringify(coords)} !`
    // });
  }
  moveOnArea(area, evt) {
    const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
    console.log(area)
    // this.setState({
    // 	moveMsg: `You moved on ${area.shape} ${
    // 		area.name
    // 	} at coords ${JSON.stringify(coords)} !`
    // });
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { AProvince_ID, ADistrict_ID, ASubDistrict_ID, Dominance, Area_type, Name, uid, LGO_ID, Area_name, } = this.state;
    Firebase.firestore().collection('AREAS').doc(LGO_ID).set({
      AProvince_ID, ADistrict_ID, Dominance, Area_type, Create_date: GetCurrentDate("/"), ASubDistrict_ID,
      Informer_name: Name, Create_By_ID: uid, Area_name, Address: '', Zip_code: ''
    }).then((doc) => {
      console.log('insert success');
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  update_data() {
    this.state.iarea.forEach((element) => {
      Firebase.firestore().collection('AREAS').doc(element.ID + "").set({
        AProvince_ID: element.AProvince_ID,
        ADistrict_ID: element.ADistrict_ID,
        Dominance: element.Dominance,
        Create_date: GetCurrentDate("/"),
        Informer_name: element.Informer_name,
        Create_By_ID: element.Create_By_ID,
        Area_name: element.Area_name,
        Zip_code: element.Zip_code,
        Address: '',
        Area_type: '',
      }).then((doc) => {
        console.log("set document: success");
      }).catch((error) => {
        console.error("Error set document: ", error, element.ID);
      });
    })

  }
  // map
  onFocusMarker(lat, lng) {
    setTimeout(() => {
      this.setState({
        position: { lat, lng },
        zoomMap: 18
      });

    }, 100);
  }
  onMarkMap(lat, lng) {
    this.setState({
      position: {
        lat: lat,
        lng: lng
      }
    });
  }
  //  map
  ListMark = (querySnapshot) => {
    const geoMaps = [];
    const listshowMarker = [];
    let shome_num = 0;
    let sresource_num = 0;
    let sorganization_num = 0;
    let sflag_good_num = 0;
    let sflag_danger_num = 0;
    let saccident_num = 0;
    let count = 0;
    if (querySnapshot.size !== 0) {
      const { Geo_map_position } = querySnapshot.docs[0].data();
      this.setState({
        position: Geo_map_position,
        area_position: Geo_map_position
      })
    }
    querySnapshot.forEach((doc) => {
      const { Geo_map_position, Map_image_URL, Geo_map_name, Geo_map_type, Geo_map_description, Informer_name, } = doc.data();
      var icon_m = '';
      var name_type = '';
      // "home"=บ้าน
      // "resource"=แหล่งทรัพยากร
      // "organization"=องค์กร
      // "flag_good"=จุดดี
      // "flag_danger"=จุดเสี่ยง
      // "accident"=จุดอุบัติเหตุ
      if (Geo_map_type === 'home') {
        icon_m = home; name_type = 'บ้าน';
        shome_num++;
      } else if (Geo_map_type === 'resource') {
        icon_m = resource; name_type = 'แหล่งทรัพยากร';
        sresource_num++;
      } else if (Geo_map_type === 'organization') {
        icon_m = organization; name_type = 'องค์กร';
        sorganization_num++;
      } else if (Geo_map_type === 'flag_good') {
        icon_m = flag_good; name_type = 'จุดดี';
        sflag_good_num++;
      } else if (Geo_map_type === 'flag_danger') {
        icon_m = flag_danger; name_type = 'จุดเสี่ยง';
        sflag_danger_num++;
      } else if (Geo_map_type === 'accident') {
        icon_m = accident; name_type = 'จุดอุบัติเหตุ';
        saccident_num++;
      }
      if (!isEmptyValue(Geo_map_position)) {
        listshowMarker.push(
          <Marker key={count}
            onClick={this.onMarkerClick}
            name={Geo_map_name + ""}
            position={Geo_map_position}
            description={Geo_map_description}
            image={Map_image_URL}
            icon={icon_m}
          // animation={this.props.google.maps.Animation.DROP}
          // label={count}
          />
        );
      }
      count++;
    })

    this.setState({
      listshowMarker,
      shome_num,
      sresource_num,
      sorganization_num,
      sflag_good_num,
      sflag_danger_num,
      saccident_num,
    });
  }
  onMarkerClick(props, marker) {

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  }

  onMapClicked(t, map, coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
    setTimeout(() => {
      this.setState({
        position: { lat, lng }
      });
    }, 100);
  }
  render() {
    const { c1, c2, c3, Role, selectLocalData } = this.state;
    const { AProvince_ID, ADistrict_ID, ASubDistrict_ID, Provinces, Districts, SubDistricts,
      Dominance, Area_type, Area_name, LGO_ID } = this.state;
    // map
    const { shome_num,
      sresource_num,
      sorganization_num,
      sflag_good_num,
      sflag_danger_num,
      saccident_num, } = this.state;
    // area
    const { area_detail } = this.state;
    // power
    const { C11, C12, C13, C21, C22, C23, C31, C32, C33, num1, num2, num3 } = this.state;
    let ShowC110 = 0;
    let ShowC111 = 0;
    let ShowC120 = 0;
    let ShowC121 = 0;
    let ShowC130 = 0;
    let ShowC131 = 0;
    if (!isEmptyValue(C11)) {
      ShowC110 = ((C11[0] / num1) * 100) / 5;
      ShowC111 = ((C11[1] / num1) * 100) / 5;
    }
    if (!isEmptyValue(C21)) {
      ShowC120 = ((C21[0] / num1) * 100) / 5;
      ShowC121 = ((C21[1] / num1) * 100) / 5;
    }
    if (!isEmptyValue(C31)) {
      ShowC130 = ((C31[0] / num3) * 100) / 5;
      ShowC131 = ((C31[1] / num3) * 100) / 5;
    }
    const card_style = {
      backgroundColor: '#91c8c8',
      borderRadius: 10,
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      transition: "0.3s",
      padding: 30

    }
    const data = {
      columns: [
        {
          label: "ID",
          field: "ID",
          sort: "asc"
        },
        {
          label: "จังหวัด",
          field: "Province",
          sort: "asc"
        },
        {
          label: "อำเภอ",
          field: "District",
          sort: "asc"
        },
        {
          label: "การปกครอง",
          field: "Dominance",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "Area_name",
          sort: "asc"
        },
        {
          label: "ประเภทพื้นที่",
          field: "Area_type",
          sort: "asc"
        },
        {
          label: "หมู่บ้าน",
          field: "nban",
          sort: "asc"
        },
        {
          label: "แก้ไข",
          field: "edit",
          sort: "asc"
        }
      ],
      rows: this.state.list_area
    };
    const datac1 = {
      columns: [
        {
          label: "ID",
          field: "ID",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "Name",
          sort: "asc"
        },
        {
          label: "ชื่อโครงกร",
          field: "Project_name",
          sort: "asc"
        },
        {
          label: "โครงการ",
          field: "edit",
          sort: "asc"
        },

        // {
        //   label: "กิจกรรม",
        //   field: "edit2",
        //   sort: "asc"
        // },
        // {
        //   label: "หลักสูตร",
        //   field: "course",
        //   sort: "asc"
        // },
        {
          label: "ข้อมูลพื้นที่",
          field: "edit3",
          sort: "asc"
        },
      ],
      rows: this.state.c1
    };
    const datac2 = {
      columns: [
        {
          label: "ID",
          field: "ID",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "Name",
          sort: "asc"
        },
        {
          label: "ชื่อโครงกร",
          field: "Project_name",
          sort: "asc"
        },
        {
          label: "โครงการ",
          field: "edit",
          sort: "asc"
        },

        // {
        //   label: "กิจกรรม",
        //   field: "edit2",
        //   sort: "asc"
        // },
        // {
        //   label: "หลักสูตร",
        //   field: "course",
        //   sort: "asc"
        // },
        {
          label: "ข้อมูลพื้นที่",
          field: "edit3",
          sort: "asc"
        },
      ],
      rows: this.state.c2
    };
    const datac3 = {
      columns: [
        {
          label: "ID",
          field: "ID",
          sort: "asc"
        },
        {
          label: "ชื่อ",
          field: "Name",
          sort: "asc"
        },
        {
          label: "ชื่อโครงกร",
          field: "Project_name",
          sort: "asc"
        },
        {
          label: "โครงการ",
          field: "edit",
          sort: "asc"
        },

        // {
        //   label: "กิจกรรม",
        //   field: "edit2",
        //   sort: "asc"
        // },
        // {
        //   label: "หลักสูตร",
        //   field: "course",
        //   sort: "asc"
        // },
        {
          label: "ข้อมูลพื้นที่",
          field: "edit3",
          sort: "asc"
        },
      ],
      rows: this.state.c3
    };
    const map = {
      name: "map_ubon",
      areas: [
        { name: "น้ำยืน", shape: "poly", coords: [327, 564, 333, 550, 328, 534, 335, 518, 349, 518, 358, 508, 324, 481, 324, 438, 281, 428, 298, 458, 280, 477, 279, 495, 256, 501, 275, 511, 284, 546] },
        { name: "น้ำขุ่น", shape: "poly", coords: [252, 498, 276, 492, 277, 475, 291, 457, 276, 427, 253, 428, 238, 426, 226, 452, 234, 492] },
        { name: "นาจะหลวย", shape: "poly", coords: [359, 502, 368, 493, 364, 441, 353, 396, 306, 402, 306, 423, 324, 431, 324, 477] },
        { name: "บุณฑริก", shape: "poly", coords: [349, 394, 351, 340, 369, 333, 389, 348, 422, 337, 430, 345, 418, 447, 391, 490, 370, 489] },
        { name: "ทุ่งศรีอุดม", shape: "poly", coords: [277, 422, 240, 425, 226, 396, 236, 385, 254, 387, 272, 393] },
        { name: "เดชอุดม", shape: "poly", coords: [242, 382, 276, 393, 282, 422, 302, 426, 303, 404, 343, 391, 346, 342, 321, 319, 313, 343, 283, 339, 271, 330, 250, 338, 252, 362] },
        { name: "สำโรง", shape: "poly", coords: [223, 388, 239, 380, 248, 362, 247, 335, 231, 312, 183, 320, 196, 346, 222, 364] },
        { name: "นาเยีย", shape: "poly", coords: [255, 332, 274, 312, 278, 290, 290, 288, 300, 311, 319, 317, 311, 340, 285, 339, 275, 327] },
        { name: "สว่างวีระวงศ์", shape: "poly", coords: [259, 319, 270, 310, 275, 288, 294, 287, 310, 274, 286, 249, 273, 259, 254, 287] },
        { name: "วารินชำราบ", shape: "poly", coords: [188, 317, 231, 310, 249, 329, 258, 323, 254, 287, 269, 266, 223, 271, 196, 274, 197, 285, 183, 302] },
        { name: "พิบูลมังสาหาร", shape: "poly", coords: [293, 290, 300, 307, 315, 313, 348, 335, 368, 329, 369, 300, 355, 268, 380, 228, 370, 211, 352, 212, 348, 227, 311, 241, 290, 248, 312, 274] },
        { name: "สิรินธร", shape: "poly", coords: [374, 332, 371, 299, 358, 269, 387, 225, 402, 259, 405, 287, 416, 299, 425, 292, 428, 311, 434, 321, 423, 333, 388, 346] },
        { name: "โขงเจียม", shape: "poly", coords: [372, 209, 379, 222, 389, 225, 404, 259, 444, 243, 447, 222, 415, 224, 408, 214, 438, 188, 447, 142, 435, 130, 412, 142, 415, 160, 380, 170, 380, 194] },
        { name: "ศรีเมืองใหม่", shape: "poly", coords: [330, 184, 330, 157, 349, 125, 372, 130, 386, 139, 415, 116, 432, 127, 409, 142, 410, 158, 377, 170, 378, 195, 369, 208, 351, 208] },
        { name: "โพธิ์ไทร", shape: "poly", coords: [342, 125, 327, 111, 324, 88, 343, 81, 373, 83, 384, 104, 402, 107, 415, 113, 391, 135] },
        { name: "นาตาล", shape: "poly", coords: [321, 81, 327, 70, 340, 59, 364, 57, 374, 81, 344, 76, 327, 87] },
        { name: "เขมราฐ", shape: "poly", coords: [319, 75, 338, 57, 371, 56, 371, 45, 308, 37, 278, 51, 284, 67, 301, 80] },
        { name: "กุดข้าวปุ้น", shape: "poly", coords: [321, 108, 320, 85, 295, 81, 277, 65, 253, 110, 275, 117] },
        { name: "ตระการพืชผล", shape: "poly", coords: [246, 167, 271, 186, 293, 189, 297, 196, 328, 182, 330, 154, 344, 129, 316, 111, 276, 118, 252, 112, 255, 156] },
        { name: "ตาลสุม", shape: "poly", coords: [349, 209, 329, 186, 298, 200, 307, 241, 343, 225] },
        { name: "ดอนมดแดง", shape: "poly", coords: [285, 245, 305, 240, 297, 204, 283, 190, 270, 194, 268, 210, 266, 223, 281, 232] },
        { name: "เหล่าเสือโก้ก", shape: "poly", coords: [260, 234, 266, 212, 267, 187, 242, 170, 235, 181, 237, 202, 228, 216, 246, 230] },
        { name: "ม่วงสามสิบ", shape: "poly", coords: [153, 180, 165, 162, 167, 145, 182, 141, 203, 145, 237, 166, 235, 199, 218, 220, 188, 220] },
        { name: "เขื่องใน", shape: "poly", coords: [178, 262, 116, 251, 122, 237, 109, 216, 117, 185, 151, 181, 175, 198, 188, 222, 186, 241] },
        { name: "เมืองอุบลราชธานี", shape: "poly", coords: [190, 274, 209, 267, 230, 267, 269, 258, 280, 248, 276, 232, 266, 228, 263, 243, 228, 220, 194, 223, 183, 251, 182, 268] },
      ]
    }
    if (this.state.add_status) {
      return (
        <center>
          <Topnav></Topnav>
          <div className="area_detail">
            <Row style={{ justifyContent: 'flex-end' }}>
              {/* <label htmlFor="file">Upload an excel to Process Triggers</label>
              <br />
              <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange.bind(this)} />
              <button type="button" className='btn btn-success' onClick={this.handleFile.bind(this)}>โหลดข้อมูล</button> */}

              <button
                className="btn btn-danger"
                onClick={() => this.setState({ add_status: false })}
              >
                กลับ
                     </button>
              {/* <button
                className="btn btn-danger"
                onClick={this.update_data.bind(this)}
              >
                update
                     </button> */}
            </Row>
            <hr></hr>
            <Modal
              title={selectLocalData.Dominance + selectLocalData.Area_name}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
                {this.state.addAllcomponent}
                {this.state.list_bans}
              </div>

            </Modal>
            <form onSubmit={this.onSubmit} >
              <Form.Group as={Row}>
                <Form.Label column sm="2" style={{ padding: 5 }}>จังหวัด: </Form.Label>
                <Col>
                  <select className="form-control" id="AProvince_ID" name="AProvince_ID" value={AProvince_ID} onChange={this.onSelectProvince} required>
                    <option key='0' value=""></option>
                    {Provinces.map((data, i) =>
                      <option key={i + 1} value={data.Key}>{data.value}</option>
                    )}

                  </select>
                </Col>
                <Form.Label column sm="2" style={{ padding: 5 }}>อำเภอ: </Form.Label>
                <Col>
                  <select className="form-control" id="ADistrict_ID" name="ADistrict_ID" value={ADistrict_ID} onChange={this.onSelectDistrict} required>
                    <option key='0' value=""></option>
                    {Districts.map((data, i) =>
                      <option key={i + 1} value={data.Key}>{data.value}</option>
                    )}

                  </select>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2" style={{ padding: 5 }}>ตำบล: </Form.Label>
                <Col>
                  <select className="form-control" id="ASubDistrict_ID" name="ASubDistrict_ID" value={ASubDistrict_ID} onChange={this.onChange} required>
                    <option key='0' value=""></option>
                    {SubDistricts.map((data, i) =>
                      <option key={i + 1} value={data.Key}>{data.value}</option>
                    )}

                  </select>
                </Col>
                <Form.Label column sm="2" style={{ padding: 5 }}> </Form.Label>
                <Col>

                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2" style={{ padding: 5 }}>รหัสพื้นที่: </Form.Label>
                <Col>
                  <input type="text" className="form-control" name="LGO_ID" value={LGO_ID} onChange={this.onChange} required />
                </Col>
                <Form.Label column sm="2" style={{ padding: 5 }}>ชื่อ: </Form.Label>
                <Col>
                  <input type="text" className="form-control" name="Area_name" value={Area_name} onChange={this.onChange} required />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2" style={{ padding: 5 }}>ประเภทการปกครอง: </Form.Label>
                <Col>
                  <select className="form-control" id="Dominance" name="Dominance" value={Dominance} onChange={this.onChange} required>
                    <option key='0' value=""></option>
                    <option key='1' value="องค์การบริหารส่วนจังหวัด">องค์การบริหารส่วนจังหวัด</option>
                    <option key='2' value="องค์การบริหารส่วนตำบล">องค์การบริหารส่วนตำบล</option>
                    <option key='3' value="เทศบาลนคร">เทศบาลนคร</option>
                    <option key='4' value="เทศบาลเมือง">เทศบาลเมือง</option>
                    <option key='5' value="เทศบาลตำบล">เทศบาลตำบล</option>
                    <option key='6' value="รูปแบบพิเศษ">รูปแบบพิเศษ</option>
                  </select>
                </Col>
                <Form.Label column sm="2" style={{ padding: 5 }}>ประเภทพื้นที่: </Form.Label>
                <Col>
                  <select className="form-control" id="Area_type" name="Area_type" value={Area_type} onChange={this.onChange}>
                    <option key='0' value=""></option>
                    <option key='1' value="พื้นที่พัฒนา">พื้นที่พัฒนา</option>
                    <option key='2' value="พื้นที่นำร่อง">พื้นที่นำร่อง</option>
                    <option key='3' value="พื้นที่ต้นแบบ">พื้นที่ต้นแบบ</option>
                  </select>
                </Col>
              </Form.Group>
              <center><br />
                <button type="submit" className="btn btn-success">บันทึก</button>
                <br></br>
              </center>

            </form>
            <hr></hr>
            <Row>
              <button
                className="btn btn-info"
                onClick={() => Firebase.firestore().collection("AREAS").onSnapshot(this.getModuleC)}
              >
                ทั้งหมด
                     </button>
              <button
                className="btn btn-info"
                onClick={() => Firebase.firestore().collection("AREAS").where('Area_type', '==', 'พื้นที่พัฒนา').onSnapshot(this.getModuleC)}
              >
                พื้นที่พัฒนา
                     </button>
              <button
                className="btn btn-info"
                onClick={() => Firebase.firestore().collection("AREAS").where('Area_type', '==', 'พื้นที่นำร่อง').onSnapshot(this.getModuleC)}
              >
                พื้นที่นำร่อง
                     </button>
              <button
                className="btn btn-info"
                onClick={() => Firebase.firestore().collection("AREAS").where('Area_type', '==', 'พื้นที่ต้นแบบ').onSnapshot(this.getModuleC)}
              >
                พื้นที่ต้นแบบ
                     </button>
            </Row>
            <br></br>
            {/* <MDBDataTable
              striped
              bordered
              small
              searchLabel="ค้นหา"
              paginationLabel={["ก่อนหน้า", "ถัดไป"]}
              infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
              entriesLabel="แสดง รายการ"
              data={data}
            /> */}
          </div>
        </center >
      )
    } else {
      return (
        <center>
          <Topnav></Topnav>
          <div className="area_detail">
            {/* แสดง กราฟ สรุปพลัง  */}
            <Row>
              <h5>จำนวนข้อมูล ก่อนเข้าร่วม {num1}</h5>
              <h5>จำนวนข้อมูล ระหว่างเข้าร่วม {num2}</h5>
              <h5>จำนวนข้อมูล หลังเข้าร่วม {num3}</h5>
            </Row>
            <Row>
              <Col>
                <div style={{ height: 100 }}>
                  <span >C101 {this.state.q1[0]}</span>
                </div>

                <div style={{ flexDirection: 'row' }}>
                  <span>ก่อนเข้าร่วม {ShowC110}%</span>
                  <BorderLinearProgress1 variant="determinate" value={ShowC110} />
                </div>
                <div>
                  <span>ระหว่างเข้าร่วม {ShowC120}%</span>
                  <BorderLinearProgress2 variant="determinate" value={ShowC120} />
                </div>
                <div>
                  <span>หลังเข้าร่วม {ShowC130}%</span>
                  <BorderLinearProgress3 variant="determinate" value={ShowC130} />
                </div>
              </Col>
              <Col>
                <div style={{ height: 100 }}>
                  <span >C102 {this.state.q1[1]}</span>
                </div>
                <div style={{ flexDirection: 'row' }}>
                  <span>ก่อนเข้าร่วม {ShowC111}%</span>
                  <BorderLinearProgress1 variant="determinate" value={ShowC111} />
                </div>
                <div>
                  <span>ระหว่างเข้าร่วม {ShowC121}%</span>
                  <BorderLinearProgress2 variant="determinate" value={ShowC121} />
                </div>
                <div>
                  <span>หลังเข้าร่วม{ShowC131}%</span>
                  <BorderLinearProgress3 variant="determinate" value={ShowC131} />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <RadarChart
                  captions={{
                    // columns
                    Q1: 'C201',
                    Q2: 'C202',
                    Q3: 'C203',
                    Q4: 'C204',
                  }}
                  data={[
                    // data
                    {
                      data: {
                        Q1: C12[0] / num1 * 0.2,
                        Q2: (C12[1] / num1) * 0.2,
                        Q3: (C12[2] / num1) * 0.2,
                        Q4: (C12[3] / num1) * 0.2,

                      },
                      meta: { color: ColorNo1 }
                    }, {
                      data: {
                        Q1: (C22[0] / num2) * 0.2,
                        Q2: (C22[1] / num2) * 0.2,
                        Q3: (C22[2] / num2) * 0.2,
                        Q4: (C22[3] / num2) * 0.2,

                      },
                      meta: { color: ColorNo2 }
                    },
                    {
                      data: {
                        Q1: (C32[0] / num3) * 0.2,
                        Q2: (C32[0] / num3) * 0.2,
                        Q3: (C32[0] / num3) * 0.2,
                        Q4: (C32[0] / num3) * 0.2,

                      },
                      meta: { color: ColorNo3 }
                    },
                  ]}
                  size={this.state.detail ? 300 : 350}
                />
              </Col>
              <Col>
                <RadarChart
                  captions={{
                    // columns
                    Q1: 'C301',
                    Q2: 'C302',
                    Q3: 'C303',
                    Q4: 'C304',
                  }}
                  data={[
                    // data
                    {
                      data: {
                        Q1: (C13[0] / num1) * 0.2,
                        Q2: (C13[1] / num1) * 0.2,
                        Q3: (C13[2] / num1) * 0.2,
                        Q4: (C13[3] / num1) * 0.2,
                      },
                      meta: { color: ColorNo1 }
                    }, {
                      data: {
                        Q1: (C23[0] / num2) * 0.2,
                        Q2: (C23[1] / num2) * 0.2,
                        Q3: (C23[2] / num2) * 0.2,
                        Q4: (C23[3] / num2) * 0.2,
                      },
                      meta: { color: ColorNo2 }
                    },
                    {
                      data: {
                        Q1: (C33[0] / num3) * 0.2,
                        Q2: (C33[1] / num3) * 0.2,
                        Q3: (C33[2] / num3) * 0.2,
                        Q4: (C33[3] / num3) * 0.2,
                      },
                      meta: { color: ColorNo3 }
                    },
                  ]}
                  size={this.state.detail ? 300 : 350}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ position: "relative", }}>
                  <ImageMapper src={require('../../assets/map.jpg')} map={map} width={600} height={600}
                    onClick={area => this.areaClicked(area)}
                  // onMouseEnter={area => console.log(area)}
                  // onImageClick={(area, _, evt) => console.log(area, evt)}
                  // onMouseMove={(area, _, evt) => console.log(evt.nativeEvent.layerX, evt.nativeEvent.layerY)}  
                  // onMouseLeave={area => console.log(area)}
                  >
                  </ImageMapper >
                </div>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <h1 style={{ marginBottom: 30 }}><strong>{area_detail.area_name}</strong></h1>
                  <h5><strong>พื้นที่ต้นแบบ</strong> {area_detail.arae_number1} พื้นที่</h5>
                  <h5><strong>พื้นที่นำร่อง</strong> {area_detail.arae_number2} พื้นที่</h5>
                  <h5><strong>พื้นที่พัฒนา</strong> {area_detail.arae_number3} พื้นที่</h5>
                  <h5><strong>ประชากร</strong> {area_detail.population} คน</h5>
                  <h5><strong>เด็กและเยาวชน</strong> {area_detail.child_number} คน</h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={8} style={{ height: 500, alignItems: 'center' }}>
                <Map google={this.props.google}
                  zoom={this.state.zoomMap}
                  center={{
                    lat: this.state.position.lat,
                    lng: this.state.position.lng
                  }}

                  style={{ width: '90%', height: '100%' }}
                  onClick={this.onMapClicked}
                >
                  <Marker
                    name="add Marker"
                    onClick={this.onMarkerClick}
                    position={{
                      lat: this.state.position.lat,
                      lng: this.state.position.lng
                    }}
                  />
                  {this.state.listshowMarker}

                  <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div style={{ overflow: 'hidden', justifyContent: 'center' }}>
                      <img alt="infoMap" style={{ width: 150, height: 150 }} src={this.state.selectedPlace.image} />
                      <h5>{this.state.selectedPlace.description}</h5>
                    </div>
                  </InfoWindow>
                </Map>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <h5><strong>บ้าน จำนวน</strong> {shome_num} จุด</h5>
                  <h5><strong>ทรัพยากรชุมชน จำนวน</strong> {sresource_num} จุด</h5>
                  <h5><strong>องค์กร จำนวน</strong> {sorganization_num} จุด</h5>
                  <h5><strong>จุดดี จำนวน</strong> {sflag_good_num} จุด</h5>
                  <h5><strong>จุดเสี่ยง จำนวน</strong> {sflag_danger_num} จุด</h5>
                  <h5><strong>จุดอุบัติเหตุ จำนวน</strong> {saccident_num} จุด</h5>
                </div>
              </Col>


            </Row>
            {Role === 'admin' ?
              <Row style={{ justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-info"
                  onClick={() => this.setState({ add_status: true })}
                >
                  จัดการพื้นที่
                     </button>
              </Row>
              : <Row></Row>}


            <Row style={{ padding: 20 }}>
              <h1>พื้นที่พัฒนา {c1.length}</h1>
            </Row>
            <MDBDataTable
              striped
              bordered
              small
              searchLabel="ค้นหา"
              paginationLabel={["ก่อนหน้า", "ถัดไป"]}
              infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
              entriesLabel="แสดง รายการ"
              data={datac1}
            />
            {/* <div style={{ marginLeft: '20vw' }}>
                {c1.map((element, i) =>
                  <div key={i}><p style={{ textAlign: 'left' }}>{i + 1} {element.Dominance}{element.Area_name}</p></div>
                )}
              </div> */}
            <Row style={{ padding: 20 }}>
              <h1>พื้นที่นำร่อง {c2.length}</h1>
            </Row>
            <MDBDataTable
              striped
              bordered
              small
              searchLabel="ค้นหา"
              paginationLabel={["ก่อนหน้า", "ถัดไป"]}
              infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
              entriesLabel="แสดง รายการ"
              data={datac2}
            />
            {/* <div style={{ marginLeft: '20vw' }}>
                {c2.map((element, i) =>
                  <div key={i}><p style={{ textAlign: 'left' }}>{i + 1} {element.Dominance}{element.Area_name}</p></div>
                )}
              </div> */}

            <Row style={{ padding: 20 }}>
              <h1>พื้นที่ต้นแบบ {c3.length}</h1>
            </Row>
            <MDBDataTable
              striped
              bordered
              small
              searchLabel="ค้นหา"
              paginationLabel={["ก่อนหน้า", "ถัดไป"]}
              infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
              entriesLabel="แสดง รายการ"
              data={datac3}
            />
            {/* <div style={{ marginLeft: '20vw' }}>
                {c3.map((element, i) =>
                  <div key={i}><p style={{ textAlign: 'left' }}>{i + 1} {element.Dominance}{element.Area_name}</p></div>
                )}
              </div> */}
          </div>
        </center >
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
export default
  connect(mapStateToProps, mapDispatchToProps)
    ((GoogleApiWrapper({ apiKey: ('AIzaSyDsS-9RgGFhZBq1FsaC6nG5dURMeiOCqa8'), language: 'th' }))(Area));