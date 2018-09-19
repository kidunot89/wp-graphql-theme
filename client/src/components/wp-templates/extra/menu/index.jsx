import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';
import { 
  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Nav, NavItem, NavLink as ExtLink, ButtonGroup,
} from 'reactstrap';
import { Query } from 'react-apollo';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'

import { Error, Loading, wrapper } from 'components/wp-templates/'
import MENU_QUERY from './query';

// Load icons to FontAwesome library
library.add(fab);

const Label = ({ url, content, size }) => {
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
      return content;
  }
}

Label.propTypes = {
  url: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  size: PropTypes.string,
};

Label.defaultProps = {
  size: '2x',
};

class Menu extends Component {
  constructor(props) {
    super(props);
    this.isExtLink = this.isExtLink.bind(this);
    this.formatUrl = this.formatUrl.bind(this);
    this.mapItem = this.mapItem.bind(this);
    this.subMenu = this.subMenu.bind(this);
    this.menuItem = this.menuItem.bind(this);
  }

  isExtLink(url) {
    return false === url.startsWith(this.props.siteUrl);
  }

  formatUrl(rawUrl) {
    if ( rawUrl.startsWith(this.props.siteUrl) ) {
      const { siteUrl, root } = this.props
      return `${root}/${rawUrl.substring(`${siteUrl}/`.length)}`;
    }

    return rawUrl;
  }

  mapItem({ label, url: rawUrl, childItems: { nodes } }, index) {
    const { subMenu: SubMenu, menuItem: MenuItem } = this;

    // Format Url
    const external = this.isExtLink(rawUrl);
    const url = this.formatUrl(rawUrl);
    
    // Render SubMenu if item has child items
    if (nodes.length > 0) {
      return (
        <SubMenu 
          url={url}
          external={external}
          label={label}
          items={nodes}
          key={`${label}-${index}`}
        />
      );
    }

    return (<MenuItem {...{ url, external, label }} key={`${label}-${index}`} />);
  }

  /**
   * 
   */
  subMenu({ url, external, label, items } ) {
    return (
      <ButtonGroup className="nav-item" role="group">
        {external ? (<ExtLink href={url}><Label url={url} content={label} /></ExtLink>) :
          (<NavLink to={url} className="nav-link" activeClassName="active"><Label url={url} content={label} /></NavLink>)}
        <UncontrolledDropdown nav direction="right">
          <DropdownToggle caret nav className="btn nav-link" />
          <DropdownMenu>
            {_.map(items, ({ id, label, url: rawUrl }) => {
              
              // Format Url
              const external = this.isExtLink(rawUrl);
              const url = this.formatUrl(rawUrl);

              return (external) ? (
                <DropdownItem key={id} tag="a" href={url}>
                  <Label url={url} content={label} />
                </DropdownItem>
              ) : (
                <DropdownItem key={id} tag={NavLink} to={url} activeClassName="active">
                  <Label url={url} content={label} />
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </ButtonGroup>
    );
  }

  /**
   * 
   */
  menuItem({ id, url, external, label }) {
    return(
      <NavItem key={id}>
        { 
          external ? 
          <ExtLink href={url}><Label url={url} content={label} /></ExtLink> :
          <NavLink to={url} className="nav-link" activeClassName="active"><Label url={url} content={label} /></NavLink>
        }
      </NavItem>
    );
  }

  render() {
    const navProps = _.omit(this.props, ['location', 'match', 'siteUrl', 'container']);

    return (
      <Nav { ...navProps}>
        <Query query={MENU_QUERY} variables={{ location: this.props.location.toUpperCase() }}>
          {({ data, error, loading }) => {
            if (loading) return (<Loading iconSize="3x" />);
            if (error) return (<Error fault="query" debugMsg={error.message} />);

            if (data && data.menus) {

              const { nodes } = data.menus;

              if ( nodes && nodes.length > 0 ) {
                const menu = nodes[0];

                return (_.map(menu.menuItems.nodes, this.mapItem));
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
  root: PropTypes.string,
  siteUrl: PropTypes.string,
};

Menu.defaultProps = {
  root: '',
  siteUrl: '',
}

export default wrapper(Menu);
