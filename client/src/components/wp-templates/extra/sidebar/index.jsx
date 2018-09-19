import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Row, Col } from 'reactstrap';

import { Error, Loading, Widget, wrapper } from 'components/wp-templates';
import SIDEBAR_QUERY from './query';

class Sidebar extends Component {
  render() {
    const { id } = this.props;

    return (
      <Row className="flex-column align-items-stretch">
        <Query query={SIDEBAR_QUERY} variables={{ id }}>
          {({ data, loading, error, refetch }) => {
            if (loading) return (<Loading iconSize="3x" />);
            if (error) return (<Error fault="query" debugMsg={error.message} as={Col} xs="auto" />);
            
            if(data && data.sidebarBy) {
              const { widgets: { nodes } } = data.sidebarBy;
              return _.map(nodes, ({ id, __typename }) => (
                <Widget
                  id={id}
                  type={__typename}
                  wrapper={Col}
                  wrapperProps={{ xs: 'auto' }}
                  key={id}
                />
              ));
            }
          }}
        </Query>
      </Row>
    );
  }
}

Sidebar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default wrapper(Sidebar);
