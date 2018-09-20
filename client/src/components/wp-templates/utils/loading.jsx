import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'
import { Container as DefaultContainer, Row, Col } from 'reactstrap';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Load icons to FontAwesome library
library.add(fas);

const LoadingComponent = props => {
  const {
    as: Container, 
    className,
    message,
    altIcon: AltIcon,
    iconSize
  } = props;

  const printIcon = () => {
    if (!AltIcon) {
      return(<FontAwesomeIcon color="#B2F300" size={iconSize} icon={['fas', 'circle']} mask={['fas', 'circle-notch']} spin />);
    } else { return (<AltIcon />); }
  };

  const printMessage = () => {
    let output;
    if (!message) {
      output = "Loading..."
    } else { output = message; }

    return output;
  };

  const wrapperProps = _.omit(props, [
    'as', 'className', 'message', 'altIcon',
    'iconSize',
  ]);

  return (
    <Container className={className} {...wrapperProps}>
      <Row className="align-items-center justify-content-center post-body">
        <Col xs="auto">{printIcon()}</Col>
        <Col>{printMessage()}</Col>
      </Row>
    </Container>
  );
}

LoadingComponent.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  message: PropTypes.string,
  altIcon: PropTypes.func,
  iconSize: PropTypes.oneOf([
    'lg', 'sm', 'xs', '2x',
    '3x', '5x', '7x', '10x', 
  ]),
};

LoadingComponent.defaultProps = {
  as: DefaultContainer,
  className: undefined,
  message: undefined,
  altIcon: undefined,
  iconSize: '10x',
};

export default LoadingComponent;