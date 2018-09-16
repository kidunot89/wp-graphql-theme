import React from 'react';
import { Container, Row } from 'reactstrap';

const LoadingComponent = ({ message }) => (
  <Container fluid>
    <Row className="align-items-center">
      Loading...
    </Row>
  </Container>
);

export default LoadingComponent;