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

const ErrorComponent = props => {
  const {
    as: Container, 
    className,
    fault,
    message,
    debugMsg,
    altIcon: AltIcon,
    iconSize
  } = props;

  const printIcon = () => {
    if (!AltIcon) {
      switch(fault) {
        case '404':
          return(<FontAwesomeIcon color="Tomato" size={iconSize} icon={['fas', 'times']} mask={['fas', 'circle']}/>);
        case '403':
          return(<FontAwesomeIcon color="Tomato" size={iconSize} icon={['fas', 'ban']}/>);
        case 'query':
          return(<FontAwesomeIcon color="Tomato" size={iconSize} icon={['fas', 'exclamation-circle']}/>);
        default:
          return(<FontAwesomeIcon size={iconSize} icon={['fas', 'grin-beam-sweat']}/>);
      }
    } else { return (<AltIcon />); }
  };

  const printMessage = () => {
    let output;
    if (!message) {
      switch(fault) {
        case '404':
          output = 'Sorry, we can locate the page you\'re looking for. Please, try again later.';
          break;
        case '403':
          output = 'Sorry, you aren\'t authorized to view this content';
          break;
        case 'query':
          output = 'Sorry, there was a problem loading the content you are trying to access. Please, try again later.';
          break;
        default:
          output = 'Wow, this is embarassing! We\'re not sure what happened. Or... a lazy dev just forgot to add a message here. Sorry'; 
          break;
      }
    } else { output = message; }

    if (process.env.REACT_APP_DEBUG_MODE) {
      output =  debugMsg || output;
    }

    return output;
  };

  const wrapperProps = _.omit(props, [
    'as', 'className', 'fault', 'message',
    'debugMsg', 'altIcon', 'iconSize',
  ]);

  return (
    <Container className={className} {...wrapperProps}>
      <Row className="align-items-center justify-content-center entry-content">
        <Col xs="auto">{printIcon()}</Col>
        <Col>
          <p className="text-center">
            {printMessage()}
          </p>
        </Col>
      </Row>
    </Container>
  );
}

ErrorComponent.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  fault: PropTypes.oneOf(['query', '404', '403', 'other']),
  message: PropTypes.string,
  debugMsg: PropTypes.string,
  altIcon: PropTypes.func,
  iconSize: PropTypes.oneOf([
    'lg', 'sm', 'xs', '2x',
    '3x', '5x', '7x', '10x', 
  ]),
};

ErrorComponent.defaultProps = {
  as: DefaultContainer,
  className: undefined,
  fault: 'other',
  message: undefined,
  debugMsg: undefined,
  altIcon: undefined,
  iconSize: '10x',
};

export default ErrorComponent;
