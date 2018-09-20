import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Col } from 'reactstrap';

import { WPTemplates } from 'components/';

/**
 * Wordpress Singular Route Component
 * returns Page, Post, or Attachment depending on 'type' prop
 * 
 * @returns {WPTemplates.Attachment}
 * @returns {WPTemplates.Page}
 * @returns {WPTemplates.Post}
 */
const Singular = (props) => {
  const { type, match, root } = props;
  
  switch(type) {
    case 'attachment':
      return (<WPTemplates.Attachment {..._.omit(props, ['type', 'match'])} />);

    case 'page':
      // Split match.url, remove empty strings, and retrieve page uri
      const uri = match.params[0].replace(/^\/|\/$/, '');
      return (<WPTemplates.Page uri={uri} root={root} />);

    default:
      const { postname, post_id } = match.params;
      if (postname) return (<WPTemplates.Post {..._.omit(props, ['type', 'match'])} slug={postname} />);
      if (post_id)  return (<WPTemplates.Post {..._.omit(props, ['type', 'match'])} id={post_id} />);
      return (<WPTemplates.Error fault="404" as={Col} className="post" />);
  }
}

Singular.propTypes = {
  match: PropTypes.shape({}).isRequired,
  type: PropTypes.string,
};

Singular.defaultProps = {
  type: 'post',
}

export default Singular;
