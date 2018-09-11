import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, descriptProps, titleProps, logoProps } = this.props;
    return (
      <Container>
        <Row>
          {logoProps && <Logo {...logoProps} />}
          <Title />
          <Description />
        </Row>
        <Row>
          {children}
        </Row>
      </Container>
    )
  }
}

Header.propTypes = {
  descriptProps: PropTypes.shape({}),
  titleProps: PropTypes.shape({}),
  logoProps: PropTypes.shape({}),
};

Header.defaultProps = {
  descriptProps: undefined,
  titleProps: undefined,
  logoProps: undefined,
};

export default Header;