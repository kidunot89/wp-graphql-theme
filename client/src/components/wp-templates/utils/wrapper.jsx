import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Wrapper Element HOC
 * @param {React.Component} InputComponent 
 */
export default (InputComponent) => {
  const wrapped =  props => {
    const {
      wrapper: Container,
      wrapperCSS: className,
      wrapperStyle: style,
      wrapperProps,
    } = props;
    const newProps = _.omit(props, [
      'wrapper', 'wrapperCSS', 'wrapperStyle', 'wrapperProps',
    ]);

    if (Container) {
      return (
        <Container className={className} style={style} {...wrapperProps}>
          <InputComponent {...newProps} />
        </Container>
      );
    }

    return (<InputComponent {...newProps} />);
  };

  wrapped.propTypes = {
    wrapper: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]),
    wrapperCSS: PropTypes.string,
    wrapperStyle: PropTypes.shape({}),
    wrapperProps: PropTypes.shape({})
  };

  wrapped.defaultProps = {
    wrapper: undefined,
    wrapperCSS: undefined,
    wrapperProps: {},
    wrapperStyle: undefined,
  };

  return wrapped;
};