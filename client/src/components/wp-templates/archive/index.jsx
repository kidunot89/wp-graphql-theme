import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return null;
  }
}

Archive.propTypes = {
  first: PropTypes.number,
  where: {
    month: PropTypes.number,
    year: PropTypes.number,
    tag: PropTypes.string,
    category: PropTypes.string,
  },
};

export default Archive;