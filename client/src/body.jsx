import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Row, Col } from 'reactstrap';
import { WPCore, WPRouter, WPTemplates } from './components';

const BODY_QUERY = gql`
  query AppQuery {
    allSettings {
      homeUrl
      generalSettingsTitle
      generalSettingsDescription
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

/**
 * App Body Component
 */
class Body extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  render() {
    const { appUserProps, match } = this.props;
    return (
      <Container fluid className="app-body" style={{
        minHeight: '100vh',
        padding: 0,
      }}>
        <Query query={BODY_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return (<WPTemplates.Loading page />);
            if (error) return (<WPTemplates.Error page message={error.message} safe="Sorry, there was an loading this page. Please try again later." />);
            if (data) {
              const { allSettings: {
                generalSettingsTitle: title,
                generalSettingsDescription: description,
                homeUrl: url,
              }, themeMods } = data;
              return (
                <Row>
                  <WPCore.Header
                    {...themeMods}
                    {...{ title, description, url }}
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
                      className: 'd-flex flex-column header-row',
                    }}
                  >
                    <WPTemplates.Menu
                      className="primary-menu"
                      location="primary"
                      match={match}
                      siteUrl={url}
                      wrapper={Col}
                      wrapperStyle={{ marginBottom: '20%' }}
                      wrapperProps={{ xs: 'auto' }}
                      pills
                      vertical
                    />
                    <WPTemplates.Login {...appUserProps} wrapper={Col} wrapperProps={{ xs: 'auto' }} wrapperStyle={{ marginBottom: '20%' }} />
                    <WPTemplates.Sidebar id="sidebar-1" wrapper={Col} wrapperProps={{ xs: 'auto' }} wrapperStyle={{ marginBottom: '20%' }} />
                    <WPTemplates.Menu
                      className="social-menu"
                      location="social"
                      wrapper={Col}
                      wrapperProps={{ xs: 'auto' }}
                      wrapperStyle={{ marginBottom: '20%' }}
                      fill
                      {...{ match, siteUrl: url }}
                    />
                  </WPCore.Header>
                  <WPCore.Main>
                    <WPRouter {...{ match }} />
                    <WPCore.Footer />
                  </WPCore.Main>
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
