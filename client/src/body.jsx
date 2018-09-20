import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Row, Col } from 'reactstrap';
import { BrowserView } from 'react-device-detect';

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
    const { appUserProps, customizr } = this.props;
    return (
      <Container fluid className="app-body">
        <Query query={BODY_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return (<WPTemplates.Loading />);
            if (error) return (<WPTemplates.Error fault="query" debugMsg={error.message} />);
            if (data) {
              const {
                allSettings: {
                  generalSettingsTitle: title,
                  generalSettingsDescription: description,
                  homeUrl: url,
                },
                themeMods: { customLogo: logo }
              } = data;
              const root = (customizr) ? '/customizer' : '';

              return (
                <Row>
                  <WPCore.Header {...{ logo, description, title, url }}>
                    <WPTemplates.Menu
                      className="primary-menu"
                      location="primary"
                      wrapper={Col}
                      wrapperProps={{ xs: 'auto' }}
                      pills
                      vertical
                      {...{ root, siteUrl: url }}
                    />
                    <WPTemplates.Login {...appUserProps} wrapper={Col} wrapperProps={{ xs: 'auto' }}/>
                    <BrowserView renderWithFragments>
                      <WPTemplates.Sidebar id="sidebar-1" wrapper={Col} wrapperProps={{ xs: 'auto' }} />
                    </BrowserView>
                    <WPTemplates.Menu
                      className="social-menu"
                      location="social"
                      wrapper={Col}
                      wrapperProps={{ xs: 'auto' }}
                      fill
                      {...{ root, siteUrl: url }}
                    />
                  </WPCore.Header>
                  <WPCore.Main>
                    <WPRouter {...{ root }} />
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
  appUserProps: PropTypes.shape({}).isRequired,
  customizr: PropTypes.bool,
};

Body.defaultProps = {
  customizr: false,
}

export default Body;
