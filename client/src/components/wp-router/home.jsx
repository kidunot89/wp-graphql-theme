import React from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';

/**
 * Wordpress Home Route Component
 * Renders home page if pageOnFront prop set otherwise renders posts archive
 * 
 * @returns {WPTemplates.HomePage}
 * @returns {WPTemplates.Archive}
 */
const Home = (props) => {
  const { pageOnFront, limit, root } = props;
  if (pageOnFront) {
    return (<WPTemplates.HomePage id={pageOnFront} root={root} />);
  }
  return (<WPTemplates.Archive first={limit} root={root} />)
}

Home.propTypes = {
  limit: PropTypes.number.isRequired,
  pageOnFront: PropTypes.number,
  root: PropTypes.string.isRequired
};

Home.defaultProps = {
  pageOnFront: undefined,
}

export default Home;