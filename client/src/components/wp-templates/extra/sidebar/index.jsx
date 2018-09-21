import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading, Widget } from 'components/wp-templates';
import SIDEBAR_QUERY from './query';

class Sidebar extends Component {
  render() {
    const { id, as: Container } = this.props;

    return (
      <Query query={SIDEBAR_QUERY} variables={{ id }}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading iconSize="3x" />);
          if (error) return (<Error fault="query" debugMsg={error.message} as={Col} xs="auto" />);
          
          if(data && data.sidebarBy) {
            const { widgets: { nodes } } = data.sidebarBy;
            if (!nodes || nodes.length === 0) return null;
            return (
              <Container {..._.omit(this.props, ['id', 'as'])}>
                {_.map(nodes, ({ id, __typename }) => (
                  <Widget
                    id={id}
                    type={__typename}
                    wrapper={Col}
                    wrapperProps={{ xs: 'auto' }}
                    key={id}
                  />
                ))}
              </Container>
            );
          }
        }}
      </Query>
    );
  }
}

Sidebar.propTypes = {
  id: PropTypes.string.isRequired,
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

Sidebar.defaultProps = {
  as: 'div',
};

export default Sidebar;
