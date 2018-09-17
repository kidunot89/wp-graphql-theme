import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

import { Error, Loading } from './';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name } = this.props;

    return (
      <Query query={SIDEBAR_QUERY} variables={{ name }}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading page />);
          if (error) return (<Error page message={error.message} />);
          
          if(data) {
            return null;
          }
        }}
      </Query>
    );
  }
}

Sidebar.propTypes = {
  name: PropTypes.string.isRequired
};

/**
 * Widgets Fragments
 */
export const BASE_WIDGET_FRAGMENT = gql`
  fragment BaseWidget on Widget {
    
  }
`;

/**
 * Sidebar Queries
 */

export const SIDEBAR_QUERY = gql`
  query SidebarQuery($id: ID!) {
    
  }
  ${BASE_WIDGET_FRAGMENT}
`;

export default Sidebar;