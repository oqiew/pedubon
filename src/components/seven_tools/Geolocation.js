import React from "react";
import { geolocated } from "react-geolocated";

class Geolocation extends React.Component {


    setLocate(lat, lng) {
        // console.log(this.props);
        if (this.props.getLocate) {
            // console.log(lat, lng);
            this.props.getLocate(lat, lng);
        }
    }

    render() {
        return !this.props.isGeolocationAvailable ?
            (
                <div>Your browser does not support Geolocation</div>
            ) : !this.props.isGeolocationEnabled ? (
                <div>Geolocation is not enabled</div>
            ) : this.props.coords ? (
                <table>
                    <tbody>
                        <tr>

                            <td><button type="button" className="btn btn-info"
                                onClick={this.setLocate.bind(this, this.props.coords.latitude, this.props.coords.longitude)}
                            >เลือกจุดที่เราอยู่</button></td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                        <div>Getting the location data&hellip; </div>
                    );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
    },
})(Geolocation);