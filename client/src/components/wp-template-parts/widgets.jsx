import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

import { Error, Loading, GraphQLErrorMessage } from './';



const WidgetsDisplay = () => {
  return null;
}

class Widgets extends Component {
  constructor(props) {
    super(props);

    this.queryProps = this.queryProps.bind(this);
  }

  queryProps() {
    
  }

  render() {
    const { location } = this.props;

    return (
      <Query {...this.queryProps()}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (<Loading message="Loading" />);
          }

          if (error) {
            return ( <Error header="Error" message={() => (<GraphQLErrorMessage error={error} />)} /> );
          }

          let widget;

          return null;
        }}
      </Query>
    );
  }
}

Widgets.propTypes = {
  location: PropTypes.string,
  id: PropTypes.string,
};

Widgets.defaultProps = {
  location: undefined,
  id: undefined,
};

/**
 * Widgets Fragments
 */
export const MENU_ITEM_FRAGMENT = gql`
  fragment NavMenuItem on MenuItem {
    
  }
`;

/**
 * Widgets Queries
 */
export const LOCATION_QUERY = gql`
  query LocationQuery($location: String!) {
    
  }
  ${MENU_FRAGMENT}
`;

export const ID_QUERY = gql`
  query IdQuery($id: ID!) {
    
  }
  ${MENU_FRAGMENT}
`;

export default Widgets;