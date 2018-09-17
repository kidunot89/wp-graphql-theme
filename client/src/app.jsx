import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { WPCustomizr } from './components';
import Body from './body';
import RouteTest from './route-test';

import './app.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.clearCurrentUser = this.clearCurrentUser.bind(this);
    this.returningUser = this.returningUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.state = {
      loggedIn: false,
    };
  }

  componentWillMount() {
    this.returningUser();
  }

  /**
   * Clears user authenication token and user state
   */
  clearCurrentUser() {
    localStorage.removeItem('user-token');
    this.setState({ authToken: undefined, loggedIn: false });
  }

  /**
   * Retrieves existing authentication token and sets user state
   */
  returningUser() {
    const { client } = this.props;
    const authToken = localStorage.getItem('user-token');
    this.setState({ authToken, loggedIn: true });
  }

  /**
   * Stores user authenication token and sets user state
   * @param String authToken - user authenication token
   */
  setCurrentUser(authToken) {
    localStorage.setItem('user-token', authToken);
    this.setState({ authToken, loggedIn: true });
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <Switch>
        <Route path="/customizr" render={props => (
          <WPCustomizr>
            <Body
              appUserProps={{
                clearCurrentUser: this.clearCurrentUser,
                setCurrentUser: this.setCurrentUser,
                loggedIn,
              }}
              {...props}
            />
          </WPCustomizr>
        )} />
        <Route render={props => (
          <Body
            appUserProps={{
              clearCurrentUser: this.clearCurrentUser,
              setCurrentUser: this.setCurrentUser,
              loggedIn,
            }}
            {...props}
          />
        )} />
      </Switch>
    );
  }
}

export default App;