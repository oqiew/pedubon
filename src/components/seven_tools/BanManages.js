import React, { Component } from 'react'
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import Firebase from "../../Firebase";
import Topnav from "../top/Topnav";
import { MDBDataTable } from 'mdbreact';
import "../../App.css";
import { tableName } from '../../database/TableConstant';
import Iedit from '../../assets/pencil.png';
import Idelete from '../../assets/trash_can.png';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Form, Col, Row } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { isEmptyValue } from '../Methods';
export class BanManages extends Component {
    constructor(props) {
        super(props);
        this.tbAreas = Firebase.firestore().collection(tableName.Areas);
        this.tbBans = Firebase.firestore().collection(tableName.Bans)

        let temp = '';
        if (this.props.fetchReducer.user.Role === 'admin') {
            temp = 'admin'
        } else if (this.props.fetchReducer.user.User_type === 'พี่เลี้ยง') {
            temp = 'พี่เลี้ยง'
        }
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            _Role: temp,
            query_bans: [],
            query_areas: [],
            areas: '',
            dominance: '',
            area: '',
            admin_input_area_ID: '',
            Name: '',
            edit_ID: "",

        }
    }
    componentDidMount() {

        if (this.state._Role === 'admin') {
            this.tbAreas.onSnapshot(this.queryareas)
            this.tbBans.onSnapshot(this.onListBans)
        } else {
            this.queryarea()
            this.tbBans.where('Area_ID', '==', this.state.Area_ID).onSnapshot(this.onListBans)
        }
    }
    getArea = async (Area_ID) => {
        return new Promise((resolve, reject) => {
            this.tbAreas.doc(Area_ID).get().then((doc) => {
                if (doc.exists) {
                    resolve({ ID: doc.id, ...doc.data() })
                } else {
                    reject('')
                }
            })
        })
    }
    queryarea = async () => {
        const area = await this.getArea(this.state.Area_ID)
        this.setState({
            area
        })
    }
    queryareas = (query) => {
        const query_areas = [];
        query.forEach(element => {
            query_areas.push({
                areaID: element.id,
                title: element.data().Area_name,
                ...element.data()
            })
        });
        this.setState({
            query_areas,
            areas: query_areas
        })
    }
    onListBans = (query) => {
        const query_bans = [];
        query.forEach(doc => {
            query_bans.push({
                ID: doc.id,
                ...doc.data(),
                edit:
                    <div>

                        <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="edit" src={Iedit} onClick={this.onEdit.bind(this, doc.data(), doc.id)}></img>
                        <img style={{ widtha: 20, height: 20, cursor: 'pointer' }} alt="delete" src={Idelete} onClick={this.onDelete.bind(this, doc.id)}></img>
                    </div>
            })
        });
        this.setState({
            query_bans,
            bans: query_bans
        })
    }
    onEdit(data, id) {
        this.setState({
            Name: data.Name,
            edit_ID: id
        })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        const { Name, admin_input_area_ID, uid, edit_ID } = this.state;
        if (isEmptyValue(edit_ID)) {

            const area = await this.getArea(admin_input_area_ID)
            this.tbBans.add({
                Name,
                Area_ID: admin_input_area_ID,
                Province_name: area.Province_name,
                District_name: area.District_name,
                Create_date: Firebase.firestore.Timestamp.now(),
                Update_date: Firebase.firestore.Timestamp.now(),
                Create_By_ID: uid
            }).then((result) => {
                this.setState({
                    Name: '',
                    loading: false
                })
            }).catch((error) => {
                console.log('error', error)
                this.setState({
                    loading: false
                })
            })
        } else {
            console.log(edit_ID)
            this.tbBans.doc(edit_ID).update({
                Name,
                Update_date: Firebase.firestore.Timestamp.now(),
                Create_By_ID: uid
            }).then((result) => {
                this.setState({
                    Name: '',
                    edit_ID: '',
                    loading: false
                })
            }).catch((error) => {
                console.log('error', error)
                this.setState({
                    loading: false
                })
            })
        }
    }
    onDelete(id) {
        this.tbBans.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({
                loading: false
            })
        })
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onChangeDominance = (value) => {
        const dominance = value.target.value;

        if (dominance === '') {
            return [];
        }
        const { query_areas } = this.state;
        console.log(query_areas)
        const regex = new RegExp(`${dominance.trim()}`, 'i');
        const areas = query_areas.filter(area => area.Dominance.search(regex) >= 0)
        this.setState({
            areas,
            dominance
        })
    }
    render() {
        const { _Role, areas, dominance, Name, edit_ID } = this.state;
        const data = {
            columns: [
                {
                    label: 'หมู่บ้าน',
                    field: 'Name',
                    sort: 'asc',
                },
                {
                    label: 'อำเภอ',
                    field: 'District_name',
                    sort: 'asc',
                },
                {
                    label: 'จังหวัด',
                    field: 'Province_name',
                    sort: 'asc',
                },
                {
                    label: 'แก้ไข',
                    field: 'edit',
                    sort: 'asc',
                }
            ],
            rows: this.state.query_bans
        };
        return (
            <div>
                <Topnav></Topnav>
                <div className="main_component">
                    <h1>สิทธิ์ : {_Role}</h1>
                    <hr></hr>
                    {_Role === 'พี่เลี้ยง' ?
                        <div>

                        </div>
                        :
                        <div>
                            <form onSubmit={this.onSubmit}>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">รูปแบบ อปท : <label style={{ color: "red" }}>*</label></Form.Label>
                                    <Col>
                                        <select className="form-control" id="dominance" name="dominance" required
                                            value={dominance} onChange={str => this.onChangeDominance(str)}>
                                            <option key={0} value="เลือกรูปแบบ อปท"></option>
                                            <option key={1} value="องค์การบริหารส่วนจังหวัด">องค์การบริหารส่วนจังหวัด</option>
                                            <option key={2} value="เทศบาลนคร">เทศบาลนคร</option>
                                            <option key={3} value="เทศบาลเมือง">เทศบาลเมือง</option>
                                            <option key={4} value="เทศบาลตำบล">เทศบาลตำบล</option>
                                            <option key={5} value="องค์การบริหารส่วนตำบล">องค์การบริหารส่วนตำบล</option>
                                        </select>
                                    </Col>
                                    <Form.Label column sm="2">ชื่ออปท: </Form.Label>
                                    <Col>
                                        <Autocomplete
                                            options={areas}
                                            getOptionLabel={(option) => option.title}
                                            style={{ width: 'auto' }}
                                            onChange={(e, val) => this.setState({ admin_input_area_ID: val.areaID })}
                                            renderInput={(params) =>
                                                <TextField {...params} variant="outlined" />
                                            }
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm="2">ชื่อหมู่บ้าน </Form.Label>
                                    <Col>
                                        <input type="text" className="form-control" name="Name" value={Name} onChange={this.onChange} required />
                                    </Col>

                                </Form.Group>
                                <center>
                                    <button type="submit" className="btn btn-success">เพิ่ม</button>
                                </center>
                            </form>
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
                        </div>}
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(BanManages);