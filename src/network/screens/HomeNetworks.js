import React, { Component } from 'react'
import '../../css/main.css'
import TopBar from '../topBar/TopBar'
import Firebase from '../../Firebase'
import { fetch_user_network } from '../../actions'
import { connect } from 'react-redux'
import { tableName } from '../database/TableName'
import Loading from '../../components/Loading'
import { isEmptyValue } from '../../components/Methods'
export class HomeNetworks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this.tbUserNetwork = Firebase.firestore().collection(tableName.UserNetwork);

    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.tbUserNetwork.doc(user.uid).get().then((doc) => {
                    if (isEmptyValue(doc.data())) {
                        this.props.fetch_user_network({
                            uid: user.uid,
                        })
                        this.setState({
                            loading: false
                        })
                    } else {
                        console.log('profile', doc.data())
                        this.props.fetch_user_network({
                            uid: user.uid,
                            ...doc.data()
                        })
                        this.setState({
                            loading: false
                        })
                    }

                }).catch((error) => {
                    this.props.fetch_user_network({})
                    console.log(error)
                    this.setState({
                        loading: false
                    })
                })
            } else {
                this.props.fetch_user_network({})
                this.setState({
                    loading: false
                })
            }
        })
    }
    render() {
        if (this.state.loading) {
            return (
                <Loading></Loading>
            )
        } else {
            return (
                <div>
                    <TopBar {...this.props} ></TopBar>
                    <div className="content">
                        <h1 style={{ textAlign: 'center' }}>ระบบข้อมูลเครือข่ายงานด้านเด็กและเยาวชน จังหวัดอุบลราชธานี</h1>
                    </div>
                </div>
            )
        }

    }
}

//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user_network
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeNetworks);