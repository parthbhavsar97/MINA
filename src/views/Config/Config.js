import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, CardFooter } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { apiCall, displayLog } from '../../utils/common';

import classnames from 'classnames';
import {
	NavLink,
	NavItem,
	Nav,
	TabContent,
	TabPane
} from 'reactstrap';

class SpamReports extends Component {
	state = {
		editorReady: false,
		text: '',
		activeTab: '1'
	}

	componentDidMount() {
		this.getData();
	}

	submitHandler = async (tab) => {
		let reqData = {
			tab: tab,
			text: tab == 1 ? this.state.privacy_policy : this.state.terms_and_conditions,
		}
		let response = await apiCall('POST', 'updateConfig', reqData);

		if (response.code == 1) {
			displayLog(response.code, response.message);
		} else {
			displayLog(response.code, response.message);
		}

	}

	getData = async () => {
		let response = await apiCall('GET', 'getConfig');
		if (response.code === 1) {
			this.setState({ privacy_policy: response.data.privacy_policy, terms_and_conditions: response.data.terms_and_conditions })
		} else {
			displayLog(response.code, response.message);
		}
	}

	toggle = async (tab) => {
		if (this.state.activeTab !== tab) {
			await this.setState({ activeTab: tab })
		}
	}

	render() {
		return (

			<div className="animated fadeIn">

				<Row>
					<Col xl={12}>
						<Card>
							<CardHeader>
								<h4>Config</h4>
							</CardHeader>

							<CardBody>
								<Nav tabs>
									<NavItem>
										<NavLink
											className={classnames({ active: this.state.activeTab === '1' })}
											onClick={() => { this.toggle('1'); }}
										>
											Privacy Policy
                    				</NavLink>
									</NavItem>

									<NavItem>
										<NavLink
											className={classnames({ active: this.state.activeTab === '2' })}
											onClick={() => { this.toggle('2'); }}
										>
											Terms of Services
                    				</NavLink>
									</NavItem>

								</Nav>

								<TabContent activeTab={this.state.activeTab}>

									<TabPane tabId="1">
										<Row className="align-items-right">
											<Col sm="12" md="12" className="mb-3 mb-xl-0">
												<CKEditor
													editor={ClassicEditor}
													config={{
														removePlugins: ['ImageUpload', 'MediaEmbed', 'BlockQuote', 'Table'],
													}}
													data={this.state.privacy_policy}
													onChange={(event, editor) => {
														const data = editor.getData();
														console.log(data)
														this.setState({ privacy_policy: data })
													}}
												/>
											</Col>
										</Row>
										<Button color="primary" className="minabtn mt-3" onClick={() => this.submitHandler(this.state.activeTab)} style={{ marginRight: '8px' }}>Submit</Button>
									</TabPane>

									<TabPane tabId="2">
										<Row className="align-items-right">
											<Col sm="12" md="12" className="mb-3 mb-xl-0">
												<CKEditor
													editor={ClassicEditor}
													config={{
														removePlugins: ['ImageUpload', 'MediaEmbed', 'BlockQuote', 'Table'],
													}}
													data={this.state.terms_and_conditions}
													onChange={(event, editor) => {
														const data = editor.getData();
														console.log(data)
														this.setState({ terms_and_conditions: data })
													}}
												/>
											</Col>
										</Row>
										<Button color="primary" className="minabtn mt-3" onClick={() => this.submitHandler(this.state.activeTab)} style={{ marginRight: '8px' }}>Submit</Button>
									</TabPane>

								</TabContent>
							</CardBody>

						</Card>
					</Col>
				</Row>

			</div>
		)
	}
}

export default SpamReports;
