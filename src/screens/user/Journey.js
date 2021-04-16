import React, { Component } from 'react'
import Loading from '../../components/Loading'
import { Form, Col, Row, Button } from 'react-bootstrap';
import Firebase from '../../Firebase';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import Topnav from '../../components/top/Topnav';
import { tableName } from '../../database/TableConstant';
import { Table } from 'react-bootstrap';
import { isEmptyValue } from '../../components/Methods';
import { routeName } from '../../route/RouteConstant';
export class Journey extends Component {
    constructor(props) {
        super(props);
        this.tbIIndicators = Firebase.firestore().collection(tableName.Indicators);
        this.tbJourney = Firebase.firestore().collection(tableName.Journey);
        this.tbJourneyUser = Firebase.firestore().collection(tableName.Journey_users);
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            select_number: '',
            c1: [],
            c2: [],
            c3: [],
            journey: [],
            C1: [],
            C2: [],
            C3: [],
            J1: "",
            J2: "",
            J3: "",
            J4: "",
        }
    }
    componentDidMount() {
        this.tbJourney.where('Name', '==', '4ctped').onSnapshot(this.getJourney)
        this.tbIIndicators.where('n', '==', 'c1').onSnapshot(this.getC1)
        this.tbIIndicators.where('n', '==', 'c2').onSnapshot(this.getC2)
        this.tbIIndicators.where('n', '==', 'c3').onSnapshot(this.getC3)
    }
    onSave = (e) => {
        e.preventDefault();
        const { C1, C2, C3, select_number, J1, J2, J3, J4, uid } = this.state;
        this.tbJourneyUser.add({
            uid, Create_date: Firebase.firestore.Timestamp.now(),
            time: select_number, C1, C2, C3, J1, J2, J3, J4

        }).then(() => {
            console.log('sucess')
            this.props.history.push(routeName.Profile)
        }).catch((error) => {
            console.log('error', error)
        })
    }
    getJourney = (query) => {
        const journey = [];

        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                journey.push(
                    doc
                )
            })
        });
        this.setState({
            journey
        })
    }
    getC1 = (query) => {
        const c1 = [];
        let index = 1;
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c1.push(
                    <tr key={index}>
                        <td>
                            {index}
                        </td>
                        <td>
                            {doc}
                        </td>
                        <td>
                            <input required type="radio" name={"C1" + index} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index, 10) - 1, '1')} />
                        </td>
                        <td>
                            <input type="radio" name={"C1" + index} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index, 10) - 1, '2')} />
                        </td>
                        <td>
                            <input type="radio" name={"C1" + index} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index, 10) - 1, '3')} />
                        </td>
                        <td>
                            <input type="radio" name={"C1" + index} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index, 10) - 1, '4')} />
                        </td>
                        <td>
                            <input type="radio" name={"C1" + index} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index, 10) - 1, '5')} />
                        </td>

                    </tr>
                )
                index++
            })

        });
        this.setState({
            c1
        })
    }
    ans1(id, value) {
        let C1 = this.state.C1;
        C1[id] = value;
        console.log(id, '=', value);
        this.setState({
            C1
        })

    }
    getC2 = (query) => {
        const c2 = [];
        let index = 1;
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c2.push(
                    <tr key={index}>
                        <td>
                            {index}
                        </td>
                        <td>
                            {doc}
                        </td>
                        <td>
                            <input required type="radio" name={"C2" + index} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index, 10) - 1, '1')} />
                        </td>
                        <td>
                            <input type="radio" name={"C2" + index} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index, 10) - 1, '2')} />
                        </td>
                        <td>
                            <input type="radio" name={"C2" + index} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index, 10) - 1, '3')} />
                        </td>
                        <td>
                            <input type="radio" name={"C2" + index} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index, 10) - 1, '4')} />
                        </td>
                        <td>
                            <input type="radio" name={"C2" + index} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index, 10) - 1, '5')} />
                        </td>

                    </tr>
                )
                index++
            })
        });
        this.setState({
            c2
        })
    }
    ans2(id, value) {
        let C2 = this.state.C2;
        C2[id] = value;
        console.log(id, '=', value);
        this.setState({
            C2
        })

    }
    getC3 = (query) => {
        const c3 = [];
        let index = 1;
        query.forEach(element => {
            const { Question } = element.data();
            Question.forEach((doc) => {
                c3.push(
                    <tr key={index}>
                        <td>
                            {index}
                        </td>
                        <td>
                            {doc}
                        </td>
                        <td>
                            <input required type="radio" name={"C3" + index} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index, 10) - 1, '1')} />
                        </td>
                        <td>
                            <input type="radio" name={"C3" + index} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index, 10) - 1, '2')} />
                        </td>
                        <td>
                            <input type="radio" name={"C3" + index} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index, 10) - 1, '3')} />
                        </td>
                        <td>
                            <input type="radio" name={"C3" + index} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index, 10) - 1, '4')} />
                        </td>
                        <td>
                            <input type="radio" name={"C3" + index} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index, 10) - 1, '5')} />
                        </td>

                    </tr>
                )
                index++
            })
        });
        this.setState({
            c3
        })
    }
    ans3(id, value) {
        let C3 = this.state.C3;
        C3[id] = value;
        console.log(id, '=', value);
        this.setState({
            C3
        })

    }
    onCancel = () => {
        this.setState({
            select_number: ''
        })

    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }
    render() {
        const { power, select_number, J1, J2, J3, J4 } = this.state;
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <div>
                    <Topnav user={this.state.User}></Topnav>
                    <div className='main_component'>
                        <center>
                            <h1>Journey</h1>
                            <hr></hr>
                            {isEmptyValue(select_number) ?
                                <>
                                    <Button variant="primary"
                                        onClick={() => this.setState({
                                            select_number: 'ก่อนเข้าร่วมกิจกรรม'
                                        })}>ก่อนเข้าร่วมกิจกรรม</Button>
                                    <Button variant="primary" onClick={() => this.setState({
                                        select_number: 'ระหว่างร่วมกิจกรรม'
                                    })}>ระหว่างร่วมกิจกรรม</Button>
                                    <Button variant="primary" onClick={() => this.setState({
                                        select_number: 'หลังร่วมกิจกรรม'
                                    })}>หลังร่วมกิจกรรม</Button>
                                </>
                                : <>
                                    <h1>{select_number}</h1>
                                    <Button variant="danger" onClick={() => this.setState({
                                        select_number: ''
                                    })}>ยกเลิก</Button>
                                </>}
                            <hr></hr>
                            {!isEmptyValue(select_number) && <form onSubmit={this.onSave}>
                                <Table striped bordered hover size="sm" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th rowSpan="2" style={{ verticalAlign: 'top' }}>ข้อ</th>
                                            <th rowSpan="2" style={{ verticalAlign: 'top', textAlign: 'center' }}>ประเมินพลัง</th>
                                            <th colSpan="5">ระดับ</th>
                                        </tr>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>1</th>
                                            <th style={{ textAlign: 'center' }}>2</th>
                                            <th style={{ textAlign: 'center' }}>3</th>
                                            <th style={{ textAlign: 'center' }}>4</th>
                                            <th style={{ textAlign: 'center' }}>5</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={101}>
                                            <td></td>
                                            <td><strong>Care for Community </strong></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        {this.state.c1}
                                        <tr key={102}>
                                            <td></td>
                                            <td><strong>Creativity</strong></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        {this.state.c2}
                                        <tr key={103}>
                                            <td></td>
                                            <td><strong>Chang – agent </strong></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        {this.state.c3}
                                    </tbody>
                                </Table>
                                <div style={{ marginBottom: 10 }}>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">ความรู้ที่ได้รับ: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <textarea className="form-control" name="J1" value={J1} onChange={this.onChange}
                                                cols="80" rows="5" required>{J1}</textarea>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">ความเข้าใจต่อเนื้อหาสาระ ของกิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <textarea className="form-control" name="J2" value={J2} onChange={this.onChange}
                                                cols="80" rows="5" required>{J2}</textarea>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">ทักษะที่เกิดขึ้น: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <textarea className="form-control" name="J3" value={J3} onChange={this.onChange}
                                                cols="80" rows="5" required>{J3}</textarea>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2">ทัศนคติ มุมมองต่อเรื่องที่เรียนรู้ ผ่านกิจกรรม: <label style={{ color: "red" }}>*</label></Form.Label>
                                        <Col>
                                            <textarea className="form-control" name="J4" value={J4} onChange={this.onChange}
                                                cols="80" rows="5" required>{J4}</textarea>
                                        </Col>
                                    </Form.Group>
                                </div>
                                <center >
                                    <button type="submit" className="btn btn-success">บันทึก</button>
                                    <Button variant="danger" onClick={() => this.setState({
                                        select_number: ''
                                    })}>ยกเลิก</Button>
                                </center>
                            </form>}
                        </center>
                    </div>
                </div>
            )
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

export default connect(mapStateToProps, mapDispatchToProps)(Journey);