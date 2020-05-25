import React, { Component } from 'react'
import { Form, Col, Row } from 'react-bootstrap';
import Firebase from '../../Firebase';
import data from './data.json';
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
            upadate: false
        }

    }
    componentDidMount() {
        Firebase.firestore().collection('CDATAS')
            .where('title_id', '==', this.props.title_id)
            .where('num_id', '==', this.props.num_id)
            .onSnapshot(this.list_cdata);
    }
    list_cdata = (querySnapshot) => {
        let ly15 = 0;
        let y16 = 0;
        let y17 = 0;
        let y18 = 0;
        let y19 = 0;
        let y20 = 0;
        let y21 = 0;
        let y22 = 0;
        let y23 = 0;
        let y24 = 0;
        let y25 = 0;
        let Key = '';
        if (querySnapshot.size !== 0) {
            querySnapshot.forEach(doc => {
                Key = doc.id;
                ly15 = doc.data().ly15;
                y16 = doc.data().y16;
                y17 = doc.data().y17;
                y18 = doc.data().y18;
                y19 = doc.data().y19;
                y20 = doc.data().y20;
                y21 = doc.data().y21;
                y22 = doc.data().y22;
                y23 = doc.data().y23;
                y24 = doc.data().y24;
                y25 = doc.data().y25;
            });
            this.setState({
                ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25, update: true, Key
            })
        }

    }
    onSubmit = (e) => {
        e.preventDefault();
        const { ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25, Key, update } = this.state;
        if (update) {
            Firebase.firestore().collection('CDATAS').doc(Key).update({
                ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25,
                title_id: this.props.title_id,
                num_id: this.props.num_id,
            }).then((doc) => {
                this.props.back();
            }).catch((error) => {
                console.log(error)
            })
        } else {
            Firebase.firestore().collection('CDATAS').add({
                ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25,
                title_id: this.props.title_id,
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
        const { ly15, y16, y17, y18, y19, y20, y21, y22, y23, y24, y25, } = this.state;
        return (
            <div>
                <center><h1>{data[this.props.title_id][this.props.num_id][0]}</h1></center>
                <form onSubmit={this.onSubmit}>
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
                        <button type="button" className="btn btn-danger" onClick={() => this.props.back()}>กลับ</button>

                    </center>
                </form>
            </div>
        )
    }
}

export default Add_cdata
