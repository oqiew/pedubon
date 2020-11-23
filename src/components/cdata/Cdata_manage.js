import React, { Component } from 'react';
import Topnav from '../top/Topnav';
import light from '../../assets/light.png';
import social from '../../assets/social.png';
import heart from '../../assets/heart.png';
import body from '../../assets/body.png';
import { Col, Row } from 'react-bootstrap';
import data from './data.json'
import Add_cdata from './Add_cdata';
import { isEmptyValue } from '../Methods';
import Firebase from '../../Firebase';
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import { confirmAlert } from 'react-confirm-alert'; // Import
export class Cdata_manage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 1,
            add_id: '',
            title_id: '',
            selected_data: [],
            view: false,
            ...this.props.fetchReducer.user,
            action: 'null',
            edit_id: ''
        }
    }
    onSelect(id) {
        if (id === 1) {
            this.setState({
                selected: 1,
                title_id: '', add_id: '', view: false, action: 'null'
            })
        } else if (id === 2) {
            this.setState({
                selected: 2,
                title_id: '', add_id: '', view: false, action: 'null'
            })
        } else if (id === 3) {
            this.setState({
                selected: 3,
                title_id: '', add_id: '', view: false, action: 'null'
            })
        } else if (id === 4) {
            this.setState({
                selected: 4,
                title_id: '', add_id: '', view: false, action: 'null'
            })
        }
    }
    show_detail(id, id2) {
        Firebase.firestore().collection('CDATAS').where('num_id', '==', id2).where('title_id', '==', id).onSnapshot(this.list_view_cdata)
        this.setState({
            view: true,
            title_id: id,
            add_id: id2,
        })

    }
    list_view_cdata = (querySnapshot) => {
        const selected_data = []
        if (querySnapshot.size !== 0) {
            querySnapshot.forEach(doc => {
                selected_data.push({ Key: doc.id, ...doc.data() })
            });
        }
        this.setState({
            selected_data
        })
    }
    back = () => {
        this.setState({
            title_id: '',
            selected: 1,
            add_id: '',
            view: false,
            selected_data: []
        })
    }
    add_action(id, id2) {
        this.setState({
            title_id: id,
            add_id: id2,
            view: false,
            action: 'add'
        })
    }
    edit_action(id, id2, edit_id) {
        this.setState({
            title_id: id,
            add_id: id2,
            view: false,
            action: 'edit',
            edit_id: edit_id
        })
    }

    render() {
        const { selected, view, title_id, add_id, selected_data, Role } = this.state;

        return (
            <center>
                <Topnav></Topnav>
                <div className="area_detail">
                    <Row>
                        <Col onClick={this.onSelect.bind(this, 1)}>
                            <img alt="body" src={body} style={{ width: 100, height: 100, cursor: 'pointer' }}
                            ></img>

                            {selected === 1 ?
                                <div style={{ borderStyle: 'solid', borderColor: '#ff0000', borderRadius: 20 }}>
                                    <h3>กาย</h3>
                                </div>
                                : <h3>กาย</h3>}

                        </Col>
                        <Col>
                            <img alt="heart" src={heart} style={{ width: 100, height: 100, cursor: 'pointer' }}
                                onClick={this.onSelect.bind(this, 2)}></img>
                            {selected === 2 ?
                                <div style={{ borderStyle: 'solid', borderColor: '#ff0000', borderRadius: 20 }}>
                                    <h3>ใจ  </h3>
                                </div>
                                : <h3>ใจ</h3>}
                        </Col>
                        <Col>
                            <img alt="light" src={light} style={{ width: 100, height: 100, cursor: 'pointer' }}
                                onClick={this.onSelect.bind(this, 3)}></img>

                            {selected === 3 ?
                                <div style={{ borderStyle: 'solid', borderColor: '#ff0000', borderRadius: 20 }}>
                                    <h3>ปัญญา</h3>
                                </div>
                                : <h3>ปัญญา</h3>}
                        </Col>
                        <Col>
                            <img alt="social" src={social} style={{ width: 100, height: 100, cursor: 'pointer' }}
                                onClick={this.onSelect.bind(this, 4)}></img>

                            {selected === 4 ?
                                <div style={{ borderStyle: 'solid', borderColor: '#ff0000', borderRadius: 20 }}>
                                    <h3>สังคม</h3>
                                </div>
                                : <h3>สังคม</h3>}
                        </Col>
                    </Row>
                    <hr></hr>
                    <Row>
                        {selected === 1 && !view && isEmptyValue(add_id) &&
                            data[0].map((element, i) =>
                                <div key={i} style={{ width: '100%' }}>
                                    <Row style={{ width: '100%' }}>
                                        <div style={{ width: '60%' }}>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>{element[0]}</p>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>ที่มา:<a href={element[2]} target="_blank"> {element[2]}</a></p>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            <button type="button" className="btn btn-success" onClick={this.show_detail.bind(this, 0, element[1])}>เปิดข้อมูล</button>
                                            {Role === "admin" && <button type="button" className="btn btn-success" onClick={this.add_action.bind(this, 0, element[1])}>เพิ่มข้อมูล</button>}
                                        </div>
                                    </Row>
                                    <hr></hr>
                                </div>
                            )
                        }
                        {selected === 2 && !view && isEmptyValue(add_id) &&
                            data[1].map((element, i) =>
                                <div key={i} style={{ width: '100%' }}>
                                    <Row style={{ width: '100%' }}>
                                        <div style={{ width: '60%' }}>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>{element[0]}</p>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>ที่มา: {element[2]}</p>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            <button type="button" className="btn btn-success" onClick={this.show_detail.bind(this, 1, element[1])}>เปิดข้อมูล</button>
                                            {Role === "admin" && <button type="button" className="btn btn-success" onClick={this.add_action.bind(this, 1, element[1])}>เพิ่มข้อมูล</button>}
                                        </div>

                                    </Row>
                                    <hr></hr>
                                </div>
                            )
                        }
                        {selected === 3 && !view && isEmptyValue(add_id) &&
                            data[2].map((element, i) =>
                                <div key={i} style={{ width: '100%' }}>
                                    <Row style={{ width: '100%' }}>
                                        <div style={{ width: '60%' }}>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>{element[0]}</p>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>ที่มา: {element[2]}</p>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            <button type="button" className="btn btn-success" onClick={this.show_detail.bind(this, 2, element[1])}>เปิดข้อมูล</button>
                                            {Role === "admin" && <button type="button" className="btn btn-success" onClick={this.add_action.bind(this, 2, element[1])}>เพิ่มข้อมูล</button>}
                                        </div>

                                    </Row>
                                    <hr></hr>
                                </div>
                            )
                        }
                        {selected === 4 && !view && isEmptyValue(add_id) &&
                            data[3].map((element, i) =>
                                <div key={i} style={{ width: '100%' }}>
                                    <Row style={{ width: '100%' }}>
                                        <div style={{ width: '60%' }}>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>{element[0]}</p>
                                            <p style={{ textAlign: 'left', marginLeft: 30 }}>ที่มา: {element[2]}</p>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            <button type="button" className="btn btn-success" onClick={this.show_detail.bind(this, 3, element[1])}>เปิดข้อมูล</button>
                                            {Role === "admin" && <button type="button" className="btn btn-success" onClick={this.add_action.bind(this, 3, element[1])}>เพิ่มข้อมูล</button>}
                                        </div>

                                    </Row>
                                    <hr></hr>
                                </div>
                            )
                        }
                        {view &&
                            <div style={{ width: '100%' }}>
                                <Row style={{ justifyContent: 'center' }}><h3 >{data[title_id][(add_id - 1)][0]} </h3></Row>
                                <Row style={{ justifyContent: 'center' }}>
                                    <button style={{ right: 0 }} className="btn btn-danger" onClick={() => this.setState({ title_id: '', add_id: '', view: false, action: 'null' })}>กลับ</button>
                                </Row>
                                <hr></hr>
                                <Row>
                                    <Col>พ.ศ.</Col>
                                    <Col>ต่ำกว่า {'\n'}15 ปี</Col>
                                    <Col>16 ปี</Col>
                                    <Col>17 ปี</Col>
                                    <Col>18 ปี</Col>
                                    <Col>19 ปี</Col>
                                    <Col>20 ปี</Col>
                                    <Col>21 ปี</Col>
                                    <Col>22 ปี</Col>
                                    <Col>23 ปี</Col>
                                    <Col>24 ปี</Col>
                                    <Col>25 ปี</Col>
                                    <Col>แก้ไข</Col>
                                </Row>
                                <hr></hr>
                                {selected_data.map((element, i) =>
                                    <Row key={i}>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.year}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.ly15}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y16}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y17}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y18}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y19}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y20}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y21}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y22}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y23}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y24}</Col>
                                        <Col style={{ display: "grid", alignItems: 'center' }}>{element.y25}</Col>
                                        {this.state.Role === 'admin' && <Col><button type="button" className="btn btn-success"
                                            onClick={this.edit_action.bind(this, element.title_id, element.num_id, element.Key)}>
                                            แก้ไข</button></Col>}
                                    </Row>
                                )}
                            </div>

                        }
                        {!isEmptyValue(add_id) && !view &&
                            <div style={{ width: '100%' }}>
                                <Add_cdata title_id={this.state.title_id} num_id={this.state.add_id} status={this.state.action}
                                    id={this.state.edit_id} back={this.back}></Add_cdata>
                            </div>
                        }
                    </Row>
                </div >
            </center >
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

export default connect(mapStateToProps, mapDispatchToProps)(Cdata_manage);
