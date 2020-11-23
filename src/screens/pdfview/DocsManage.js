import React, { Component } from 'react'
import Topnav from '../../components/top/Topnav'
import Firebase from '../../Firebase';
import { Form, Input, Button, Checkbox, Table, Tag, Space } from 'antd';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import {
    SnippetsOutlined
} from '@ant-design/icons';
import emailjs from 'emailjs-com';
//เหลือ เพิ่ม เลขเวอชั่น สำหรับ sort เพิ่ม link email ให้ถูกต้อง https://pedubon-2020.firebaseapp.com/
export class DocsManage extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            statusPage: 'login',
            isuploaded: false,
            massage: '',
            sname: '',
            semail: '',
            listFiles: [],
            title: '',
            urlPdf: '',
            // 
            editData: '',
            // viewHistory
            viewData: '',
            listHistoty: [],

        }
    }
    handleChangeUsername = event =>
        this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ progress: 0, urlPdf: 'กำลังอัพโหลด...' });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isuploaded: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        this.setState({ progress: 100, isuploaded: true });
        Firebase
            .storage()
            .ref("Files")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({
                urlPdf: url,
                massage: <h6 style={{ color: 'green' }}>อัพโหลดไฟล์สำเร็จ</h6>
            }));
    };

    onLogin(data) {
        this.setState({
            sname: data.user.sname,
            semail: data.user.semail,
            statusPage: 'addfile'
        })
        Firebase.firestore().collection("FILECHECKS")
            .where('sname', '==', data.user.sname)
            .where('semail', '==', data.user.semail)
            .orderBy('status_type', 'asc')
            .onSnapshot(this.getListfile)
    }

    getListfile = (querySnapshot) => {
        const listFiles = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
            listFiles.push({
                id: doc.id,
                key: count++,
                title: doc.data().title,
                sname: doc.data().sname,
                cname: doc.data().cname,
                cemail: doc.data().cemail,
                status: [doc.data().status],
                urlPdf: doc.data().urlPdf,
                comment: [doc.data().comment],
                version_file: doc.data().version_file

            })
        })
        this.setState({
            listFiles
        })
    }
    getListHistory = (querySnapshot) => {
        const listHistoty = [];
        let count = 0;
        querySnapshot.forEach((doc) => {
            const { fileid,
                editData,
                comment,
                status,
                date,
                version,
                action } = doc.data();
            const d = new Date(date.seconds * 1000)
            const temp_time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            const temp_data = d.getDate() + "/" + (parseInt(d.getMonth(), 10) + 1) + "/" + d.getFullYear();
            listHistoty.push({
                id: doc.id,
                key: count++,
                fileid,
                comment,
                status: [status],
                date: temp_data,
                time: temp_time,
                action,
                editData,
                version
            })
        })
        this.setState({
            listHistoty
        })
    }
    onDelete(id, urlPdf) {
        Firebase.firestore().collection("FILEHISTORYS")
            .where('fileid', '==', id)
            .onSnapshot(this.subDelete);
        var desertRef = Firebase.storage().refFromURL(urlPdf);
        desertRef.delete().then(function () {
            console.log("delete image sucess");
        }).catch(function (error) {
            console.log("image No such document! can't delete");
        });
        Firebase.firestore().collection("FILECHECKS").doc(id).delete().then(() => {
            console.log('Delete suceess')
        }).catch((error) => {
            console.log('Delete error', error)
        })
    }
    subDelete = (querySnapshot) => {
        querySnapshot.forEach((docResult) => {
            Firebase.firestore().collection("FILEHISTORYS").doc(docResult.id).delete().then(() => {
                console.log('subDelete suceess')
            }).catch((error) => {
                console.log('subDelete error', error)
            })
        })
    }
    sendEmail(data) {
        console.log(data)
        emailjs.send("service_0dgoa8c", "template_qof710h", data, 'user_55SugxbIeWQIOFgHWxK3k').then((result) => {
            console.log('sendEmail sucess', result.text);
        }, (error) => {
            console.log('sendEmail error', error.text);
        });
    }
    onSave(data) {
        const { sname, semail, urlPdf, editData } = this.state;
        let save = true;

        if (this.state.isuploaded) {
            if (semail !== data.user.cemail) {
                if (editData !== '') {
                    Firebase.firestore().collection("FILECHECKS").doc(editData.id).update({
                        update_date: new Date(),
                        status: 'pending',
                        status_type: 2,
                        comment: '',
                        version_file: (parseInt(editData.version_file, 10) + 1)
                    }).then(() => {
                        const temp_data = {
                            to_email: editData.cemail,
                            to_name: editData.cname,
                            form_email: semail,
                            form_name: sname,
                            title: editData.title,
                            link: 'https://pedubon-2020.firebaseapp.com/checker/' + editData.cemail,


                        }
                        console.log(temp_data,)
                        this.sendEmail(temp_data, editData.cemail);
                        console.log("update success")

                    }).catch((error) => [
                        console.log("update error", error)
                    ])
                    Firebase.firestore().collection("FILEHISTORYS").add({
                        fileid: editData.id,
                        comment: '',
                        status: 'pending',
                        date: new Date(),
                        action: 'อัพเดต',
                        version: (parseInt(editData.version_file, 10) + 1)
                    }).then(() => {
                        Firebase.firestore().collection("FILECHECKS").where('sname', '==', sname)
                            .where('semail', '==', semail)
                            .orderBy('status_type', 'asc')
                            .onSnapshot(this.getListfile)
                        console.log("success")
                        this.formRef.current.resetFields()
                        this.setState({
                            massage: <h6 style={{ color: 'green' }}>บันทึกสำเร็จ</h6>,
                            editData: '',
                            title: '',
                            urlPdf: ''
                        })
                    }).catch((error) => [
                        console.log("update error", error)
                    ])
                } else {
                    this.state.listFiles.forEach((element) => {
                        if (element.title === data.user.title || element.title === editData.title) {
                            save = false;
                        }
                    })
                    if (save) {
                        Firebase.firestore().collection("FILECHECKS").add({
                            sname, semail, ...data.user, urlPdf,
                            create_date: new Date(),
                            update_date: new Date(),
                            status: 'pending',
                            status_type: 2,
                            comment: '',
                            version_file: 1,
                        }).then((result) => {

                            Firebase.firestore().collection("FILEHISTORYS").add({
                                version: 1,
                                fileid: result.id,
                                comment: '',
                                status: 'pending',
                                date: new Date(),
                                action: 'เพิ่ม'
                            }).then(() => {
                                Firebase.firestore().collection("FILECHECKS").where('sname', '==', sname)
                                    .where('semail', '==', semail)
                                    .orderBy('status_type', 'asc')
                                    .onSnapshot(this.getListfile)
                                console.log("success")
                                const temp_data = {
                                    to_email: data.user.cemail,
                                    to_name: data.user.cname,
                                    form_email: semail,
                                    form_name: sname,
                                    title: data.user.title,
                                    link: 'https://pedubon-2020.firebaseapp.com/checker/' + data.user.cemail,

                                }
                                this.sendEmail(temp_data);
                                this.formRef.current.resetFields()
                                this.setState({
                                    massage: <h6 style={{ color: 'green' }}>บันทึกสำเร็จ</h6>,
                                    title: '',
                                    urlPdf: ''
                                })
                            }).catch((error) => [
                                console.log("error", error)
                            ])

                        }).catch((error) => {
                            console.log("error", error)
                        })
                    } else {
                        this.setState({
                            massage: <h6 style={{ color: 'red' }}>ชื่อหัวข้อนี้มีแล้ว กรุณาเปลี่ยนชื่อหัวข้อ</h6>
                        })
                    }
                }

            } else {
                this.setState({
                    massage: <h6 style={{ color: 'red' }}>email ตรงกัน {semail}={data.user.cemail}</h6>
                })
            }
        } else {
            if (editData !== '') {
                this.setState({
                    massage: <h6 style={{ color: 'red' }}>คุณยังไม่ได้อัพโหลดไฟล์ใหม่</h6>
                })
            } else {
                this.setState({
                    massage: <h6 style={{ color: 'red' }}>คุณยังไม่ได้อัพโหลดไฟล์</h6>
                })
            }

        }


    }
    onEdit(data) {
        this.setState({
            editData: data, urlPdf: data.urlPdf, title: data.title,
        })
        // console.log(this.formRef.current.getFieldsValue())
        this.formRef.current.setFieldsValue({
            user: { title: data.title, cname: data.cname, cemail: data.cemail },

        })
    }
    onView(data) {
        this.setState({
            viewData: data, urlPdf: data.urlPdf, title: data.title,
        })
        // console.log(this.formRef.current.getFieldsValue())
        Firebase.firestore().collection("FILEHISTORYS")
            .where('fileid', '==', data.id)
            .orderBy('version', 'desc')
            .onSnapshot(this.getListHistory)
        this.formRef.current.setFieldsValue({
            user: { title: data.title, cname: data.cname, cemail: data.cemail },

        })

    }
    onClear = () => {
        this.setState({
            viewData: '',
            massage: '',
            title: '',
            urlPdf: ''
        })
        this.formRef.current.resetFields();
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
                render: (text, record) => <span style={{ cursor: 'pointer' }} onClick={this.onView.bind(this, record)}>
                    <SnippetsOutlined style={{ fontSize: 20, color: '#007bff' }} />
                    <a >{text}</a></span>,
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
                title: 'ความคิดเห็น',
                dataIndex: 'comment',
                key: 'comment',
                width: 200,
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
                        <a style={{ color: "green" }} onClick={this.onEdit.bind(this, record)}>แก้ไข</a>
                        <a href={record.urlPdf}>ดาวน์โหลด</a>
                        <a style={{ color: "red" }} onClick={this.onDelete.bind(this, record.id, record.urlPdf)}>ลบ</a>
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
                    {this.state.statusPage === 'addfile' &&
                        <>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>

                                <p>{this.state.sname} : {this.state.semail}</p>
                            </Form.Item>
                            <Form {...layout} name="nest-messages" onFinish={(data) => this.onSave(data)} ref={this.formRef} validateMessages={validateMessages}>
                                <Form.Item name={['user', 'title']} label="หัวข้อ" rules={[{ required: true }]}>
                                    <Input onKeyUp={(str) => this.setState({ title: str.target.value })} disabled={(this.state.editData !== '' || this.state.viewData !== '')} />
                                </Form.Item>
                                <Form.Item name={['user', 'cname']} label="ชื่อผู้ตรวจสอบ" rules={[{ required: true }]}>
                                    <Input disabled={(this.state.editData !== '' || this.state.viewData !== '')} />
                                </Form.Item>
                                <Form.Item name={['user', 'cemail']} label="Email ผู้ตรวจสอบ" rules={[{ type: 'email', required: true }]}>
                                    <Input disabled={(this.state.editData !== '' || this.state.viewData !== '')} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                    {this.state.title !== '' &&
                                        <CustomUploadButton
                                            accept="application/pdf"
                                            filename={this.state.title + "" + cdate}
                                            storageRef={Firebase.storage().ref('Files')}
                                            onUploadStart={this.handleUploadStart}
                                            onUploadError={this.handleUploadError}
                                            onUploadSuccess={this.handleUploadSuccess}
                                            onProgress={this.handleProgress}
                                        // style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, width: 85, height: 35.3666 }}
                                        >

                                            <div type="button" className="btn btn-info"> เลือกไฟล์</div>
                                        </CustomUploadButton>
                                    }
                                </Form.Item>
                                {this.state.viewData === '' &&
                                    <div>
                                        {this.state.urlPdf}
                                    </div>
                                }
                                {this.state.massage !== '' && this.state.massage}
                                {this.state.viewData === '' ?
                                    <>
                                        {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                            <Button type="primary" htmlType="button" onClick={this.onClear.bind(this)} danger>
                                                กลับ </Button>
                                        </Form.Item> */}
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                            <Button type="primary" htmlType="submit">
                                                บันทึก </Button>
                                        </Form.Item></>
                                    :
                                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                        <Button type="primary" htmlType="button" onClick={this.onClear.bind(this)} danger>
                                            กลับ </Button>
                                    </Form.Item>
                                }
                                <div style={{ width: '70%', minWidth: 400 }}>
                                    {this.state.viewData !== '' ?
                                        <Table columns={columns2} dataSource={this.state.listHistoty} />
                                        : <Table columns={columns} dataSource={this.state.listFiles} />}

                                </div>


                            </Form>
                        </>
                    }
                    {this.state.statusPage === 'login' &&
                        <Form {...layout} name="nest-messages" onFinish={(data) => this.onLogin(data)} validateMessages={validateMessages}>

                            <Form.Item name={['user', 'sname']} label="ชื่อ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name={['user', 'semail']} label="Email" rules={[{ type: 'email', required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    ถัดไป </Button>

                            </Form.Item>

                        </Form>
                    }


                </div>
            </center>
        )
    }
}

export default DocsManage
