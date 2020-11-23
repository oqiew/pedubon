import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';
// page
import Home from "./components/Home";
//data
import Export_data from "./components/database/Export_data";
//province data
import Province_datas from "./components/Province_datas/Province_datas";

//login
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import Register_email from "./components/login/Register_email";

// children data
import Children_data from "./components/children/Children_data";
//seven tools
import Select_local from "./components/seven_tools/Select_local";
import Main_seven_tools from "./components/seven_tools/Main_seven_tools"; //แผนที่เดินดิน ดี เสี่ยง อุบัติเหตุ
import Select_tools from "./components/seven_tools/Select_tools";
import Select_ban from "./components/seven_tools/Select_ban";
import Orgs from "./components/seven_tools/Orgs";
import Health_systems from "./components/seven_tools/Health_systems";
import Local_calendars from "./components/seven_tools/Local_calendars";
import Local_historys from "./components/seven_tools/Local_historys";
import Person_historys from "./components/seven_tools/Person_historys";
import Persons from "./components/seven_tools/Persons";
// import Activity_local from "./components/seven_tools/Activity_local";
//system data
import Import_data from "./system_data/Import_data";
// user
import Profile from "./components/user/Profile";
import List_user from "./components/user/List_user";
import View_User from "./components/user/View_User";

// org
// import  Map_all  from "./components/admin/Map_all";
import Orgc_manage from "./components/org/Orgc_manage";

//area
import Area from "./components/area/Area";
import Area_public from "./components/area/Area_public";
import Activity from "./components/area/Activity";
import Activity_manage from "./components/area/Activity_manage";
import Project_manage from "./components/area/Project_manage";
import Course from "./components/area/Course";
import Course_manage from "./components/area/Course_manage";
import Projects from "./components/area/Projects";
import Orgcs from "./components/org/Orgcs";
import Data_area from "./components/area/Data_area";




// admin
import Import_user from "./screens/admin/Import_user";

// ประเด็นข้อมูล
import Cdata_manage from "./components/cdata/Cdata_manage";
import DocsManage from "./screens/pdfview/DocsManage";
import Checker from "./screens/pdfview/Checker";
import AdminCheck from "./screens/pdfview/AdminCheck";
// coach
import Coach from "./screens/coach/Coach";





export class App extends Component {
  render() {
    return (

      <Router>
        {/* <Switch> */}
        <Route exact path="/" component={Home}></Route>
        {/* province data */}
        <Route path="/province_datas" component={Province_datas}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
        <Route path="/register_email" component={Register_email}></Route>

        <Route path="/import_data" component={Import_data}></Route>
        {/* user */}
        <Route path="/profile" component={Profile}></Route>
        <Route path="/list_user" component={List_user}></Route>
        <Route path="/view_User" component={View_User}></Route>
        {/* seven tool */}
        <Route path="/select_local" component={Select_local}></Route>
        <Route path="/select_tools" component={Select_tools}></Route>
        <Route path="/main_seven_tools" component={Main_seven_tools}></Route>
        <Route path="/select_ban" component={Select_ban}></Route>
        <Route path="/orgs" component={Orgs}></Route>
        <Route path="/health_systems" component={Health_systems}></Route>
        <Route path="/local_calendars" component={Local_calendars}></Route>
        <Route path="/local_historys" component={Local_historys}></Route>
        <Route path="/person_historys/:id/:Pname" component={Person_historys}></Route>
        <Route path="/persons" component={Persons}></Route>
        {/* children_data */}
        <Route path="/children_data" component={Children_data}></Route>
        {/* data */}
        {/* <Route path="/export_data" component={Export_data}></Route> */}
        {/* admin */}
        <Route path="/import_user" component={Import_user}></Route>
        {/* <Route path="/map_all" component={Map_all}></Route> */}
        <Route path="/orgc_manage" component={Orgc_manage}></Route>
        <Route path="/orgcs" component={Orgcs}></Route>
        {/* area */}
        <Route path="/area" component={Area}></Route>
        <Route path="/area_public" component={Area_public}></Route>
        <Route path="/activity" component={Activity}></Route>
        <Route path="/activity_manage/:id" component={Activity_manage}></Route>
        <Route path="/project_manage/:id" component={Project_manage}></Route>
        <Route path="/course" component={Course}></Route>
        <Route path="/course_manage/:id" component={Course_manage}></Route>
        <Route path="/Projects" component={Projects}></Route>
        <Route path="/cdata_manage" component={Cdata_manage}></Route>
        <Route path="/docsManage" component={DocsManage}></Route>
        <Route path="/checker/:email" component={Checker}></Route>
        <Route path="/adminCheck" component={AdminCheck}></Route>
        <Route path="/data_area/:area_id" component={Data_area}></Route>

        {/* coach */}
        <Route path="/coach" component={Coach}></Route>
        {/* </Switch> */}
      </Router>
    );
  }
}

export default App;




