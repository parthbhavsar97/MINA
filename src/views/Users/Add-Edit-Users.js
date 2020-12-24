import React, { Component } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Col, Row, FormGroup, Input, Label, Button } from 'reactstrap';
import { validateSchema, formValueChangeHandler, apiCall, displayLog } from '../../utils/common';
import Joi from 'joi-browser';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import S3FileUpload from 'react-s3';
import config from '../../utils/config';

class AddEditCollection extends Component {
  state = {
    form: {
      FirstName: '',
      LastName: '',
      BusinessName: '',
      BusinessAddressCity: '',
      BusinessAddressStreet: '',
      BusinessPhoneNumber: '',
      BusinessWebAddress: ''
    },
    userType: '',
    image: '',
    photo: [],
    images: [],
    is_business: false,
    error: {
      status: false,
      message: '',
    },
  }

  async componentDidMount() {
    console.log('PROPS DAtA::::>>>', this.props.location);
    if (window.location.pathname.includes('/business/edit') === true) {
      this.setState({ is_business: true })
    }
    if (this.props.match.params && this.props.match.params.userId) {
      let data = {
        id: this.props.match.params.userId
      }
      const response = await apiCall('POST', 'getUserById', data);
      console.log('response is-->>', response);
      let form = this.state.form;
      form.FirstName = response.data.FirstName ? response.data.FirstName : ''
      form.LastName = response.data.LastName ? response.data.LastName : ''
      form.BusinessName = response.data.BusinessName ? response.data.BusinessName : ''
      form.BusinessAddressCity = response.data.BusinessAddressCity ? response.data.BusinessAddressCity : ''
      form.BusinessAddressStreet = response.data.BusinessAddressStreet ? response.data.BusinessAddressStreet : ''
      form.BusinessPhoneNumber = response.data.BusinessPhoneNumber ? response.data.BusinessPhoneNumber : ''
      form.BusinessWebAddress = response.data.BusinessWebAddress ? response.data.BusinessWebAddress : ''

      this.setState({ form, userType: response.data.AccountType, image: config.image_url + response.data.user_image })
    }
  }

  submitHandler = async () => {
    let reqData = new FormData();
    if (this.props.match.params && this.props.match.params.userId) {
      for (let index = 0; index < this.state.photo.length; index++) {
        const photo = this.state.photo[index];
        reqData.append('image', photo)
      }
    }
    let formData = {

    }
    formData.Id = this.props.match.params.userId.trim()
    formData.FirstName = this.state.form.FirstName.trim()
    formData.LastName = this.state.form.LastName.trim()
    formData.BusinessName = this.state.form.BusinessName.trim()
    formData.BusinessAddressCity = this.state.form.BusinessAddressCity.trim()
    formData.BusinessAddressStreet = this.state.form.BusinessAddressStreet.trim()
    formData.BusinessPhoneNumber = this.state.form.BusinessPhoneNumber.trim()
    formData.BusinessWebAddress = this.state.form.BusinessWebAddress.trim()
    formData.type = this.state.userType

    if (this.props.match.params && this.props.match.params.userId) {
      //EDIT
      reqData.append("Id", this.props.match.params.userId.trim())
      reqData.append("FirstName", this.state.form.FirstName.trim())
      reqData.append("LastName", this.state.form.LastName.trim())
      reqData.append("BusinessName", this.state.form.BusinessName.trim())
      reqData.append("BusinessAddressCity", this.state.form.BusinessAddressCity.trim())
      reqData.append("BusinessAddressStreet", this.state.form.BusinessAddressStreet.trim())
      reqData.append("BusinessPhoneNumber", this.state.form.BusinessPhoneNumber.trim())
      reqData.append("BusinessWebAddress", this.state.form.BusinessWebAddress.trim())
      reqData.append("type", this.state.userType)
      await this.editUser(formData, reqData)
    }
  }
  editUser = async (form, reqData) => {
    console.log('\n\n\n FORM--->>>', form);
    let schema = Joi.object().keys({
      Id: Joi.string().strict().required(),
      FirstName: Joi.string().strict().label('First Name').required(),
      LastName: Joi.string().strict().label('Last Name').required(),
      type: Joi.number().label('Account Type').required(),
      BusinessName: Joi.string().strict().allow(''),
      BusinessAddressCity: Joi.string().allow(''),
      BusinessAddressStreet: Joi.string().allow(''),
      BusinessPhoneNumber: Joi.number().allow(''),
      BusinessWebAddress: Joi.string().allow(''),
      image: Joi.optional(),
    })
    this.setState({ error: await validateSchema(form, schema) });
    if (!this.state.error.status) {
      let res = await apiCall('POST', 'editUserProfileByAdmin', reqData);
      if (res.code == 1) {
        displayLog(res.code, res.message)
        if (window.location.pathname.includes('/business/edit/')) {
          this.props.history.push(process.env.PUBLIC_URL + `/business`, this.props.location.state);

        } else {
          this.props.history.push(process.env.PUBLIC_URL + `/users`, this.props.location.state);
        }
      }
    } else {
      displayLog(0, this.state.error.message)
    }
  }

