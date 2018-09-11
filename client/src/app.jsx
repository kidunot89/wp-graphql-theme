import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Row, Col } from 'reactstrap';
import { Header, Login, MainContent } from './components';
import buildStylist from './theme';

const TOKEN_REFRESH_MUTATION = gql`
mutation RefreshToken($clientId: String!, $authToken: String!){
  refreshJwtAuthToken(input: { clientMutationId: $clientId, jwtRefreshToken: $authToken }){
    clientMutationId
    authToken
  }
}
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    this.clearCurrentUser = this.clearCurrentUser.bind(this);
    this.returningUser = this.returningUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  componentWillMount() {
    const { client } = this.props;
    this.updateStyle(client);
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

  updateStyle(client) {
    const stylist = buildStylist(client);
    this.setState({ stylist });
  }

  render() {
    const { loggedIn, stylist } = this.state;
    return (stylist) ? (
      <Container {...stylist('container-app')}>
        <Header {...stylist('header-app')}>
          {/* <Menu location="primary" {...stylist('primary-menu-app')}/> */}
          <Login
            {...stylist('login-app')}
            clearCurrentUser={this.clearCurrentUser}
            setCurrentUser={this.setCurrentUser}
            loggedIn={loggedIn}
          />
          {/* <Menu location="social" {...stylist('social-menu-app')}/> */}
          {/* <Sidebar name="sidebar" {...stylist('sidebar-app')}/> */}
        </Header>
        <MainContent {...stylist('main-content-app')}>
          {/* <Routes stylist={stylist}/> */}
        </MainContent>
      </Container>
    ) : (<Loading {...stylist('loading-app')}/>);
  }
}

App.propTypes = {
  client: PropTypes.shape({}),
};

export default withApollo(App);
