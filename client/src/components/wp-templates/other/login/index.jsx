import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { wrapper } from 'components/wp-templates/';
import LoginForm from './form';
import UserControls from './user-controls';

/**
 * Login Component - handles login mutation and rendering user controls
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  /**
   * clear authenication properties then reset store
   */
  logout( client ) {
    const { clearCurrentUser, loggedIn } = this.props;
    return new Promise((resolve, reject) => {
      if (loggedIn) {
        clearCurrentUser();
        resolve();
      } else {
        reject(Error('You are not logged in.'));
      }      
    });
  }

  authenticate({ authToken }) {
    const { setCurrentUser } = this.props;
    setCurrentUser(authToken);
  }

  render() {
    const { loggedIn } = this.props;

    // Render user controls if logged in
    if (loggedIn) {
      return (<UserControls onLogout={this.logout} />);
    }

    return (<LoginForm onLogin={this.authenticate} />)
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

export default wrapper(Login);
