import { Col } from 'react-bootstrap'
import React, { Component } from 'react';

import './App.css';
import logo4ctped from './assets/4ctped.png';
import silc from './assets/SILC-LOGO.png';
import sss from './assets/sss.png';
import Topnav from './components/top/Topnav'
import pencil from './assets/pencil.png'
import bg from './assets/bg-color.jpg'
import { connect } from 'react-redux';
import Spin from './components/Spin';
import Store from './Store';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      User: [], loading: false
    }
    Store.subscribe(() => {
      this.setState({
        User: Store.getState().User,
        loading: false
      })
    });

  }
  render() {
    if (this.state.loading) {
      return (<Spin></Spin>)
    } else {
      return (
        <center className='bg' style={{ backgroundImage: `url(${bg})` }}>
          <Topnav user={this.state.User}></Topnav>
          <div className="project_detail" >
            <img src={pencil} className="support_logo" alt="logo1"></img>
            <h1>
              <strong>โครงการสร้างเสริมสุชภาวะเด็กและเยาวชน จังหวัดอุบลราชธานี</strong>

            </h1>
            <hr style={{ width: '70%' }}></hr>


          </div>
          <div className="footer">
            <Col>
              <img src={logo4ctped} className="support_logo" alt="logo1"></img>
            </Col>
            <Col>
              <img src={sss} className="support_logo" alt="logo1"></img>
            </Col>
            <Col>
              <img src={silc} style={{ width: '40%' }} alt="logo1"></img>
            </Col>
          </div>
        </center>
      );
    }
  }

}

export default connect()(App);
