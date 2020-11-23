import React, { Component } from 'react'
import Topnav from '../../components/top/Topnav'
import { Form, Input, Button, Checkbox, Table, Tag, Space } from 'antd';
import Firebase from '../../Firebase';
import {
    SnippetsOutlined
} from '@ant-design/icons';
import emailjs from 'emailjs-com';
export class Checker extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.tbFileCheck = Firebase.firestore().collection('FILECHECKS');
        this.tbFileHistory = Firebase.firestore().collection('FILEHISTORYS');
        this.state = {
            stausPage: 'login',
            cname: '',
            cemail: '',
            listFileCheck: [],
            listFileCheckHistory: [],
            viewData: '',
            urlPdf: '',
            comment: ''
        }

    }
    componentDidMount() {
        if (this.props.match.params.email !== undefined) {
            this.setState({
                cemail: this.props.match.params.email,
                stausPage: 'logied'
            })

            this.tbFileCheck.where('cemail', '==', this.props.match.params.email)
                .where('status_type', '>=', 2)
                .orderBy('status_type', 'asc')
                .onSnapshot(this.getListFileCheck)
        }

    }
    getListFileCheck = (querySnapshot) => {
        const listFileCheck = [];
        let cname = '';
        let count = 0;
        querySnapshot.forEach((doc) => {
            cname = doc.data().cname;
            listFileCheck.push({
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
            listFileCheck,
            cname
        })
    }
    getListFileHistory = (querySnapshot) => {
        const listFileCheckHistory = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
            const { fileid,
                comment,
                status,
                date,
                version,
                action } = doc.data();
            const d = new Date(date.seconds * 1000)
            const temp_time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            const temp_data = d.getDate() + "/" + (parseInt(d.getMonth(), 10) + 1) + "/" + d.getFullYear();
            listFileCheckHistory.push({
                id: doc.id,
                key: count++,
                fileid,
                comment,
                status: [status],
                version,
                date: temp_data,
                time: temp_time,
                action
            })
        })
        this.setState({
            listFileCheckHistory,
        })
    }
    onLogin(data) {
        this.setState({
            cemail: data.user.cemail,
            stausPage: 'logied'
        })
        this.tbFileCheck.where('cemail', '==', this.props.match.params.email)
            .where('status_type', '>=', 2)
            .orderBy('status_type', 'asc')
            .onSnapshot(this.getListfile)
    }
    onView(data) {
        this.setState({
            viewData: data, urlPdf: data.urlPdf,
        })
        // console.log(this.formRef.current.getFieldsValue())
        this.tbFileHistory.where('fileid', '==', data.id)
            .where('fileid', '==', data.id)
            .orderBy('version', 'desc')
            .onSnapshot(this.getListFileHistory)
        this.formRef.current.setFieldsValue({
            user: { title: data.title, sname: data.sname, semail: data.semail },

        })
    }
    onClear() {
        this.setState({
            viewData: '', urlPdf: '',
        })
    }
    sendEmail(data) {
        console.log(data);
        emailjs.send("service_0dgoa8c", "template_h4g3ns8", data, 'user_55SugxbIeWQIOFgHWxK3k').then((result) => {
            console.log('sendEmail sucess', result.text);
        }, (error) => {
            console.log('sendEmail error', error.text);
        });
    }
    onSubmit = (action) => {
        const { comment, viewData } = this.state;
        let status_type = 1;
        if (action === 'approved') {
            status_type = 3;
        }
        if (viewData !== '') {
            this.tbFileCheck.doc(this.state.viewData.id).update({
                update_date: new Date(),
                status: action,
                status_type,
                comment,
                version_file: (parseInt(viewData.version_file, 10) + 1)
            }).then(() => {
                const temp_data = {
                    to_semail: viewData.semail,
                    to_sname: viewData.sname,
                    form_cemail: viewData.form_cemail,
                    form_cname: viewData.form_cname,
                    title: viewData.title,
                    link: 'https://pedubon-2020.firebaseapp.com/docsManage'

                }
                this.sendEmail(temp_data);
                console.log("update success")
                this.tbFileHistory.add({
                    fileid: viewData.id,
                    comment,
                    status: action,
                    date: new Date(),
                    action: 'อัพเดต',
                    version: (parseInt(viewData.version_file, 10) + 1)
                }).then(() => {
                    this.tbFileCheck.where('cemail', '==', this.props.match.params.email)
                        .where('status_type', '>=', 2)
                        .orderBy('status_type', 'asc')
                        .onSnapshot(this.getListFileCheck)
                    this.setState({
                        viewData: '',
                        urlPdf: '',
                    })
                    console.log("update history success")
                }).catch((error) => [
                    console.log("update history error", error)
                ])

            }).catch((error) => [
                console.log("update error", error)
            ])


        }
    }
    render() {
        const d = new Date();
        const cdate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        const validateMessages = {
            required: '${label} is required!',
            types: {
                email: '${label} is not validate email!',
                number: '${label} is not a validate number!',
            },
            number: {
                range: '${label} must be between ${min} and ${max}',
            },
        };
        const columns = [
            {
                title: 'หัวข้อ',
                dataIndex: 'title',
                key: 'title',
                width: 300,
            },

            {
                title: 'ผู้ส่ง',
                dataIndex: 'sname',
                key: 'sname',
                width: 100,
            },
            {
                title: 'email ผู้ส่ง',
                dataIndex: 'semail',
                key: 'semail',
                width: 150,
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
            {
                title: 'Action',
                key: 'action',
                width: 150,
                render: (text, record) => (
                    <Space size="middle">
                        {/* <a>Invite {record.name}</a> */}
                        <a style={{ color: "green" }} onClick={this.onView.bind(this, record)}>ตรวจสอบ</a>
                    </Space>
                ),
            },
        ];
        const columns2 = [
            {
                title: 'รุ่น',
                dataIndex: 'version',
                key: 'version',
                width: 50,

            },
            {
                title: 'วันที่',
                dataIndex: 'date',
                key: 'date',
                width: 150,

            },
            {
                title: 'เวลา',
                dataIndex: 'time',
                key: 'time',
                width: 150,

            },
            {
                title: 'ความคิดเห็น',
                dataIndex: 'comment',
                key: 'comment',
                width: 150,
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
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                width: 200,
            },

        ];

        return (
            <center>
                <Topnav></Topnav>
                <div style={{ marginTop: 100 }}     >
                    <h1 style={{ marginBottom: 30 }}>ตรวจสอบเอกสาร</h1>
                    {this.state.stausPage === 'login' ?
                        <Form {...layout} name="nest-messages" onFinish={(data) => this.onLogin(data)} validateMessages={validateMessages}>

                            <Form.Item name={['user', 'cemail']} label="Email" rules={[{ type: 'email', required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    ถัดไป </Button>
                            </Form.Item>

                        </Form>
                        : <div>
                            <p>{this.state.cname} : {this.state.cemail}</p>

                            <Form {...layout} name="nest-messages" ref={this.formRef} validateMessages={validateMessages}>
                                {this.state.viewData !== '' &&
                                    <>
                                        <Form.Item name={['user', 'title']} label="หัวข้อ" rules={[{ required: true }]}>
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item name={['user', 'sname']} label="ชื่อผู้ส่งตรวจ" rules={[{ required: true }]}>
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item name={['user', 'semail']} label="Email ผู้ส่งตรวจ" rules={[{ type: 'email', required: true }]}>
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item label="ความคิดเห็น">
                                            <Input.TextArea onKeyUp={(str) => this.setState({ comment: str.target.value })} />
                                        </Form.Item>

                                        <Form.Item label="ไฟล์งาน" >
                                            <a href={this.state.urlPdf}>ดาวน์โหลด</a>
                                        </Form.Item>

                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                            <Button type="primary" htmlType="button" onClick={this.onSubmit.bind(this, "approved")}>
                                                อนุมัติ </Button>
                                            <Button type="primary" htmlType="button" danger onClick={this.onSubmit.bind(this, "reject")}>
                                                ปฏเสธ </Button>
                                            <Button type="primary" htmlType="button" danger onClick={this.onClear.bind(this)}>
                                                กลับ </Button>
                                        </Form.Item></>}

                            </Form>

                            <div style={{ width: '70%', minWidth: 400 }}>
                                {this.state.viewData !== '' ?
                                    <Table columns={columns2} dataSource={this.state.listFileCheckHistory} />
                                    : <Table columns={columns} dataSource={this.state.listFileCheck} />}

                            </div>

                        </div>}
                </div>
            </center>
        )
    }
}

export default Checker
