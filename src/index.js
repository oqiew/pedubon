import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//data
import Export_data from './components/database/Export_data';
//province data
import Province_datas from "./components/Province_datas/Province_datas";

//login
import Login from './components/login/Login';
import Register from './components/login/Register';
import Register_email from './components/login/Register_email';

//seven tools
import Select_local from './components/seven_tools/Select_local';
// children data
import Children_data from './components/children/Children_data'

import Main_seven_tools from './components/seven_tools/Main_seven_tools';//แผนที่เดินดิน ดี เสี่ยง อุบัติเหตุ
import Select_tools from './components/seven_tools/Select_tools';
import Select_ban from './components/seven_tools/Select_ban';
import Orgs from './components/seven_tools/Orgs';
import Health_systems from './components/seven_tools/Health_systems';
import Local_calendars from './components/seven_tools/Local_calendars';
import Local_historys from './components/seven_tools/Local_historys';
import Person_historys from './components/seven_tools/Person_historys';
import Persons from './components/seven_tools/Persons';
//system data
import Import_data from './system_data/Import_data';
// user
import Profile from './components/user/Profile';
import List_user from './components/user/List_user';
import Store from './Store';

import { Provider, } from 'react-redux';
import Firebase from './firebase'



//cunnet reducer




//call reducer check type 




// let store = createStore(
//     allReducers,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
// let store = createStore(couter);
// store.subscribe(() => console.log(store.getState()));
// console.log('start');

Firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const User_ID = user.uid;
        const Email = user.email;
        Firebase.firestore().collection('USERS').doc(user.uid).get().then((doc) => {

            const { Name, Last_name, Nickname, Sex, Phone_number,
                Line_ID, Facebook, Birthday, Position, Department,
                Province_ID, District_ID, umbon_ID, Email, Avatar_URL,
                Add_date, Area_ID, Role, User_type_ID } = doc.data();
            const state = {
                User_ID,
                Email,
                Name, Last_name, Nickname, Sex, Phone_number,
                Line_ID, Facebook, Birthday, Position, Department,
                Province_ID, District_ID, umbon_ID, Email, Avatar_URL,
                Add_date, Area_ID, Role, User_type_ID
            }
            Store.dispatch({
                type: 'SetUser',
                state
            })

        }).catch((error) => {
            // Firebase.auth().signOut().then(response => {
            //     console.log("log out success");
            // });
        })

    }
})

ReactDOM.render(


    <Provider store={Store}>
        <Router>
            <div>
                <Route exact path='/' component={App} />
                {/* province data */}
                <Route path='/province_datas' component={Province_datas} />
                {/* login */}
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <Route path='/register_email' component={Register_email} />

                <Route path='/import_data' component={Import_data} />
                {/* user */}
                <Route path='/profile' component={Profile} />
                <Route path='/list_user' component={List_user} />
                {/* seven tool */}
                <Route path='/select_local' component={Select_local} />
                <Route path='/select_tools' component={Select_tools} />
                <Route path='/main_seven_tools' component={Main_seven_tools} />
                <Route path='/select_ban/:id' component={Select_ban} />
                <Route path='/orgs' component={Orgs} />
                <Route path='/health_systems' component={Health_systems} />
                <Route path='/local_calendars' component={Local_calendars} />
                <Route path='/local_historys' component={Local_historys} />
                <Route path='/person_historys/:id/:Pname' component={Person_historys} />
                <Route path='/persons' component={Persons} />
                {/* children_data */}
                <Route path='/children_data' component={Children_data} />
                {/* data */}
                <Route path='/export_data' component={Export_data} />




            </div>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);

serviceWorker.unregister();
