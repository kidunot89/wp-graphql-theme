import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
import { Container, Nav } from 'reactstrap';

import { Error, Loading, GraphQLErrorMessage } from './';

const NavItem = ({ home, label, menuItemId, url }) => {
  let path;
  if (url.startsWith(home)) {
    path = url.substr(home.length);
  } else {
    path = url;
  }
  return (
    <NavLink exact={(path === '/') ? true : undefined} className="nav-link" activeClassName="active" to={path}>{label}</NavLink>
  );
}

const NavDisplay = ({ className, menuId, name, menuItems, home }) => {
  return (
    <Nav className={ className || undefined } id={`menu=${menuId}`} name={name} vertical pills>
      {menuItems && _.map(menuItems.nodes, (item) => (<NavItem {...item} home={home} key={`menu-item-${item.menuItemId}`} />))}
    </Nav>
  );
}

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.queryProps = this.queryProps.bind(this);
  }

  queryProps() {
    const { location, id } = this.props;
    if (location) {
      return { query: LOCATION_QUERY, variables: { location } };
    }
    return { query: ID_QUERY, variable: { id } }
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

          let menu;
          if (location) {
            menu = data.themeMods.navMenuLocations;
          } else {
            menu = data.menu;
          }

          if (menu) {
            return (
              <Container>
                <NavDisplay className="mx-auto" {...menu} home={data.allSettings.homeUrl || ''} />
              </Container>
            );
          }

          return null;
        }}
      </Query>
    );
  }
}

Navigation.propTypes = {
  location: PropTypes.string,
  id: PropTypes.string,
};

Navigation.defaultProps = {
  location: undefined,
  id: undefined,
};

/**
 * Nav Fragments
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

/**
 * Nav Queries
 */
export const LOCATION_QUERY = gql`
  query LocationQuery($location: String!) {
    themeMods {
      navMenuLocations(location: $location){
        ...NavMenu
      }
    }
    allSettings {
      homeUrl
    }
  }
  ${MENU_FRAGMENT}
`;

export const ID_QUERY = gql`
  query IdQuery($id: ID!) {
    menu(id: $id){
      ...NavMenu
    }
    allSettings {
      homeUrl
    }
  }
  ${MENU_FRAGMENT}
`;

export default Navigation;