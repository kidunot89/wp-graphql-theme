import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading, Post } from 'components/wp-templates';
import getQueryProps from './query';

class Archive extends Component {
  render() {
    const { first, where, root } = this.props;
    return (
      <Query {...getQueryProps(first, where)}>
        {({ data, error, loading, refetch}) => {
          if (loading) return (<Loading as={Col} className="post" />);
          if (error) return (<Error fault="query" debugMsg={error.message} as={Col} className="post" />);

          if (data && data.posts) {
            const { nodes } = data.posts;
            return _.map(nodes, (props) => (<Post.Display root={root} className="post" key={props.id} excerpt {...props} />));
          }
          return (<Error fault="404" message="No posts found" as={Col} className="post"/>);
        }}
      </Query>
    );
  }
}

Archive.propTypes = {
  first: PropTypes.number,
  where: PropTypes.shape({
    month: PropTypes.number,
    year: PropTypes.number,
    tag: PropTypes.string,
    category: PropTypes.string,
  }),
  root: PropTypes.string.isRequired,
};

Archive.defaultProps = {
  first: 7,
  where: {},
};

export default Archive;