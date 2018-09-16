import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
        <Col>
          <Row className="flex-column align-items-center mt-3 mb-2">
            <Col xs={10}>
              {children}
            </Col>
          </Row>
        </Col>
    )
  }
}

export default MainContent;