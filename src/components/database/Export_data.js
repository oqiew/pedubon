import React, { Component } from 'react';

import ReactExport from "react-export-excel";
import Firebase from '../../Firebase';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
export class Export_data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            List_user: [],
        }
    }
    componentDidMount() {
        Firebase.firestore().collection('communityCalendars').onSnapshot(this.ListUsers);
    }
    ListCollection = (querySnapshot) => {
        console.log(querySnapshot.size);
    }
    ListUsers = (querySnapshot) => {
        const List_user = [];
        querySnapshot.forEach(doc => {
            // const { title, name, lname, userPosition, address, district, tumbon, provice,
            //     phone, email, typeUser, department } = doc.data();
            List_user.push({
                // title, name, lname, userPosition, address, district, tumbon, provice,
                // phone, email, typeUser, department,
                Key: doc.id,
                ...doc.data()

            });
        });
        this.setState({
            List_user
        })
    }
    render() {

        return (

            <ExcelFile>
                <ExcelSheet data={this.state.List_user} name="รายชื่อคนที่ทำงานด้านเด็ก">
                    <ExcelColumn label="Key" value="Key" />
                    <ExcelColumn label="บ้านไอดี" value="banID" />
                    <ExcelColumn label="เดือน1" value="m1" />
                    <ExcelColumn label="เดือน2" value="m2" />
                    <ExcelColumn label="ชื่อ" value="nameActivity" />
                    <ExcelColumn label="ประเภท" value="typeActivity" />
                    <ExcelColumn label="คนเพิ่ม" value="userAddID" />
                    {/* calendar
                    <ExcelColumn label="Key" value="Key" />
                    <ExcelColumn label="บ้านไอดี" value="banID" />
                    <ExcelColumn label="เดือน1" value="m1" />
                    <ExcelColumn label="เดือน2" value="m2" />
                    <ExcelColumn label="ชื่อ" value="nameActivity" />
                    <ExcelColumn label="ประเภท" value="typeActivity" />
                    <ExcelColumn label="คนเพิ่ม" value="userAddID" /> */}


                    {/* bans
                    <ExcelColumn label="Key" value="Key" />
                    <ExcelColumn label="อำเภอ" value="district" />
                    <ExcelColumn label="อปท" value="local" />
                    <ExcelColumn label="บ้าน" value="nameBan" /> */}


                    {/* user
                    <ExcelColumn label="ไอดี" value="Key" />
                    <ExcelColumn label="คำนำหน้า" value="title" />
                    <ExcelColumn label="ชื่อ" value="name" />
                    <ExcelColumn label="นามสกุล" value="lname" />
                    <ExcelColumn label="ปรเภทผู้ใช้" value="typeUser" />
                    <ExcelColumn label="ตำแหน่ง" value="userPosition" />
                    <ExcelColumn label="หน่วยงาน" value="department" />
                    <ExcelColumn label="ทีอยู่" value="address" />
                    <ExcelColumn label="ตำบล" value="tumbon" />
                    <ExcelColumn label="อำเภแ" value="district" />
                    <ExcelColumn label="จังหวัด" value="provice" />
                    <ExcelColumn label="อีเมล" value="email" />
                    <ExcelColumn label="โทรศัพท์" value="phone" />*/}
                </ExcelSheet>

            </ExcelFile>
        )
    }
}

export default Export_data
