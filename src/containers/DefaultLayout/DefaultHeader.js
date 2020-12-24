import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Button, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';

import { validateSchema, formValueChangeHandler, apiCall, displayLog } from '../../utils/common';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/Mina_Chatbot_Logo.png'
import Dialog from './Dialog'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  state = {
    isDialogOpen: false,
    form: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    error: {
      status: false,
      message: ''
    }
  }

  isDialogOpenHandler = (flag) => {
    this.resetChangeFormState();
    this.setState({ isDialogOpen: flag })
  }

  resetChangeFormState() {
    this.setState({
      isDialogOpen: false,
      form: {
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      },
      error: {
        status: false,
        message: ''
      }
    })
  }

  submitClickHandler = async () => {
    let schema = Joi.object().keys({
      old_password: Joi.string().strict().trim().min(6).label('Old Password').required(),
      new_password: Joi.string().strict().trim().min(6).label('New Password').required(),
      confirm_new_password: Joi.string().strict().trim().min(6).valid(Joi.ref('new_password')).label('Confirm Password').required(),
    })
    this.setState({ error: await validateSchema(this.state.form, schema) });
    if (!this.state.error.status) {
      let data = {
        old_password: this.state.form.old_password,
        new_password: this.state.form.new_password,
        confirm_new_password: this.state.form.confirm_new_password,
        token: localStorage.getItem('MINA_AUTH_TOKEN')
      }
      const response = await apiCall('POST', 'changePassword', data);
      displayLog(response.code, response.message);
      localStorage.removeItem('MINA_AUTH_TOKEN')
      this.props.history.push(process.env.PUBLIC_URL + '/login');
      this.resetChangeFormState();
    } else {
      displayLog(0, this.state.error.message);
    }
  }
  inputChangeHandler = (e) => {
    this.setState({ form: formValueChangeHandler(e, this.state.form) });
  }
  render() {
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <Dialog
          modalTitle="Change Password"
          modalBody={
            <form>
              <Input className="cp-dialog-input" type="password" name="old_password" id="old_password" value={this.state.form.old_password} onChange={this.inputChangeHandler} placeholder="Old Password" />
              <Input className="cp-dialog-input" type="password" name="new_password" id="new_password" value={this.state.form.new_password} onChange={this.inputChangeHandler} placeholder="New Password" />
              <Input className="cp-dialog-input" type="password" name="confirm_new_password" id="confirm_new_password" value={this.state.form.confirm_new_password} onChange={this.inputChangeHandler} placeholder="Confirm Password" />
            </form>
          }
          modalFooter={
            <React.Fragment>
              <Button className="minabtn" onClick={this.submitClickHandler}>Submit</Button>{' '}
              <Button className="minabtn2" onClick={() => this.isDialogOpenHandler(false)}>Cancel</Button>
            </React.Fragment>
          }
          isModalOpen={this.state.isDialogOpen}
          toggle={this.isDialogOpenHandler}
        />

        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 44, height: 37, alt: 'MINA Chatbot logo' }}
          minimized={{ src: logo, width: 44, height: 37, alt: 'MINA Chatbot logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <span>Hello Admin</span>

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <i className="icon-arrow-down"></i>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => this.isDialogOpenHandler(true)}><i className="fa fa-key"></i> Change Password</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment >
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
