import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { WPCustomizr } from './components';
import Body from './body';

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
        <Route path="/:customizr(customizr)" render={({ match: { params } }) => (
          <WPCustomizr>
            <Body
              appUserProps={{
                clearCurrentUser: this.clearCurrentUser,
                customizr: true,
                setCurrentUser: this.setCurrentUser,
                loggedIn,
              }}
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
          />
        )} />
      </Switch>
    );
  }
}

export default App;