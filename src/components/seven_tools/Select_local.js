import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from "react-router-dom";
import Topnav from '../top/Topnav';
import '../../App.css';
export class Select_local extends Component {
    constructor(props) {
        super(props);
        this.tbLGOs = firebase.firestore().collection('LGOS');
        this.state = {
            //input data profile
            Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
            Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
            Province_ID: '', District_ID: '', Tumbon_ID: '', Email: '', Avatar_URL: '',
            Add_date: '', Area_ID: '', Role: '', User_type_ID: '',
            User_ID: '',

            ban: '',
            LGOs: [],

            step_ban: false,

        }


    }

    componentDidMount() {
        this.unsubscribe = this.tbLGOs.onSnapshot(this.getLGOs);
        this.authListener();

    }
    getLGOs = (querySnapshot) => {
        const LGOs = [];
        querySnapshot.forEach(doc => {
            const { Name, Type } = doc.data();

            LGOs.push({
                Key: doc.id,
                Name: Type + Name,
            });

        });

        this.setState({
            LGOs
        })
    }
    checkName(name, id) {
        var result = '';
        if (name === "l") {
            this.state.LGOs.forEach(element => {
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

                } = doc.data();
                var d1 = new Date(Birthday.seconds * 1000);
                let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                if (Area_ID !== '') {
                    firebase.firestore().collection('BANS').doc(Area_ID).get().then((doc) => {
                        if (doc.exists) {
                            const { Name, LGO_ID } = doc.data();
                            this.setState({
                                ban: this.checkName('l', LGO_ID) + " บ้าน " + Name
                            })


                        }
                    })
                }



                this.setState({
                    Name, Last_name, Nickname, Sex, Phone_number,
                    Line_ID, Facebook, Birthday: bd, Position, Department,
                    Province_ID, District_ID, Tumbon_ID, Email, Avatar_URL,
                    Add_date, Area_ID, Role, User_type_ID,

                })
            }
        }
        );
    }


    authListener() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    statusLogin: true,
                    authEmail: user.email,
                    User_ID: user.uid,
                });

                this.getUser(user.uid);

            } else {
                this.props.history.push('/');
            }
        });


    }

    render() {
        const { ban, } = this.state;
        return (
            <div>
                <Topnav></Topnav>
                <div className="main_component">
                    <center>
                        {ban !== '' ?
                            <h2><strong>{ban}</strong> </h2>
                            :
                            <h2><strong>กรุณาเลือกหมู่บ้านที่ทำการสำรวจ</strong> </h2>
                        }

                        <hr></hr>

                        {ban !== '' ?
                            <Link className="btn btn-success" to="/main_seven_tools">เปิดเครื่องมือ</Link>
                            :
                            <div></div>
                        }
                        <Link className="btn btn-success" to={`/select_ban/${this.state.User_ID}`}>เลือกหมู่บ้าน</Link>
                        <hr></hr>
                    </center>

                </div >
            </div >


        );
    }
}

export default Select_local






