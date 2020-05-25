import React, { Component } from 'react'
import { MDBDataTable } from "mdbreact";
import Firebase from '../../Firebase';
import Topnav from '../top/Topnav';

export class Course extends Component {
    constructor(props) {
        super(props);
        this.tbCourse = Firebase.firestore().collection('COURSES');
        this.state = {
            list_course: []
        }
    }
    componentDidMount() {
        this.tbCourse.onSnapshot(this.get_list_course);
    }
    get_list_course = (querySnapshot) => {
        const list_course = []
        querySnapshot.forEach((doc) => {
            list_course.push({
                ...doc.data(), ID: doc.id,
                Dominance: doc.data().Area_local_dominance + doc.data().Area_local_name,
                Area_type: doc.data().Area_local_type,
                Link_download: (<a style={{ color: 'blue' }} href={doc.data().File_URL}
                >ดาวโหลด</a>)
            })
        })
        this.setState({
            list_course
        })
    }


    render() {
        const data = {
            columns: [
                {
                    label: "บทเรียน",
                    field: "Course_name",
                    sort: "asc"
                },
                {
                    label: "อปท.",
                    field: "Dominance",
                    sort: "asc"
                },
                {
                    label: "พื้นที่",
                    field: "Area_type",
                    sort: "asc"
                },
                {
                    label: "ดาวโหลดน์",
                    field: "Link_download",
                    sort: "asc"
                },

            ],
            rows: this.state.list_course
        };
        return (
            <center>
                <Topnav></Topnav>
                <div className="area_detail">
                    <MDBDataTable
                        striped
                        bordered
                        small
                        searchLabel="ค้นหา"
                        paginationLabel={["ก่อนหน้า", "ถัดไป"]}
                        infoLabel={["แสดง", "ถึง", "จาก", "รายการ"]}
                        entriesLabel="แสดง รายการ"
                        data={data}
                    />
                </div>
            </center>
        )
    }
}

export default Course
