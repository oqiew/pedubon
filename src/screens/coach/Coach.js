import React, { Component } from 'react'
import Topnav from '../../components/top/Topnav'
import { Card, Col, Row, Avatar } from 'antd';
const { Meta } = Card;
export class Coach extends Component {
    render() {
        return (
            <center>
                <Topnav></Topnav>
                <div style={{ marginTop: 100 }}     >
                    <Card
                        style={{ width: 800 }}
                    >
                        <Meta
                            avatar={<Avatar style={{ width: 200, height: 200 }} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title="Card title"
                            description="This is the descriptiond
                            escriptiondescriptiondescriptiondescriptiondescriptiondescript
                            iondescriptiondescriptiondescriptiondescriptiondescriptiondescription
                            descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptionde
                            scriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription"
                        />
                    </Card>
                </div>
            </center>
        )
    }
}

export default Coach
