import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { 
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Nav, NavItem, NavLink as ExtLink
} from 'reactstrap';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import v4 from 'uuid/v4';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fab);

/**
 * Menu Fragments
 */
export const MENU_ITEM_FRAGMENT = gql`
  fragment NavMenuItem on MenuItem {
    menuItemId
    url
    label
    target
    childItems{
      nodes{
        url
        label
        target   
      }
    }
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

const BrandLabel = ({ url, label, size }) => {
  switch (true) {
    case url.includes('facebook.com'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'facebook']} />);
    case url.includes('github.com'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'github']} />);
    case url.includes('plus.google.com'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'google-plus']} />);
    case url.includes('linkedin.com'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'linkedin']} />);
    case url.includes('twitch.tv'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'twitch']} />);
    case url.includes('twitter.com'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'twitter']} />);
    case url.includes('wordpress.org'):
      return (<FontAwesomeIcon size={size} icon={['fab', 'wordpress']} />);
  
    default:
      return label;
  }
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.isExtLink = this.isExtLink.bind(this);
    this.intLink = this.intLink.bind(this);
    this.subMenu = this.subMenu.bind(this);
    this.menuItem = this.menuItem.bind(this);
    this.state = {};
  }

  isExtLink(url) {
    const { siteUrl } = this.props;
    return ! url.startsWith(siteUrl);
  }

  subMenu({ items, children, key } ) {
    const MenuItem = this.menuItem;
    return (
      <Dropdown
        nav
        direction="down"
        tag="a"
        isOpen={this.state[key]}
        toggle={() => {
        if (this.state[key] === undefined) {
          this.setState({ [key]: true });
        } else {
          this.setState({ [key]: !this.state[key] });
        }
      }}>
        <DropdownToggle nav caret>
          {children}
        </DropdownToggle>
        <DropdownMenu>
          {_.map( items, ({ url, label }, index) => {
            const key = `${label}-${index}`
            return (<DropdownItem><MenuItem {...{ label, url, key }} /></DropdownItem>)
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }

  intLink({ className, url, label }) {
    const { siteUrl, match } = this.props;
    const rootUrl = (match.url === '/') ? '' : match.url;
    return (
      <NavLink
        className={className}
        activeClassName="active"
        to={`${rootUrl}/${url.substring(`${siteUrl}/`.length)}`}
      >
        {label}
      </NavLink>
    );
  }

  menuItem({ url, label }) {
    let className;
    if ( this.props.fill || this.props.justified ) className = 'nav-item';
    
    // Handles external links
    if ( this.isExtLink(url) ) {
      return (
        <ExtLink className={className} href={url}>
          <BrandLabel size="2x" url={url} label={label} />
        </ExtLink>
      );
    }

    const IntLink = this.intLink;

    // Handles internal links
    className = (className) ? `${className} nav-link` : 'nav-link';
    return (<IntLink className={className} url={url} label={label} />);
  }

  render() {
    const navProps = _.omit(this.props, ['location', 'match', 'siteUrl']);
    const SubMenu = this.subMenu;
    const MenuItem = this.menuItem;
    return (
      <Nav { ...navProps}>
        <Query query={MENU_QUERY} variables={{ location: this.props.location.toUpperCase() }}>
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
                  _.map(menu.menuItems.nodes, ({ label, url, childItems: { nodes } }, index) => {
                    const key = `${label}-${index}`;
                    const hasChildren = nodes.length > 0;

                    if (hasChildren) {
                      return (
                        <SubMenu {...{ items: nodes, key }}>
                          <MenuItem {...{ label, url, index }} />
                        </SubMenu>
                      );
                    }

                    return (<MenuItem {...{ label, url, key }} />);
                  })
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
  match: PropTypes.shape({}),
  siteUrl: PropTypes.string,
};

Menu.defaultProps = {
  match: undefined,
  siteUrl: '',
}

export default Menu;