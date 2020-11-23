import React, { Component } from 'react'
import { Form, Col, Row } from 'react-bootstrap';
import Firebase from '../../Firebase';
import data from './data.json';
import { confirmAlert } from 'react-confirm-alert'; // Import
export class Add_cdata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ly15: '',
            y16: '',
            y17: '',
            y18: '',
            y19: '',
            y20: '',
            y21: '',
            y22: '',
            y23: '',
            y24: '',
            y25: '',
            Key: '',
            year: '',

        }


    }
    componentDidMount() {
        if (this.props.status === 'edit' && (this.props.id !== undefined && this.props.id !== '')) {
            Firebase.firestore().collection('CDATAS').doc(this.props.id).get().then((doc) => {
                this.setState({
                    ...doc.data(),
                    Key: doc.id
                })
            })
        }

    }
    deleteData(id) {
        confirmAlert({
            title: "ลบ",
            message: "คุณต้องการลบข้อมูลใช่หรือไม่",
            buttons: [
                {
                    label: "ใช่",
                    onClick: (() => {
                        Firebase.firestore().collection("CDATAS").doc(id).delete().then(() => {
                            this.props.back()
                        }).catch(() => {
                            confirmAlert({
                                title: "ลบไม่สำเร็จ",
                                buttons: [
                                    {
                                        label: "ตกลง"
                                    }
                                ]
                            });
                        })
                    })
                },
                {
                    label: "ไม่ใช่"
                },
            ]
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25, Key, year } = this.state;
        const temp_year = parseInt(year, 10);
        if (this.props.status === 'edit') {
            Firebase.firestore().collection('CDATAS').doc(Key).update({
                ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25,
                title_id: this.props.title_id, year: temp_year,
                num_id: this.props.num_id,
            }).then((doc) => {
                this.props.back();
            }).catch((error) => {
                console.log(error)
            })
        } else {
            Firebase.firestore().collection('CDATAS').add({
                ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25,
                title_id: this.props.title_id, year: temp_year,
                num_id: this.props.num_id,
            }).then((doc) => {
                this.props.back();
            }).catch((error) => {
                console.log(error)
            })
        }

    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    render() {
        const { ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25, year } = this.state;
        return (
            <div>
                <center><h1>{data[this.props.title_id][this.props.num_id][0]}</h1></center>
                <form onSubmit={this.onSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">ปี พ.ศ.: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="year" value={year} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">อายุต่ำกว่า 15 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="ly15" value={ly15} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">16 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y16" value={y16} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">17 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y17" value={y17} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">18 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y18" value={y18} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">19 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y19" value={y19} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">20 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y20" value={y20} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">21 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y21" value={y21} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">22 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y22" value={y22} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">23 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y23" value={y23} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">24 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y24" value={y24} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="4">25 ปี: <label style={{ color: "red" }}>*</label></Form.Label>
                        <Col>
                            <input type="number" className="form-control" name="y25" value={y25} onChange={this.onChange} required />
                        </Col>
                    </Form.Group>
                    <center>
                        <button type="submit" className="btn btn-success">บันทึก</button>
                        <button type="button" className="btn btn-danger" onClick={this.deleteData.bind(this, this.props.id)}>ลบ</button>
                        <button type="button" className="btn btn-danger" onClick={() => this.props.back()}>กลับ</button>

                    </center>
                </form>
            </div>
        )
    }
}

export default Add_cdata
