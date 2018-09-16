import React from 'react';
import { Container, Row } from 'reactstrap';

const ErrorComponent = ({ message }) => (
  <Container fluid>
    <Row className="align-items-center">
      {message}
    </Row>
  </Container>
);

export default ErrorComponent;
