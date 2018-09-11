import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import v4 from 'uuid/v4';

/**
 * Menu Fragments
 */
export const MENU_ITEM_FRAGMENT = gql`
  fragment NavMenuItem on MenuItem {
    menuItemId
    url
    label
    target
  }
`;

export const MENU_FRAGMENT = gql`
  fragment NavMenu on Menu {
    menuId
    name
    menuItems{
      nodes{
        ...NavMenuItem
      }
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

const MENU_QUERY = gql`
  query MenuQuery( $location: MenuLocation! ) {
    menus( where: { location: $location } ){
      nodes{
        ...NavMenu
      }
    }
  }${MENU_FRAGMENT}
`;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { location } = this.props;
    const navProps = _.omit(this.props, 'location');
    return (
      <Nav { ...navProps}>
        <Query query={MENU_QUERY} variables={{ location: location.toUpperCase() }}>
          {({ data, error, loading }) => {
            if (loading) {
              return <NavItem> Loading... </NavItem>;
            }

            if (error) {
              return ((process.env.REACT_APP_GRAPHQL_DEBUG) ?
                error.graphQLErrors.map(({ message }) => (<NavItem key={v4()}>{message}</NavItem>)) :
                (<NavItem> Sorry, there is a problem loading this menu </NavItem>)
              )
            }

            if (data.menus) {
              const { nodes } = data.menus;
              if ( nodes && nodes.length > 0 ) {
                const menu = nodes[0];
                return (
                  _.map(menu.menuItems.nodes, ({ label, url }) => (
                    <NavLink key={`${url}-${label}`} href={url}>{label}</NavLink>
                  ))
                );
              }
              return (<NavItem>Empty</NavItem>);
            }
          }}
        </Query>
      </Nav>
    );
  }
}

Menu.propTypes = {
  location: PropTypes.string.isRequired,
};

export default Menu;