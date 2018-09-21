import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Container, Row, Col, Button } from 'reactstrap';

import { VIEWER_QUERY } from './query'
import { Error, Loading } from 'components/wp-templates';

class UserControls extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout( client ) {
    const { onLogout } = this.props;
    onLogout().then(() => client.resetStore && client.resetStore());
  }

  render() {
    const { onLogout } = this.props;
    return (
      <Query query={VIEWER_QUERY} fetchPolicy="network-only" onError={this.logout}>
        {({ client, error, loading, data }) => {
          if (loading) return (<Loading iconSize="3x" />);
          if (error) return (<Error fault="query" debugMsg={error.message} />);

          if (data && data.viewer) {
            const { username, nicename } = data.viewer;
            return (
              <Row className="user-controls">
                <Col>
                  Welcome back, {' '} 
                  <strong>{nicename ? nicename : username}</strong>!
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={onLogout.bind(this, client)}
                    data-testid='logout-button'
                  >
                    Logout
                  </Button>
                </Col>
              </Row>
            );
          }
        }}
      </Query>
    );
  }
}

UserControls.propTypes = {
  onLogout: PropTypes.func.isRequired
};

export default UserControls;
