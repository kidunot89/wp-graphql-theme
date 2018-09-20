import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading } from 'components/wp-templates';
import Display from './display';
import getQueryProps from './query';

class Post extends Component {
  render() {
    return (
      <Query {...getQueryProps(this.props)}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading as={Col} />);
          if (error) return (
            <Error fault="query" debugMsg={error.message} as={Col} />
          );

          if (data && (data.post || data.postBy)) {
            const postData = data.post || data.postBy;
            return (
              <Display className="post" root={this.props.root} {...postData} />
            );
          }
        }}
      </Query>
    );
  }
}

Post.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  root: PropTypes.string.isRequired,
};

Post.defaultProps = {
  id: undefined,
  slug: undefined,
};

Post.Display = Display;

export default Post;