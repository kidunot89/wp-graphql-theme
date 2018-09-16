import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

import Posts from '../wp-template-parts/post-type/';

/**
 * returns String representation of Date Month
 * @param number monthNum - number of month
 */
export const toMonthName = (monthNum) => {
  switch(monthNum) {
    case 1:
      return 'January';
    
    case 2:
      return 'February';
    
    case 3:
      return 'March';
    
    case 4:
      return 'April';
    
    case 5:
      return 'May';
    
    case 6:
      return 'June';

    case 7:
      return 'July';
      
    case 8:
      return 'August';
    
    case 9:
      return 'September';

    case 10:
      return 'October';

    case 11:
      return 'November';
    
    case 12:
      return 'December';
    
    default:
      return '';
  }
}

export const ArchiveHeader = ({ text }) => {
  return (<h2 className="athelas ph3 ph0-l">{text}</h2>)
}

/**
 * Wordpress Archive Template Component
 * 
 * renders a collection of post base on year and month
 */
class Archive extends Component {
  constructor(props) {
    super(props);
    
    this.getPostsProps = this.getPostsProps.bind(this);
  }

  /**
   * Build Posts Object
   */
  getPostsProps() {
    const { match, limit } = this.props;
    console.log(match);
    
    const className = 'fl w-100';
    const first = limit;
  
    // Format month and year params
    const { month, year } = { month: parseInt(match.params.monthnum, 10), year: parseInt(match.params.year, 10) }
    const header = () => (<ArchiveHeader text={`${toMonthName(month)} ${year}`} />);

    return { className, first, header, where: { month, year } }
  }

  render() {
    return (<Posts {...this.getPostsProps()} />)
  }
}

Archive.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  limit: PropTypes.number.isRequired,
};

export default Archive;