import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { v4 } from 'uuid';
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Mutation } from 'react-apollo';

import { LOGIN_MUTATION } from './query';
import { Error, Loading } from 'components/wp-templates';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      clientId: v4(),
      errors: {},
      loggedIn: false,
      login: '',
      password: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.invalidLogin = this.invalidLogin.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getErrorMessage = this.getErrorMessage.bind(this);
  }

  /**
   * Clears input fields and validation flags
   */
  resetForm() {
    this.setState({
      clientId: v4(),
      errors: {},
      login: '',
      password: '',
      remember: false,
    });
  }

  handleInput(name, { target: { value, checked, type } }) {
    this.setState({ [name]: type === 'checkbox' ? checked : value })
  }

  /**
   * Sets invalid login flag
   */
  invalidLogin( error ) {
    this.setState({ invalid: true });
  }

  /**
   * Processes user login action
   * @param function loginUser - mutation function
   * @param object event - event object
   */
  onSubmit( loginUser, event ) {
    event.stopPropagation();
    event.preventDefault();

    const { clientId, login, password } = this.state;
    // validate input
    const errors = {};
    if (login.length < 1) errors.user = true;
    if (password.length < 1) errors.pass = true;
    if (login.length < 1 || password.length < 1) {
      this.setState({ errors });
      return;
    };

    // run login mutation
    loginUser({ variables: { clientId, login, password } });

    // reset login form
    this.resetForm();
  }

  getErrorMessage() {
    const { errors: { user, pass } } = this.state;
    if ( user && pass ) {
      return 'You must enter a username and password';
    } else if ( user ) {
      return 'You must enter a username';
    } else if ( pass ) {
      return 'You must enter a password';
    }
  }

  render() {
    const { errors, login, password } = this.state;
    const { onLogin } = this.props;

    return (
      <Mutation
        mutation={LOGIN_MUTATION}
        onError={this.invalidLogin}
        onCompleted={onLogin}
      >
        {(loginUser, { error, loading }) => {
          return (
            <Form className="user-login" onSubmit={this.onSubmit.bind(this, loginUser)}>
              {!_.isEmpty(errors) && <Error fault="query" message={this.getErrorMessage()} iconSize="2x" className="mb-2" />}
              {loading && <Loading message="Signing in..." iconSize="3x" />}
              {(error && process.env.REACT_APP_DEBUG_MODE) && <Error fault="query" debugMsg={error.message} iconSize="2x" />}
              {/* Login */}
              <FormGroup>
                <Label for="login-login" hidden>Login</Label>
                <Input
                  type="text"
                  name="username"
                  value={login}
                  onChange={this.handleInput.bind(this, 'login')}
                  placeholder="Enter Login"
                  invalid={errors.user}
                  autoComplete="on"
                />
                { errors.user && <FormText color="danger">Must enter a login name</FormText> }
              </FormGroup>
              {/* Password */}
              <FormGroup>
                <Label for="login-password" hidden>Password</Label>
                <Input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={this.handleInput.bind(this, 'password')}
                  placeholder="Enter Password"
                  invalid={errors.pass}
                />
                { errors.pass && <FormText color="danger">Must enter a password</FormText> }
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input 
                    type="checkbox"
                    id="remember"
                    onChange={this.handleInput.bind(this, 'remember')}
                  />{' '}
                  Remember me on this device.
                </Label>
              </FormGroup>
              <Button type="submit" data-testid="login-button">Sign In</Button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;