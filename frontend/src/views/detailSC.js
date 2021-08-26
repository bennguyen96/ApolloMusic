import React from 'react';
import axios from 'axios';
import { Form, Input, Button, DatePicker, Upload, InputNumber, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'antd/dist/antd.css';
import Content from '../components/content.js';
//customized css
import detail_sc from '../css/contractDetail.module.css'

class DetailSC extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            smartContract: null
        }
    }

    componentDidMount() {
        axios.post("http://127.0.0.1:8000/graphql/", {
            "query": `query getSmartContractWithID {
                getSmartContractWithid (id: "${this.props.match.params.id}") {
                    id
                    creatorName
                    creatorEmail
                    receiverEmail
                    eventName
                    payAmount
                    startTime
                    duration
                    location
                    payoutTime
                    receiverWalletAddress
                    receiverName
                    status
                }
            } 
            `,
            "variables": null,
            "operationName":"getSmartContractWithID"
        })
        .then(response => {
            console.log(response)
            this.setState({
                smartContract: response.data.data.getSmartContractWithid
            })
        })
        .catch(error => {console.log(error)})
    }



    render() {
        if (this.state.smartContract === null) {
            return <div>Loading</div>
        }

        // Progress Bar
        var progressCondition = "Draft"
        var progressPercent = 0
        var progressColor = "#FEC163"
        if (this.state.smartContract.status === "A_1") {
            progressCondition = "Accepted"
            progressPercent = 50
        } else if (this.state.smartContract.status === "A_2") {
            progressCondition = "Cancelled"
            progressPercent = 0
        } else if (this.state.smartContract.status === "A_3") {
            progressCondition = "Paid"
            progressPercent = 100
            progressColor = '#5EE2A0'
        }
        const progressBar = 
        <div className="condition">
            <div className="progress-title">
                {progressCondition}
            </div>
            <Progress strokeColor={'#FEC163'} percent={progressPercent} showInfo={false} />
        </div>

        return (
            <Content heading="Contract Details">
            <div className={detail_sc.createSC_div}>

                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="vertical"

                >

                    <div className= {detail_sc.left_half}>
                    <div className={detail_sc.condition}>
                    {progressBar}
                    </div>

                        <br/>

                        <Form.Item
                            label="Title"
                            name="title"
                        >
                            <Input placeholder={this.state.smartContract.eventName} disabled />
                        </Form.Item>



                        <Form.Item label="Start date" name="startDate">
                            <DatePicker placeholder={this.state.smartContract.startTime.substring(0, 10)} disabled />

                        </Form.Item>
                        <Form.Item label="Payout Time" name="payoutTime">
                            <DatePicker placeholder={this.state.smartContract.payoutTime.substring(0, 10)} disabled />
                        </Form.Item>

                        <Form.Item
                            label="Duration"
                            name="duration"

                        >
                            <Input placeholder={`${this.state.smartContract.duration} minutes`} disabled />
                        </Form.Item>

                        <Form.Item
                            label="Terms & Condition"
                            name="term"
                        >
                            <div style={{ 'border-bottom': '1px solid #3B86FF' }}>
                                <a style={{ color: 'white' }}>Terms & Condition.pdf</a>
                            </div>
                        </Form.Item>


                    </div>
                    <div className={detail_sc.right_half}>
                        <Form.Item
                            label="Fee (in ETH)"
                            name="fee"
                        >
                            <InputNumber placeholder={this.state.smartContract.payAmount} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Location"
                            name="location"
                        >
                            <Input placeholder={this.state.smartContract.location} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Receiver Address"
                            name="receiverAddress"
                        >
                            <Input placeholder={this.state.smartContract.receiverWalletAddress} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Receiver Name"
                            name="receiverName"
                        >
                            <Input placeholder={this.state.smartContract.receiverName} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Attachments"
                            name="attachments"

                        >
                            <div style={{ 'border-bottom': '1px solid #3B86FF' }}>
                                <a style={{ color: 'white' }}>ticket.pdf</a>
                            </div>
                        </Form.Item>

                    </div>
                </Form>

            </div >
                
            </Content>
        )
    }
}

export default DetailSC;
