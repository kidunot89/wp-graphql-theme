import React from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';

/**
 * Wordpress Home Route Component
 * returns HomePage if pageOnFront prop set otherwise returns PostsArchive
 * 
 * @returns {WPTemplates.HomePage}
 * @returns {WPTemplates.PostsArchive}
 */
const Home = (props) => {
  const { pageOnFront, limit } = props;
  if (pageOnFront) {
    return (<WPTemplates.HomePage id={pageOnFront} root={root} />);
  }
  return (<WPTemplates.Archive first={limit} root={root} />)
}

Home.propTypes = {
  limit: PropTypes.number.isRequired,
  pageOnFront: PropTypes.number,
};

Home.defaultProps = {
  pageOnFront: undefined,
}

export default Home;