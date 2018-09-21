import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading } from 'components/wp-templates';
import View from './view';
import getQueryProps from './query';

class Post extends Component {
  render() {
    const { id, slug, root } = this.props;
    return (
      <Query {...getQueryProps({id, slug})}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading as={Col} />);
          if (error) return (<Error fault="query" debugMsg={error.message} as={Col} className="post" />);

          if (data && (data.post || data.postBy)) {
            const postData = data.post || data.postBy;
            
            return (<View root={root} singular {...postData} />);
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

Post.View = View;

export default Post;