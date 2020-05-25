import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import SheetJSFT from './Excel_type';
import Firebase from '../Firebase';
import { Form, Row, Col } from 'react-bootstrap'

class Import_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {},
            data: [],
            cols: [],
            Tb_name: '',
            data_provinces: [],
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }
    handleFile() {
        /* Boilerplate to set up FileReader */
        // Firebase.auth().onAuthStateChanged((user) => {
        //      console.log(user)
        // })
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */
            this.setState({ data: data, cols: make_cols(ws['!ref']) });
            const data_provinces = [];

            let sd = [];
            let d = '';
            let p = [];
            let temp_sd = [];
            let temp_b = [];
            console.log(this.state.data.length);
            if (this.state.Tb_name !== '') {

                const tb = Firebase.firestore().collection(this.state.Tb_name);

                this.state.data.forEach((element, i) => {
                    if (this.state.Tb_name === 'TUMBONS') {
                        tb.doc(element.Key).set({
                            Name: element.Name,
                            District_ID: element.District_ID
                        }).then((docref) => {
                            console.log('import database success')
                        })
                    } else if (this.state.Tb_name === 'LGOS') {
                        tb.doc(element.Key).set({
                            Name: element.Name,
                            Province_ID: element.Province_ID,
                            Zip_code: element.Zip_code,
                            Address: element.Address,
                            District_ID: element.District_ID,
                            Local_ID: element.Local_ID,
                            Local_type: element.Local_type,
                            Sub_district_ID: element.Sub_district_ID,
                            Type: element.Type,
                        }).then((docref) => {
                            console.log('import database success')
                        })
                    } else if (this.state.Tb_name === 'DISTRICTS') {
                        tb.doc(element.Key).set({
                            Name: element.Name,
                            Province_ID: element.Province_ID
                            ,
                            Zip_code: element.Zip_code
                        }).then((docref) => {
                            console.log('import database success')
                        })
                    } else if (this.state.Tb_name === 'PROVINCES') {
                        // console.log(this.state.data[i+1])
                        // console.log(this.state.data[i].Ban_number)
                        if (d !== element.District) {
                            d = element.District;
                        }
                        if (element.Ban_number === 1) {
                            sd = element.Sub_district;
                            temp_b.push([
                                element.ID,
                                element.Ban_name,
                                element.Ban_number]
                            )
                            // console.log("number 1");
                        } else if (i < 2703 && this.state.data[i + 1].Ban_number === 1) {

                            temp_b.push([
                                element.ID,
                                element.Ban_name,
                                element.Ban_number]
                            )
                            temp_sd.push([sd, [temp_b]]);
                            temp_b = [];

                            if (this.state.data[i + 1].District !== d) {
                                data_provinces.push([d, element.Zip_code, [temp_sd]])
                                temp_sd = [];
                            }

                        } else if (i === 2703) {
                            console.log("สุดท้าย")
                            data_provinces.push([d, [element.Sub_district, [temp_b]]])
                            temp_b = [];
                        } else {
                            temp_b.push([
                                element.ID,
                                element.Ban_name,
                                element.Ban_number]
                            )
                            // console.log("number !==1 and !== last")
                        }

                        // tb.doc(element.Key).set({
                        //     Name: element.Name,
                        //     Region: element.Region
                        // }).then((docref) => {
                        //     console.log('import database success')
                        // })
                    } else if (this.state.Tb_name === 'USERS') {
                        // Firebase.auth().then((doc))
                        //     tb.doc(doc.uid).set({
                        //         Name: element.Name,
                        //         Last_name: element.Last_name,
                        //         Position: element.Position,
                        //         Department: element.Department,
                        //         Sub_district_ID: element.Sub_district_ID,
                        //         District_ID: element.District_ID,
                        //         Province_ID: element.Province_ID,
                        //         Email: element.Email,
                        //         Phone_number: element.Phone_number,
                        //     }).then((docref) => {
                        //         console.log('import database success')
                        //     })
                        // try {
                        //     Firebase.auth().createUserWithEmailAndPassword(element.Email, "12345678")
                        //         .then(doc => {
                        //             console.log(i, "เพิ่มใหม่")


                        //         }).catch((error) => {
                        //             console.log(i, "ไม่สำเร็จ")
                        //         })

                        // } catch (error) {

                        // }

                    }


                });
            }
            console.log(data_provinces);
            console.log(JSON.stringify(data_provinces));
            this.setState({
                data_provinces
            })


        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }

    render() {
        const { Tb_name } = this.state;

        return (
            <div>

                <label htmlFor="file">Upload an excel to Process Triggers</label>
                <br />
                <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
                <br />
                <Form.Group as={Row}>
                    <Form.Label column sm="2">เลือก table database: <label style={{ color: "red" }}>*</label></Form.Label>
                    <Col>
                        <select className="form-control" name="Tb_name" value={Tb_name} onChange={this.onChange} required>
                            <option value=""></option>
                            <option value="TUMBONS">ตำบล</option>
                            <option value="LGOS">อปท</option>
                            <option value="DISTRICTS">อำเภอ</option>
                            {/* <option value="PROVINCES">จังหวัด</option> */}
                            <option value="USERS">ผู้ใช้</option>
                            <option value="PROVINCES">ตารางจังหวัด</option>
                        </select>
                    </Col>

                </Form.Group>

                <button type="submit" className='btn btn-success' onClick={this.handleFile}>import</button>

                <div>

                </div>

            </div>

        )
    }
}



export default Import_data;
