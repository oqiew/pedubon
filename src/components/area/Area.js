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
export class Area extends Component {
  constructor(props) {
    super(props);
    this.tbAreas = Firebase.firestore().collection(tableName.Areas);
    this.state = {
      ...this.props.fetchReducer.user,
      c1: [],
      c2: [],
      c3: [],
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

    };
  }
  componentDidMount() {
    Firebase.firestore().collection('PROJECTS').onSnapshot(this.list_project);
    this.tableName.onSnapshot(this.getModuleC);

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

  getModuleC = querySnapshot => {
    const c1 = [];
    const c2 = [];
    const c3 = [];
    const list_area = [];//ตาราวข้อมูลทั้งหมด
    querySnapshot.forEach(doc => {
      const Province = data_provinces[doc.data().AProvince_ID][0];
      const District = data_provinces[doc.data().AProvince_ID][1][doc.data().ADistrict_ID][0];

      var stb = 0;
      if (doc.data().bans !== undefined) {
        doc.data().bans.forEach((d) => {
          if (d) {
            stb++;
          }
        })
      }

      list_area.push({
        ID: doc.id,
        Province,
        District,
        ...doc.data(),
        nban: stb,
        edit: (
          <div>
            <button
              className="btn btn-pimary"
              onClick={this.handleOpen.bind(this, { ID: doc.id, Province, District, ...doc.data() })}
            >
              เปิด
          </button>
            <button
              className="btn btn-success"
              onClick={this.edit.bind(this, doc.data(), doc.id)}
            >
              แก้ไข
          </button>
            <button
              className="btn btn-danger"
              onClick={this.delete_area.bind(this, doc.id)}
            >
              ลบ
          </button>
          </div>

        )
      })

      if (doc.data().Area_type === 'พื้นที่พัฒนา') {
        c1.push({
          ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data(), Project_name: this.get_project(doc.id),
          edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),

        });
      } else if (doc.data().Area_type === 'พื้นที่นำร่อง') {
        c2.push({
          ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data(), Project_name: this.get_project(doc.id),
          edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),
        });
      } else if (doc.data().Area_type === 'พื้นที่ต้นแบบ') {
        c3.push({
          ID: doc.id, Name: doc.data().Dominance + doc.data().Area_name, ...doc.data(), Project_name: this.get_project(doc.id),
          edit: (<Link to={`/project_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit2: (<Link to={`/activity_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          course: (<Link to={`/course_manage/${doc.id}`} className="btn btn-success">เปิด</Link>),
          edit3: (<Link to={`/data_area/${doc.id}`} className="btn btn-success">เปิด</Link>),
        });
      }
    });

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
  clicked(area) {
    console.log(area.name);
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

  render() {
    const { c1, c2, c3, Role, selectLocalData } = this.state;
    const { AProvince_ID, ADistrict_ID, ASubDistrict_ID, Provinces, Districts, SubDistricts,
      Dominance, Area_type, Area_name, LGO_ID } = this.state;
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
        {
          label: "กิจกรรม",
          field: "edit2",
          sort: "asc"
        },
        {
          label: "หลักสูตร",
          field: "course",
          sort: "asc"
        },
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
        {
          label: "กิจกรรม",
          field: "edit2",
          sort: "asc"
        },
        {
          label: "หลักสูตร",
          field: "course",
          sort: "asc"
        },
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
        {
          label: "กิจกรรม",
          field: "edit2",
          sort: "asc"
        },
        {
          label: "หลักสูตร",
          field: "course",
          sort: "asc"
        },
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
    const URL = "https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg";
    const MAP = {
      name: "my-map",
      areas: [
        { name: "1", shape: "poly", coords: [25, 33, 27, 300, 128, 240, 128, 94], preFillColor: "green", fillColor: "blue" },
        { name: "2", shape: "poly", coords: [219, 118, 220, 210, 283, 210, 284, 119], preFillColor: "pink" },
        { name: "3", shape: "poly", coords: [381, 241, 383, 94, 462, 53, 457, 282], fillColor: "yellow" },
        { name: "4", shape: "poly", coords: [245, 285, 290, 285, 274, 239, 249, 238], preFillColor: "red" },
        { name: "5", shape: "circle", coords: [170, 100, 25] },
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
        </center >
      )
    } else {
      return (
        <center>
          <Topnav></Topnav>
          <div className="area_detail">
            <div style={{ position: "relative", }}>
              <ImageMapper src={require('../../assets/map.jpg')} map={map} width={600} height={600}
                // <ImageMapper src={URL} map={MAP} width={500}
                onClick={area => console.log(area)}
                onMouseEnter={area => console.log(area)}
                // onImageClick={(area, _, evt) => console.log(area, evt)}
                onMouseMove={(area, _, evt) => console.log(evt.nativeEvent.layerX, evt.nativeEvent.layerY)}
              // onMouseLeave={area => console.log(area)}

              >

              </ImageMapper >

            </div>



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

export default connect(mapStateToProps, mapDispatchToProps)(Area);
