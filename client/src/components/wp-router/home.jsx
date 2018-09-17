import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from '../';

/**
 * Wordpress Home Route Component
 * returns HomePage if pageOnFront prop set otherwise returns PostsArchive
 * 
 * @returns {WPTemplates.HomePage}
 * @returns {WPTemplates.PostsArchive}
 */
const Home = (props) => {
  const { pageOnFront, limit } = this.props;
  if (pageOnFront) {
    return (<WPTemplates.HomePage id={pageOnFront} />);
  }
  return (<WPTemplates.PostsArchive first={limit} />)
}

Home.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  limit: PropTypes.number.isRequired,
  pageOnFront: PropTypes.number,
};

Home.defaultProps = {
  pageOnFront: undefined,
}

export default Home;