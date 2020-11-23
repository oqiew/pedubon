import React, { Component } from 'react'
import Topnav from '../../components/top/Topnav'
import Firebase from '../../Firebase';
import { Form, Input, Button, Checkbox, Table, Tag, Space } from 'antd';
import {
    VerticalAlignBottomOutlined
} from '@ant-design/icons';
export class AdminCheck extends Component {
    constructor(props) {
        super(props);
        this.tbFileCheck = Firebase.firestore().collection('FILECHECKS');
        this.state = {
            listChecked: []
        }
    }
    componentDidMount() {
        this.tbFileCheck.where('status_type', '==', 3).onSnapshot(this.getListFileCheck)
    }
    getListFileCheck = (querySnapshot) => {
        const listChecked = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
            listChecked.push({
                id: doc.id,
                key: count++,
                title: doc.data().title,
                sname: doc.data().sname,
                semail: doc.data().semail,
                cname: doc.data().cname,
                cemail: doc.data().cemail,
                status: [doc.data().status],
                urlPdf: doc.data().urlPdf,
                comment: [doc.data().comment],
                status_type: doc.data().status_type,
                version_file: doc.data().version_file,

            })
        })
        this.setState({
            listChecked,
        })
    }
    render() {
        const columns = [
            {
                title: 'หัวข้อ',
                dataIndex: 'title',
                key: 'title',
                width: 300,
            },
            {
                title: 'ดาวน์โหลด',
                dataIndex: 'title',
                key: 'title',
                width: 50,
                render: (text, record) =>
                    <a href={record.urlPdf}><VerticalAlignBottomOutlined /></a>

            },
            {
                title: 'ผู้ส่ง',
                dataIndex: 'sname',
                key: 'sname',
                width: 100,
            },
            {
                title: 'ผู้ส่ง',
                dataIndex: 'semail',
                key: 'semail',
                width: 100,
            },
            {
                title: 'ส่งถึง',
                dataIndex: 'cname',
                key: 'cname',
                width: 100,
            },
            {
                title: 'ส่งถึง ',
                dataIndex: 'cemail',
                key: 'cemail',
                width: 100,
            },
            {
                title: 'สถานะ',
                key: 'status',
                dataIndex: 'status',
                width: 100,
                render: status => (
                    <>
                        {status.map(tag => {
                            let color = 'geekblue';//pending
                            if (tag === 'reject') {
                                color = 'volcano';
                            } else if (tag === 'approved') {
                                color = 'green';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </>
                ),
            },
        ]
        return (
            <center>
                <Topnav></Topnav>
                <div style={{ marginTop: 100 }}     >
                    <h1 style={{ marginBottom: 30 }}>ตรวจสอบเอกสาร</h1>
                    <div style={{ width: '70%', minWidth: 400 }}>
                        <Table columns={columns} dataSource={this.state.listChecked} />
                    </div>
                </div>
            </center >
        )
    }
}

export default AdminCheck

