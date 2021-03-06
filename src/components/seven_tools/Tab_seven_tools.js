import React, { Component } from 'react'
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default class Tab_seven_tools extends Component {
    render() {
        return (
            <Row style={{ justifyContent: 'center' }}>
                <Link to={'/main_seven_tools'} className="btn btn-info">แผนที่เดินดิน</Link>
                <Link to={'/orgs'} className="btn btn-info">แผนผังองค์กร</Link>
                <Link to={'/health_systems'} className="btn btn-info">ระบบสุขภาพชุมชน</Link>
                <Link to={'/local_calendars'} className="btn btn-info">ปฏิทินชุมชน</Link>
                <Link to={'/local_historys'} className="btn btn-info">ประวัติศาสตร์ชุมชน</Link>
                <Link to={'/persons'} className="btn btn-info">ประวัติบุคคลสำคัญ</Link>
                <Link to={'/select_local'} className="btn btn-danger">กลับหน้า</Link>
            </Row>
        )
    }
}
