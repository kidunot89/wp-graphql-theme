import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import Footer from './footer';
import Header from './header';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
        <Col>
          <Row>
            {children}
          </Row>
        </Col>
    );
  }
}

export { Header, Footer, Main }