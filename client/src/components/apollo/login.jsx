import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { v4 } from 'uuid';
import _ from 'lodash';

export const LOGIN_MUTATION = gql`
  mutation LoginUser( $clientId: String!, $login: String!, $password: String! ) {
    login( input: { clientMutationId: $clientId, username: $login, password: $password } ) {
      authToken
      user {
        id
        name
      }
    }
  }
`;

export const VIEWER_QUERY = gql`
  query GetViewer {
    viewer {
      id
      nicename
      firstName
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      clientId: v4(),
      loggedIn: false,
      login: '',
      password: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.invalidLogin = this.invalidLogin.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  /**
   * Clears input fields and validation flags
   */
  resetForm() {
    this.setState({
      clientId: v4(),
      emptyLogin: false,
      emptyPass: false,
      invalid: false,
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
  login( loginUser, event ) {
    event.stopPropagation();
    event.preventDefault();

    const { clientId, login, password } = this.state;
    // validate input
    if (login.length < 1) this.setState({ emptyLogin: true, invalid: true });
    if (password.length < 1) this.setState({ emptyPass: true, invalid: true });
    if (login.length < 1 || password.length < 1) return;

    // run login mutation
    loginUser({ variables: { clientId, login, password } });

    // reset login form
    this.resetForm();
  }

  /**
   * clear authenication properties then reset store
   */
  logout( client ) {
    const { clearCurrentUser, loggedIn } = this.props;
    new Promise((resolve, reject) => {
      if (loggedIn) {
        clearCurrentUser();
        resolve();
      } else {
        reject(Error('You are not logged in.'));
      }      
    }).then(() => client.resetStore && client.resetStore());
  }

  authenticate({ authToken }) {
    const { setCurrentUser } = this.props;
    setCurrentUser(authToken);
  }

  render() {
    const { loggedIn } = this.props;
    const { emptyLogin, emptyPass, invalid, login, password } = this.state;

    // If logged in
    if (loggedIn) {
      return (
        <Query query={VIEWER_QUERY} fetchPolicy="network-only" onError={this.logout}>
          {({ client, error, loading, data }) => {
            if (loading) return null;

            if (error) {
              console.error(error);
              return process.env.REACT_APP_GRAPHQL_DEBUG ?
              (
                <ul className="user-controls debug">
                  {error.graphQLErrors.map(({ message }) => (<li key={v4()}>{message}</li>))}
                </ul>
              ) : null;
            }

            if (data && data.viewer) {
              const { username, nicename } = data.viewer;
              return (
                <div className="user-controls">
                  {nicename ? nicename : username}
                  <Button
                    onClick={this.logout.bind(this, client)}
                    data-testid='logout-button'
                  >
                    Logout
                  </Button>
                </div>
              );
            }
          }}

        </Query>
      );
    }

    const LoginError = ({ error }) => {
      if (process.env.REACT_APP_GRAPHQL_DEBUG) {
        return (
          <FormText>{error.message}</FormText>
        );
      }
      return (
        <FormText>Sorry, there was a problem logging you in. Please, try again later.</FormText>
      );
    }
    return (
      <Mutation
        mutation={LOGIN_MUTATION}
        onError={this.invalidLogin}
        onCompleted={this.authenticate}
      >
        {(loginUser, { error, loading }) => {
          return (
            <Form className="user-login" onSubmit={this.login.bind(this, loginUser)}>
              {invalid && <FormText>Invalid Login</FormText>}
              {loading && <FormText>Logging In...</FormText>}
              {error && <LoginError error={error} />}
              {/* Login */}
              <FormGroup>
                <Label for="login-login" hidden>Login</Label>
                <Input
                  type="text"
                  name="username"
                  value={login}
                  onChange={this.handleInput.bind(this, 'login')}
                  placeholder="Enter Login"
                  invalid={emptyLogin}
                  autoComplete="on"
                />
                { emptyLogin && <FormText>Must enter a login name</FormText> }
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
                  invalid={emptyPass}
                />
                { emptyPass && <FormText>Must enter a password</FormText> }
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
              <Button type="submit" data-testid="login-button">Login</Button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

Login.propTypes = {
  clearCurrentUser: PropTypes.func.isRequired,
  setCurrentUser: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
};

Login.defaultProps = {
  loggedIn: false,
};

export default Login;