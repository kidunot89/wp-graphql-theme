import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <Container>
        <Row></Row>
        <Row>
          {children}
        </Row>
      </Container>
    )
  }
}

export default MainContent;