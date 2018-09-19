import React from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';

/**
 * 
 */
const archivePropTypes = {
  limit: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

/**
 * 
 */
const ByAuthor = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { author: name }
  };

  return (<WPTemplates.Archive {...props} />);
}
ByAuthor.propTypes = archivePropTypes;

/**
 * 
 */
const ByCategory = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { category: name }
  };

  return (<WPTemplates.Archive {...props} />);
}
ByCategory.propTypes = archivePropTypes;

/**
 * 
 */
const ByDate = ({ monthnum, limit, year }) => {
  const props = {
    first: limit, 
    where: { 
      month: monthnum ? parseInt(monthnum, 10) : undefined,
      year: parseInt(year, 10),
    }
  };

  return (<WPTemplates.Archive {...props} />);
}
ByDate.propTypes = {
  limit: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  monthnum: PropTypes.string,
};
ByDate.defaultProps = {
  monthnum: undefined,
};

/**
 * 
 */
const ByTag = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { tag: name }
  };

  return (<WPTemplates.Archive {...props} />);
}
ByTag.propTypes = archivePropTypes;

const Latest = ({ limit }) => (<WPTemplates.Archive first={limit} />);
Latest.propTypes = { limit: PropTypes.number.isRequired };

export { ByAuthor, ByCategory, ByDate, ByTag, Latest };
