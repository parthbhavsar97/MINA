import React, { Component } from 'react';
import { Card, CardHeader, Col, Row, CardBody } from 'reactstrap';

import { apiCall } from '../../utils/common';

import './dashboard.css';
import NumberFormat from 'react-number-format';

class Dashboard extends Component {
    state = {
        counts: {}
    }
    async componentDidMount() {
        let counts = await apiCall('GET', 'getDashboardCounts');
        this.setState({ counts: counts.data })
    }

    redirectHandler = (data, table) => {
        // if (table == "user") {
        //     this.props.history.push(process.env.PUBLIC_URL + '/users', { userType: data });
        // }
        // if (table == "offer") {
        //     this.props.history.push(process.env.PUBLIC_URL + '/reports', { status: data });
        // }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <h4 className="card-header-custom">Dashboard</h4>
                            </CardHeader>
                            <CardBody>
                                <div className="row Row">
                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler(1, "user")}>
                                        <div className="inforide">
                                            <div className="row crsrPntr">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash1">
                                                    <i className="fa fa-users useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Total Users</h4>
                                                    <h2>{this.state.counts.users}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler(3, "offer")}>
                                        <div className="inforide">
                                            <div className="row crsrPntr">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash1">
                                                    <i className="fa fa-user-circle useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Online Users</h4>
                                                    <h2>{this.state.counts.online_users}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler(2, "user")}>
                                        <div className="inforide">
                                            <div className="row crsrPntr">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash2">
                                                    <i className="fa fa-user-plus useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>New Registered users (Today)</h4>
                                                    <h2>{this.state.counts.new_users_daily}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler(3, "user")}>
                                        <div className="inforide">
                                            <div className="row crsrPntr">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash2">
                                                    <i className="fa fa-user-times useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Deleted Users (Today)</h4>
                                                    <h2>{this.state.counts.deleted_users_daily}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler('', "offer")}>
                                        <div className="inforide crsrPntr">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash1">
                                                    <i className="fa fa-users useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Active Users (per Day)</h4>
                                                    <h2>{this.state.counts.active_users_daily}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4" onClick={() => this.redirectHandler(2, "offer")}>
                                        <div className="inforide">
                                            <div className="row crsrPntr">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash1">
                                                    <i className="fa fa-users useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Active Users (per Month)</h4>
                                                    <h2>{this.state.counts.active_users_monthly}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <div className="inforide">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash2">
                                                    <i className="fa fa-th-large useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Total Services</h4>
                                                    <h2><NumberFormat value={this.state.counts.service} displayType={'text'} thousandSeparator={true} /></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-6 mb-4">
                                        <div className="inforide">
                                            <div className="row">
                                                <div className="col-lg-3 col-md-4 col-sm-4 col-4 dash2">
                                                    <i className="fa fa-th-list useIcon" aria-hidden="true"></i>
                                                </div>
                                                <div className="col-lg-9 col-md-8 col-sm-8 col-8 fontsty">
                                                    <h4>Total Chapters</h4>
                                                    <h2><NumberFormat value={this.state.counts.chapter} displayType={'text'} thousandSeparator={true} /></h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;