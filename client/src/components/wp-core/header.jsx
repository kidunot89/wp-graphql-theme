import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Col, Collapse, Container, Row } from 'reactstrap';
import { BrowserView, MobileView } from 'react-device-detect';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars);

/**
 * Custom Logo Stateless Component
 */
const Logo = ({ sourceUrl, altText, mediaDetails, className }) => {
  if ( mediaDetails && mediaDetails.sizes ) {
    let src;
    let srcset;
    _.each(mediaDetails.sizes, ({ sourceUrl: resizeUrl }, index) => {
      if (index === 0 ) {
        src = resizeUrl;
      }
      srcset = (srcset) ? `${srcset}, ${resizeUrl} ${index + 1}x` : `${resizeUrl} ${index + 1}x`
    });

    return (
      <img alt={altText} src={src} srcSet={srcset} className={className} />
    );
  }
  return (
    <img src={sourceUrl} alt={altText} />
  );
}

/**
 * Site Title Stateless Component
 */
const Title = ({ className, content }) => (
  <h1 className={className}>{content}</h1>
);

/**
 * Site Description / Tagline Stateless Component
 */
const Description = ({ className, content }) => (
  <h2 className={className}><small>{content}</small></h2>
);

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
    const {
      children, title, customLogo, description,
      headSectionProps, descriptionProps, titleProps, logoProps
    } = this.props;
    return (
        <Col lg={5} className="header-container d-flex flex-fill pr-0">
          <BrowserView renderWithFragment>
            <Row className="justify-content-end">
              <Col lg="14" style={{ margin: '20% 0', padding: '0 15%' }}>
                <Row className="justify-content-center" >
                  {customLogo && <Logo {...customLogo} {...logoProps}/>}
                </Row>
                <Row className="justify-content-center">
                  {title && <Title content={title} {...titleProps}/>}
                  {description && <Description content={description} {...descriptionProps}/> }
                </Row>
                <Row {...headSectionProps}>
                  {children}
                </Row>
              </Col>
            </Row>
          </BrowserView>
          <MobileView renderWithFragment>
            <Row className="flex-nowrap justify-content-between py-3">
              <Col xs="auto">{title && <Title content={title} {...titleProps}/>}</Col>
              <Col xs="auto">
                <Button onClick={this.toggle} style={{ marginBottom: '1rem' }}>
                  <FontAwesomeIcon icon="bars" />
                </Button>
              </Col>
            </Row>
            <Collapse isOpen={this.state.collapse}>
              {children}
            </Collapse>
          </MobileView>
        </Col>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  description: PropTypes.string,
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