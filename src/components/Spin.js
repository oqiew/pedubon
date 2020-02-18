import ReactLoading from 'react-loading';

import React, { Component } from 'react'

export default class Spin extends Component {
    render() {
        return (
            <div style={{ marginLeft: '45vw', marginTop: '40vh' }}>
                <ReactLoading type={'spin'} color={'#0080ff'} height={'20%'} width={'20%'} />
            </div>
        )
    }
}
