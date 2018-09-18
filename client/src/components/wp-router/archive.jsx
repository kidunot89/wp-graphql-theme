import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { WPTemplates } from 'components/';


const archivePropTypes = {
  limit: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const Author = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { author: name }
  };

  return (<WPTemplates.PostsArchive {...props} />);
}

Author.propTypes = archivePropTypes;

const Category = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { category: name }
  };

  return (<WPTemplates.PostsArchive {...props} />);
}

Category.propTypes = archivePropTypes;

const Post = ({ month, limit, year }) => {
  const props = {
    first: limit, 
    where: { month: parseInt(month, 10), year: parseInt(year, 10) }
  };

  return (<WPTemplates.PostsArchive {...props} />);
}

Post.propTypes = {
  limit: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
};

const Tag = ({ limit, name }) => {
  const props = {
    first: limit, 
    where: { tag: name }
  };

  return (<WPTemplates.PostsArchive {...props} />);
}

Tag.propTypes = archivePropTypes;

export { Author, Category, Post, Tag };