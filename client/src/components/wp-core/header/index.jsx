import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Col, Collapse, Container, Row } from 'reactstrap';
import { BrowserView, MobileView } from 'react-device-detect';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { Logo, Title, Description } from './components';

library.add(faBars);



class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: false,
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const { children, title, logo, description } = this.props;
    return (
      <Col lg={5} className="header-container d-lg-flex pr-0">
        <BrowserView renderWithFragment>
          <Row className="justify-content-end">
            <Col lg="14" style={{ margin: '20% 0', padding: '0 15%' }}>
              <Row className="justify-content-center">
                {logo && <Logo {...logo} className="site-logo img-fluid p-2 mb-3" />}
                {title && <Title content={title} className="site-title text-lg-center" />}
                {description && <Description content={description} className="site-description text-lg-center"/> }
              </Row>
              <Row className="d-flex flex-column header-row">
                {children}
              </Row>
            </Col>
          </Row>
        </BrowserView>
        <MobileView renderWithFragment>
          <Row className="d-flex justify-content-between align-items-center w-100">
            <Col>{title && <Title content={title} className="site-title text-left"/>}</Col>
            <Col xs="auto" className="px-0">
              <Button onClick={this.toggle} className="nav-toggle">
                <FontAwesomeIcon icon="bars" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Collapse tag={Col} style={{ marginRight: '15px' }} isOpen={this.state.collapse}>
              {children}
            </Collapse>
          </Row>
        </MobileView>
      </Col>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.shape({}),
  description: PropTypes.string,
};

Header.defaultProps = {
  description: undefined,
  title: undefined,
  logo: undefined,
};

export default Header;