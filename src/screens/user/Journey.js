import React, { Component } from 'react'
import Loading from '../../components/Loading'
import { Form, Col, Row, Button, Table } from 'react-bootstrap';
import Firebase from '../../Firebase';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import Topnav from '../../components/top/Topnav';
import { tableName } from '../../database/TableConstant';
import { isEmptyValue } from '../../components/Methods';
import { routeName } from '../../route/RouteConstant';
export class Journey extends Component {
    constructor(props) {
        super(props);
        this.tbJourney = Firebase.firestore().collection(tableName.Journey);
        this.state = {
            ...this.props.fetchReducer.user,
            loading: false,
            select_number: '',
            q1: ["ท่านเข้าใจปัญหาชุมชนมากน้อยเพียงใด", "ท่านรู้แนวทางแก้ไขปัญหาในชุมชนมากน้อยเพียงใด"],
            q2: ["ท่านมีความคิดสร้างสรรค์มากน้อยเพียงใด",
                "ท่านมีความกล้าแสดงออกมากน้อยเพียงใด",
                "ท่านมีแนวคิดหรือวิธีการใหม่ๆในการแก้ปัญหามากน้อยเพียงใด"],
            q3: ["ท่ท่านสามารถพัฒนาตนเองมากน้อยเพียงใด",
                "ท่านสามารถมองเห็นปัญหาและปัญญาจากต้นทุนของชุมชนและนำปัญหาหรือปัญญานั้นมาพัฒนาเป็นแนวคิดหรือวิธีการใหม่ๆ",
                "ท่านสามารถเป็นแบบอย่างให้เพื่อนในทางที่ดีมากน้อยเพียงใด",
                "ท่านคิดว่าตัวท่านกล้าคิด กล้าทำ กล้าตัดสินใจมากน้อยเพียงใด"],
            c1: [],
            c2: [],
            c3: [],
            C1: [],
            C2: [],
            C3: [],
            statusJ1: false,
            statusJ2: false,
        }
    }
    componentDidMount() {
        this.tbJourney.where('uid', '==', this.state.uid).onSnapshot(this.getJourney);
        this.setQuestions();
    }
    getJourney = (querySnapshot) => {
        let statusJ1 = false;
        let statusJ2 = false;
        querySnapshot.forEach((doc) => {
            const { C1, C2, C3, Time } = doc.data();
            if (Time === 'ก่อนเข้าร่วมกิจกรรม') {
                statusJ1 = true
            } else if (Time === 'หลังร่วมกิจกรรม') {
                statusJ2 = true
            }
        })
        this.setState({
            statusJ1, statusJ2
        })
    }
    onSave = (e) => {
        e.preventDefault();
        const { C1, C2, C3, select_number, uid } = this.state;
        this.tbJourney.add({
            uid, Create_date: Firebase.firestore.Timestamp.now(),
            Time: select_number, C1, C2, C3,

        }).then(() => {
            console.log('sucess')
            this.props.history.push(routeName.Profile)
        }).catch((error) => {
            console.log('error', error)
        })
    }
    setQuestions() {
        const c1 = [];
        const c2 = [];
        const c3 = [];
        let index1 = 1;
        let index2 = 1;
        let index3 = 1;
        this.state.q1.forEach((doc) => {
            c1.push(
                <tr key={index1}>
                    <td>
                        {index1}
                    </td>
                    <td>
                        {doc}
                    </td>
                    <td>
                        <input required type="radio" name={"C1" + index1} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index1, 10) - 1, '1')} />
                    </td>
                    <td>
                        <input type="radio" name={"C1" + index1} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index1, 10) - 1, '2')} />
                    </td>
                    <td>
                        <input type="radio" name={"C1" + index1} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index1, 10) - 1, '3')} />
                    </td>
                    <td>
                        <input type="radio" name={"C1" + index1} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index1, 10) - 1, '4')} />
                    </td>
                    <td>
                        <input type="radio" name={"C1" + index1} style={{ margin: 5 }} onChange={this.ans1.bind(this, parseInt(index1, 10) - 1, '5')} />
                    </td>

                </tr>
            )
            index1++
        })
        this.state.q2.forEach((doc) => {
            c2.push(
                <tr key={index2}>
                    <td>
                        {index2}
                    </td>
                    <td>
                        {doc}
                    </td>
                    <td>
                        <input required type="radio" name={"C2" + index2} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index2, 10) - 1, '1')} />
                    </td>
                    <td>
                        <input type="radio" name={"C2" + index2} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index2, 10) - 1, '2')} />
                    </td>
                    <td>
                        <input type="radio" name={"C2" + index2} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index2, 10) - 1, '3')} />
                    </td>
                    <td>
                        <input type="radio" name={"C2" + index2} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index2, 10) - 1, '4')} />
                    </td>
                    <td>
                        <input type="radio" name={"C2" + index2} style={{ margin: 5 }} onChange={this.ans2.bind(this, parseInt(index2, 10) - 1, '5')} />
                    </td>

                </tr>
            )
            index2++
        })
        this.state.q3.forEach((doc) => {
            c3.push(
                <tr key={index3}>
                    <td>
                        {index3}
                    </td>
                    <td>
                        {doc}
                    </td>
                    <td>
                        <input required type="radio" name={"C3" + index3} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index3, 10) - 1, '1')} />
                    </td>
                    <td>
                        <input type="radio" name={"C3" + index3} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index3, 10) - 1, '2')} />
                    </td>
                    <td>
                        <input type="radio" name={"C3" + index3} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index3, 10) - 1, '3')} />
                    </td>
                    <td>
                        <input type="radio" name={"C3" + index3} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index3, 10) - 1, '4')} />
                    </td>
                    <td>
                        <input type="radio" name={"C3" + index3} style={{ margin: 5 }} onChange={this.ans3.bind(this, parseInt(index3, 10) - 1, '5')} />
                    </td>

                </tr>
            )
            index3++
        })
        this.setState({
            c1, c2, c3
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
    ans2(id, value) {
        let C2 = this.state.C2;
        C2[id] = value;
        console.log(id, '=', value);
        this.setState({
            C2
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
        const { select_number, statusJ1, statusJ2, } = this.state;
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
                                    {statusJ1 === false ? <Button variant="primary"
                                        onClick={() => this.setState({
                                            select_number: 'ก่อนเข้าร่วมกิจกรรม'
                                        })}>ก่อนเข้าร่วมกิจกรรม</Button> :
                                        statusJ1 === true && statusJ2 === false ?
                                            <Button variant="primary" onClick={() => this.setState({
                                                select_number: 'หลังร่วมกิจกรรม'
                                            })}>หลังร่วมกิจกรรม</Button>
                                            : <h3>ท่านเก็บข้อมูล Journey เสร็จแล้ว</h3>}
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