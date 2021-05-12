import React, { Component } from 'react'
import { fetch_user } from "../../actions";
import { connect } from "react-redux";
import Topnav from '../../components/top/Topnav'
import Firebase from '../../Firebase';
import data_provinces from "../../data/provinces.json";
import { tableName } from '../../database/TableConstant';
import { isEmptyValue } from '../../components/Methods';

export class import_sm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.fetchReducer.user,
            old_sm: [],
            query_areas: [],

        }
    }
    componentDidMount() {
        Firebase.firestore().collection(tableName.Areas).onSnapshot(this.onUpdateAreas);
        Firebase.firestore().collection(tableName.Social_maps).onSnapshot(this.getsme)
        Firebase.firestore().collection('SOCIAL_MAPS').onSnapshot(this.getOldsm);
    }
    getsme = (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().Informer_name === 'ters') {
                Firebase.firestore().collection(tableName.Social_maps).doc(doc.id).update({
                    Informer_name: 'อดิศร'
                })
            }
        })
    }
    onUpdateAreas = (querySnapshot) => {
        this.setState({
            loading: true
        })
        const query_areas = []
        querySnapshot.forEach(element => {
            query_areas.push({
                areaID: element.id,
                title: element.data().Area_name,
                ...element.data()
            })
        });
        this.setState({
            query_areas,
        })
    }
    getOldsm = (query) => {
        const old_sm = [];
        query.forEach((doc) => {
            let District = data_provinces[0][1][doc.data().Area_DID][0];
            let Area_ID = '';
            let Area = "";
            if (District === 'ทุ่งศรีอุดม') {
                District = 'กุดเรือ'
            }
            this.state.query_areas.forEach((element) => {
                if (District === element.Area_name) {

                    Area_ID = element.areaID;
                    Area = element
                }
            })
            old_sm.push({
                ID: doc.id,
                ...doc.data(),
                Area_ID,
                Area,
                District
            })
        })
        this.setState({
            old_sm
        })
    }
    listProvinces = () => {
        const Provinces = [];
        data_provinces.forEach((doc, i) => {
            // console.log(doc)
            Provinces.push({
                Key: i,
                value: doc[0]
            })
        })
        this.setState({
            Provinces,

        })
    }
    listDistrict = (pid) => {
        const Districts = [];

        data_provinces[pid][1].forEach((doc, i) => {
            //  console.log(doc)
            Districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Districts,

            })
        } else {
            this.setState({
                Districts,
                District_ID: '',
                Sub_district_ID: '',
            })
        }

    }
    listSub_district = (pid, did) => {
        const Sub_districts = [];
        console.log(pid, did)
        data_provinces[pid][1][did][2][0].forEach((doc, i) => {

            Sub_districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Sub_districts,

            })
        } else {
            this.setState({
                Sub_districts,
                Sub_district_ID: '',
            })
        }
    }

    onSelectProvince = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.Province_ID === '') {
            this.setState({
                Districts: [],
                District_ID: '',
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.listDistrict(this.state.Province_ID);
        }
    }
    onSelectDistrict = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
        if (this.state.District_ID === '') {
            this.setState({
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.listSub_district(this.state.Province_ID, this.state.District_ID);
        }
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    onMove(data) {
        let new_id = Date.now().toString();
        const { Geo_map_name,
            Geo_map_type, Geo_map_position,
            Geo_map_description, Map_iamge_URL, Area_ID } = data;
        let Geo_map_result_description = '';
        let Geo_map_time = '';
        if (!isEmptyValue(data.Geo_map_result_description)) {
            Geo_map_result_description = data.Geo_map_result_description
        }
        if (!isEmptyValue(data.Geo_map_time)) {
            Geo_map_time = data.Geo_map_time
        }
        let Create_By_ID = this.state.uid;
        let Informer_name = 'อดิศร';
        if (!isEmptyValue(data.Informer_ID)) {
            Create_By_ID = data.Informer_ID
        }
        if (!isEmptyValue(data.Informer_name)) {
            Informer_name = data.Informer_name
        }
        try {
            if (data.Geo_map_type === 'resource') {
                Firebase.firestore().collection('Resources').doc(new_id).set({
                    Create_date: Firebase.firestore.Timestamp.now(),
                    Update_date: Firebase.firestore.Timestamp.now(),
                    Area_ID,
                    Informer_name,
                    Create_By_ID,
                    Name: Geo_map_name,
                }).then((result) => {
                    console.log('success')
                    Firebase.firestore().collection('SOCIAL_MAPS').doc(data.ID).delete()
                        .then(result2 => {
                            console.log('delete success');
                        })
                        .catch((error) => {
                            console.log('delete error', error, data);
                        })
                }).catch((error) => {
                    console.log('error', error, data);
                })
            } else {
                Firebase.firestore().collection(tableName.Social_maps).doc(new_id).set({
                    Geo_map_position,
                    Informer_name,
                    Create_date: Firebase.firestore.Timestamp.now(),
                    Update_date: Firebase.firestore.Timestamp.now(),
                    Map_image_URL: Map_iamge_URL,
                    Geo_map_name,
                    Geo_map_type,
                    Geo_map_description,
                    Create_By_ID,
                    Geo_map_result_description,
                    Geo_map_time,
                    Important: false,
                    Area_ID,
                    Map_image_name: new_id,
                }).then((result) => {
                    console.log('success')
                    Firebase.firestore().collection('SOCIAL_MAPS').doc(data.ID).delete()
                        .then(result2 => {
                            console.log('delete success');
                        })
                        .catch((error) => {
                            console.log('delete error', error, data);
                        })
                }).catch((error) => {
                    console.log('error', error, data);
                })
            }

        } catch (error) {
            console.log('error', error, data);
        }

    }
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Topnav></Topnav>
                <div className="area_detail">
                    {this.state.old_sm.map((element, i) =>
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-around',
                            flexDirection: 'row', backgroundColor: '#c4ffff', margin: 10
                        }}>
                            <p>{element.Geo_map_name}</p>
                            {element.Area_ID !== '' ? <p>{element.Area_ID}</p> : <p></p>}
                            {!isEmptyValue(element.Area) ? <p>{element.Area.Area_name}</p> : <p></p>}
                            <p>{element.District}</p>
                            <p>{element.Geo_map_type}</p>
                            <button onClick={this.onMove.bind(this, element)} type="button" className="btn btn-info ">move</button>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user
};

export default connect(mapStateToProps, mapDispatchToProps)(import_sm);