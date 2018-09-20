import React from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';

/**
 * 
 */
const archivePropTypes = {
  limit: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  root: PropTypes.string.isRequired,
};

/**
 * 
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
 * 
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
 * 
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
 * 
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

const Latest = ({ limit, root }) => (<WPTemplates.Archive first={limit} root={root} />);
Latest.propTypes = { limit: PropTypes.number.isRequired, root: PropTypes.string.isRequired };

export { ByAuthor, ByCategory, ByDate, ByTag, Latest };
