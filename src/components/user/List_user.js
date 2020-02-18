
import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact';
import "react-datepicker/dist/react-datepicker.css"

import firebase from '../../firebase';
import { GetTypeUser } from '../methods';
import Topnav from '../top/Topnav';

import '../../App.css';


export class List_user extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = firebase.firestore().collection('USERS');
        this.tbProvinces = firebase.firestore().collection('PROVINCES');
        this.tbDistricts = firebase.firestore().collection('DISTRICTS');
        this.tbTumbons = firebase.firestore().collection('TUMBONS');
        this.state = {

            //input data profile
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',

            //get name form id
            Province: '', District: '', Tumbon: '', User_type: '',

            Provinces: [],
            Districts: [],
            Tumbons: [],
            User_types: GetTypeUser(),

            List_users: [],
            SUser_type_ID: '',


        }
    }
    getProvinces = (querySnapshot) => {
        const Provinces = [];
        querySnapshot.forEach(doc => {
            const { Name, } = doc.data();

            Provinces.push({
                Key: doc.id,
                Name,
            });

        });

        this.setState({
            Provinces
        })
    }
    getDistricts = (querySnapshot) => {
        const Districts = [];
        querySnapshot.forEach(doc => {
            const { Name, } = doc.data();

            Districts.push({
                Key: doc.id,
                Name,
            });

        });

        this.setState({
            Districts
        })
    }
    getTumbons = (querySnapshot) => {
        const Tumbons = [];
        querySnapshot.forEach(doc => {
            const { Name } = doc.data();

            Tumbons.push({
                Key: doc.id,
                Name: Name,
            });

        });

        this.setState({
            Tumbons
        })
    }
    checkName(name, id) {
        var result = '';
        if (name === "p") {
            this.state.Provinces.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "d") {
            this.state.Districts.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "t") {
            this.state.Tumbons.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        } else if (name === "u") {
            this.state.User_types.forEach(element => {
                if (element.Key === id) {
                    result = element.Name;
                }
            });
        }
        return result;
    }
    getUser(id) {

        firebase.firestore().collection('USERS').doc(id).get().then((doc) => {
            if (doc.exists) {
                const { Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,

                } = doc.data()
                const User_type = this.checkName('u', User_type_ID);
                const Province = this.checkName('p', Province_ID);
                const District = this.checkName('d', District_ID);
                const Tumbon = this.checkName('t', Tumbon_ID);
                var d1 = new Date(Birthday.seconds * 1000);
                let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                this.setState({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday: bd, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,
                    Province, District, Tumbon, User_type

                })
            }
        }
        );
    }
    getUsers = (querySnapshot) => {

        const List_users = [];
        let count = 1;
        querySnapshot.forEach(doc => {
            const { Name, Last_name, Nickname,
                Position, Department,
                District_ID, Tumbon_ID, Avatar_URL,
                User_type_ID, } = doc.data();
            // console.log(User_type_ID);
            const User_type = this.checkName('u', User_type_ID);
            // const Province = this.checkName('p', Province_ID);
            const District = this.checkName('d', District_ID);
            const Tumbon = this.checkName('t', Tumbon_ID);
            // var d1 = new Date(Birthday.seconds * 1000);
            // let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();    
            List_users.push({
                number: count++,
                Avatar_URL: <img style={{ widtha: 50, height: 50, cursor: 'pointer' }} alt="avatar" src={Avatar_URL}></img>,
                Name: Name + " " + Last_name + "(" + Nickname + ")",
                User_type,
                work: Position + ":" + Department,
                District, Tumbon,
            });

        });

        this.setState({
            List_users
        })
    }

    authListener() {
        this.unsubscribe = this.tbProvinces.onSnapshot(this.getProvinces);
        this.unsubscribe = this.tbDistricts.onSnapshot(this.getDistricts);
        this.unsubscribe = this.tbTumbons.onSnapshot(this.getTumbons);
        this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    statusLogin: true,
                    authEmail: user.email,
                    User_ID: user.uid,
                });

                this.getUser(user.uid);

            } else {
                this.setState({ statusLogin: false, authEmail: '' });
            }
        });
    }
    selectDate = date => {

        this.setState({
            Birthday: date,
        });
    };
    componentDidMount() {
        this.authListener();
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

        if (this.state.SUser_type_ID === '') {

            this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
        } else {
            // console.log(this.state.SUser_type_ID);
            const ref = firebase.firestore().collection('USERS').where('User_type_ID', '==', this.state.SUser_type_ID);
            this.unsubscribe = ref.onSnapshot(this.getUsers);
        }
    }
    render() {
        const data = {
            columns: [
                {
                    label: '#',
                    field: 'number',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'รูป',
                    field: 'Avatar_URL',
                    sort: 'asc',
                    width: 50
                },
                {
                    label: 'ชื่อ',
                    field: '์Name',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'หน้าที่',
                    field: 'User_type',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'ตำแหน่ง : หน่วยงาน',
                    field: 'work',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'อำเภอ',
                    field: 'District',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'ตำบล',
                    field: 'Tumbon',
                    sort: 'asc',
                    width: 150
                },


            ],
            rows: this.state.List_users

        };
        const { SUser_type_ID, User_types } = this.state;
        return (
            <div>
                <Topnav></Topnav>
                <div className='main_component'>
                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> */}
                    <center>
                        <h5>ทำเนียบด้านเด็กและเยาวชน จังหวัดอุบลราชธานี
                                </h5>
                        <br></br>
                        <select className="form-control" id="sel1" name="SUser_type_ID" value={SUser_type_ID} onChange={this.onChange} required>
                            <option value="">ทั้งหมด</option>
                            {User_types.map((data, i) =>
                                <option key={i + 1} value={data.Key}>{data.Name}</option>
                            )}
                        </select>

                    </center>
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
                    {/* </div> */}


                </div>
            </div>
        )
    }
}

export default List_user
