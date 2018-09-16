import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Post, Page, Attachment } from '../wp-template-parts/post-type/'

class PostType extends Component {
  render() {
    const { type, match } = this.props;
    
    switch(type) {
      case 'page':
        // Split match.url, remove empty strings, and retrieve page uri
        const uri = match.params[0].replace('^\/|\/$', '');
        return (<Page uri={uri} />);

      case 'attachment':
        return (<Attachment {..._.omit(this.props, 'type')} />);

      default:
        const { postname, post_id } = match.params;

        if (postname) {
          return (<Post {..._.omit(this.props, 'type')} slug={postname} />);
        }

        if (post_id) {
          return (<Post {..._.omit(this.props, 'type')} id={post_id} />);
        }
    }
  }
}

PostType.propTypes = {
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  type: PropTypes.string,
};

PostType.defaultProps = {
  type: 'post',
}

export default PostType;