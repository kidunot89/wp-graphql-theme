import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withApollo, Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Row } from 'reactstrap';
import { Header, Login, MainContent, Menu, Loading, Error } from './components';
import Routes from './routes';
import Stylist from './style';

const BODY_QUERY = gql`
  query AppQuery {
    generalSettings {
      title
      description
      url
    }
    themeMods {
      customLogo{
        altText
        sourceUrl
        mediaDetails{
          sizes{
            name
            sourceUrl
          }
        }
      }
    }
  }
`;

const TOKEN_REFRESH_MUTATION = gql`
  mutation RefreshToken($clientId: String!, $authToken: String!){
    refreshJwtAuthToken(input: { clientMutationId: $clientId, jwtRefreshToken: $authToken }){
      clientMutationId
      authToken
    }
  }
`;

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    this.updateStyle = this.updateStyle.bind(this);
  }

  componentWillMount() {
    const { client } = this.props;
    this.updateStyle(client);
  }

  updateStyle(client) {
    const stylist = new Stylist(client);
    this.setState({ stylist });
  }

  render() {
    const { stylist } = this.state;
    const { appUserProps, match } = this.props;
    return (
      <Container fluid className="app-body" style={{
        minHeight: '100vh',
        padding: 0,
      }}>
        <Query query={BODY_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return (<Loading />);
            if (error) return (<Error message={error.message} />);
            if (data) {
              const { generalSettings, themeMods } = data;
              return (
                <Row>
                  <Header
                    {...themeMods}
                    {...generalSettings}
                    logoProps={{
                      className: 'site-logo img-fluid p-2 mb-3',
                    }}
                    titleProps={{
                      className: 'site-title text-lg-center',
                    }}
                    descriptionProps={{
                      className: 'site-description text-lg-center',
                    }}
                    headSectionProps={{
                      className: 'd-flex flex-column align-items-stretch px-lg-2 header-row',
                    }}
                  >
                    <Menu
                      className="primary-menu"
                      location="primary"
                      match={match}
                      siteUrl={generalSettings.url}
                      pills
                      vertical
                      {...stylist.find('template-primaryMenu')}
                    />
                    <Login
                      {...stylist.find('template-login')}
                      {...appUserProps}
                    />
                    <Menu
                      className="social-menu"
                      location="social"
                      match={match}
                      siteUrl={generalSettings.url}
                      fill
                      {...stylist.find('template-socialMenu')}
                    />
                    {/* <Sidebar name="sidebar" {...stylist('sidebar-app')}/> */}
                  </Header>
                  <MainContent {...stylist.find('core-main')}>
                    <Routes match={match} stylist={stylist}/>
                  </MainContent>
                </Row>
              );
            }
          }}
        </Query>
      </Container>
    );
  }
}

Body.propTypes = {
  client: PropTypes.shape({}).isRequired,
  appUserProps: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
};

export default withApollo(Body);
