import React from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';

/**
 * Common Props
 */
const archivePropTypes = {
  limit: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  root: PropTypes.string.isRequired,
};

/**
 * Renders posts archives by author
 * 
 * @returns {WPTemplates.Archive}
 */
const ByAuthor = ({ limit, name, root }) => {
  const props = {
    first: limit, 
    where: { author: parseInt(name, 10) },
    root,
  };

  return (<WPTemplates.Archive {...props} />);
}
ByAuthor.propTypes = archivePropTypes;

/**
 * Renders posts archives by category
 * 
 * @returns {WPTemplates.Archive}
 */
const ByCategory = ({ limit, name, root }) => {
  const props = {
    first: limit, 
    where: { category: name },
    root,
  };

  return (<WPTemplates.Archive {...props} />);
}
ByCategory.propTypes = archivePropTypes;

/**
 * Renders posts archives by date
 * 
 * @returns {WPTemplates.Archive}
 */
const ByDate = ({ monthnum, limit, year, root }) => {
  const props = {
    first: limit, 
    where: { 
      month: monthnum ? parseInt(monthnum, 10) : undefined,
      year: parseInt(year, 10),
    },
    root,
  };

  return (<WPTemplates.Archive {...props} />);
}
ByDate.propTypes = {
  limit: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  monthnum: PropTypes.string,
  root: PropTypes.string.isRequired,
};
ByDate.defaultProps = {
  monthnum: undefined,
};

/**
 * Renders posts archives by tag
 * 
 * @returns {WPTemplates.Archive}
 */
const ByTag = ({ limit, name, root }) => {
  const props = {
    first: limit, 
    where: { tag: name },
    root,
  };

  return (<WPTemplates.Archive {...props} />);
}
ByTag.propTypes = archivePropTypes;

/**
 * Renders posts archives of the most recent posts
 * 
 * @returns {WPTemplates.Archive}
 */
const Latest = ({ limit, root }) => (<WPTemplates.Archive first={limit} root={root} />);
Latest.propTypes = { limit: PropTypes.number.isRequired, root: PropTypes.string.isRequired };

export { ByAuthor, ByCategory, ByDate, ByTag, Latest };