  changeValuesHandler = (e) => {
    this.setState({ form: formValueChangeHandler(e, this.state.form) });
  }
  changeDate = (date) => {
    let form = this.state.form;
    form.dob = moment(date._d).format("DD-MM-YYYY")
    this.setState({ form })
  }

  changeSelectValue = (values, a) => {
    let newValues = []
    for (let v of values) {
      newValues.push(v);
    }
    let newFormValues = { ...this.state.form };
    newFormValues[a] = newValues;
    this.setState({ form: newFormValues })
  }

  uploadHandler = (userId, file, newFileName) => {
    const s3config = {
      bucketName: config.S3_BUCKET_NAME,
      dirName: `${userId}/profile-pictures`,
      region: config.S3_REGION,
      accessKeyId: config.AWS_ACCESS_KEY,
      secretAccessKey: config.AWS_SECRET_KEY,
    }
    Object.defineProperty(file, 'name', {
      writable: true,
      value: newFileName
    });
    S3FileUpload
      .uploadFile(file, s3config)
      .then(data => console.log(data))
      .catch(err => console.error(err))

  }
  validation = (currentDate) => {
    return currentDate.isBefore(moment(new Date())) && currentDate.isAfter(moment(new Date('01/01/1920')));
  };
  goBack = () => {
    this.props.history.push(process.env.PUBLIC_URL + '/users')
  }
  enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      this.submitHandler()
    }
  }
  changeFilter = (e) => {
    this.setState({ userType: +e.target.value });
  }
  fileSelectedHandler = (e, flag) => {
    const file = Array.from(e.target.files);

    if (file) {
      this.setState({
        photo: file,
        image: ' '
      }, () => console.log('\n\n\n %%%%%%%%>>>>>', this.state.photos));

    }
    if (file) {
      file.map(f => (
        this.state.images.push(URL.createObjectURL(f))
      ))
    }
  }

  async asignImage(index, id) {
    // console.log('\n\n ID IS ______________________>>>', id);
    // let arr = this.state.editedId
    // console.log('\n\n\n INCLUDE ', arr.includes(id));
    // if (!arr.includes(id)) {
    //   arr.push(id);
    // }
    // await this.setState({ index: index, id: id, editedId: arr })
  }
  render() {
    console.log('\n\n\n ********', this.state);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <h4>{this.state.is_business === true ? "Edit Business" : this.props.match.params && this.props.match.params.userId ? "Edit User" : "Add User"}</h4>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" md="12" className="text-center">
                    <FormGroup>
                      <div className="email1">
                        {
                          <div className="profile-pic">
                            <img className="profile-img" src={this.state.image != ' ' ? this.state.image : this.state.images[0]} alt="profile" onError={(event) => { event.target.onerror = null; event.target.src = require('../../assets/default.png') }}></img>
                            <div className="image-upload edit-image1"><label for={"image"}>
                              <a href><i className="fa fa-edit fa-lg"></i></a></label>
                              <input
                                className="file-input"
                                type="file"
                                id={"image"}
                                name={"image"}
                                multiple={false}
                                accept="image/jpg, image/png, image/jpeg"
                                onChange={(e) => this.fileSelectedHandler(e)} />
                            </div>
                            {/* <div className="delete-image edit-image">
                              <a href>
                                <i className="fa fa-trash fa-lg" onClick={() => this.DeleteImageHandler()}></i>
                              </a>
                            </div> */}
                          </div>
                        }

                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {
                    this.state.is_business === false &&
                    <>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label className="label-weight">First Name</Label>
                          <Input type="text" placeholder={`Enter First Name`}
                            value={this.state.form['FirstName']}
                            onKeyPress={(e) => this.enterPressed(e)}
                            name="FirstName" onChange={(e) => this.changeValuesHandler(e)} />
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label className="label-weight">Last Name</Label>
                          <Input type="text" placeholder={`Enter Last Name`}
                            value={this.state.form['LastName']}
                            onKeyPress={(e) => this.enterPressed(e)}
                            name="LastName" onChange={(e) => this.changeValuesHandler(e)} />
                        </FormGroup>
                      </Col>
                      <Col sm="12" md="2" className="mb-3 mb-xl-0">
                        <FormGroup>
                          <Label className="label-weight">Account Type</Label>
                          <Input type="select" name="userType" value={this.state.userType} onChange={(e) => this.changeFilter(e)} >
                            <option value=''>Select Type</option>
                            <option value={1}>User</option>
                            <option value={2}>Business</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </>
                  }
                </Row>

                {/* Business Fields */}
                {
                  this.state.userType == 2
                    ?
                    <>
                      <Row>
                        {
                          this.state.is_business === false &&
                          <Col xs="12" md="12" className="seoAlign">
                            Business Details
                        </Col>
                        }
                      </Row>
                      <Row>
                        <Col xs="12" md="6">
                          <FormGroup>
                            <Label className="label-weight">Name</Label>
                            <Input type="text" placeholder={`Enter Business Name`}
                              value={this.state.form['BusinessName']}
                              onKeyPress={(e) => this.enterPressed(e)}
                              name="BusinessName" onChange={(e) => this.changeValuesHandler(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup>
                            <Label className="label-weight">City</Label>
                            <Input type="text" placeholder={`Business City`}
                              value={this.state.form['BusinessAddressCity']}
                              onKeyPress={(e) => this.enterPressed(e)}
                              name="BusinessAddressCity" onChange={(e) => this.changeValuesHandler(e)} />
                          </FormGroup>

                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup>
                            <Label className="label-weight">Street</Label>
                            <Input type="text" placeholder={`Business Street`}
                              value={this.state.form['BusinessAddressStreet']}
                              onKeyPress={(e) => this.enterPressed(e)}
                              name="BusinessAddressStreet" onChange={(e) => this.changeValuesHandler(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup>
                            <Label className="label-weight">Phone Number</Label>
                            <Input type="text" placeholder={`Business Phone Number`}
                              value={this.state.form['BusinessPhoneNumber']}
                              onKeyPress={(e) => this.enterPressed(e)}
                              name="BusinessPhoneNumber" onChange={(e) => this.changeValuesHandler(e)} />
                          </FormGroup>
                        </Col>
                        <Col xs="12" md="6">
                          <FormGroup>
                            <Label className="label-weight">Web Address</Label>
                            <Input type="text" placeholder={`Business Web Address`}
                              value={this.state.form['BusinessWebAddress']}
                              onKeyPress={(e) => this.enterPressed(e)}
                              name="BusinessWebAddress" onChange={(e) => this.changeValuesHandler(e)} />
                          </FormGroup>

                        </Col>
                      </Row>
                    </>
                    : null
                }

              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.submitHandler} style={{ marginRight: '8px' }}>Submit</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AddEditCollection;
