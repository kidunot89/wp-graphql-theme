import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Excerpt = ({ postId, title, excerpt, permalink }) => (
  <div id={`post-${postId}`} className="w-100 w-60-ns pr3-ns order-2 order-1-ns">
    <Link to={permalink}><h1 className="f3 athelas mt0 lh-title">{title}</h1></Link>
    <p className="f5 f4-l lh-copy athelas" dangerouslySetInnerHTML={{ __html: excerpt }} />
  </div>
);

const FeaturedImage = ({ mediaItemId, title, sourceUrl, altText  }) => (
  <div className="pl3-ns order-1 order-2-ns mb4 mb0-ns w-100 w-40-ns">
    <img id={`media-${mediaItemId}`} src={sourceUrl} className="db" alt={altText || title} />
  </div>
);

const AuthorDetails = ({ userId, nicename, date }) => (
  <Fragment>
    <p className="f6 lh-copy gray mv0">
      By <Link to={`/user/:${userId}`}><span className="ttu">{nicename}</span></Link>
    </p>
    <time className="f6 db gray">{date}</time>
  </Fragment>
);

class PostResult extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) return true;
  }
  render() {
    const { postId, title, date, excerpt, permalink, featuredImage, author } = this.props;
    return (
      <article className="pv4 bt bb b--black-10 ph3 ph0-l">
        <div className="flex flex-column flex-row-ns">

          <Excerpt {...{ postId, title, excerpt, permalink }} />
          {featuredImage && <FeaturedImage {...featuredImage} />}
        </div>
        <AuthorDetails {...{ ...author, date }} />
        
      </article>
    );
  }
}

PostResult.propTypes = {
  postId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  permalink: PropTypes.string.isRequired,
  author: PropTypes.shape({
    userId: PropTypes.number.isRequired,
      nicename: PropTypes.string.isRequired,
      avatar: PropTypes.shape({
        url: PropTypes.string.isRequired,
        foundAvatar: PropTypes.bool.isRequired,
      }),
  }).isRequired,
  content: PropTypes.string,
  featuredImage: PropTypes.shape({
    mediaItemId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
  }),
  flipped: PropTypes.bool,
};

PostResult.defaultProps = {
  content: undefined,
  excerpt: undefined,
  featuredImage: undefined,
}

export default PostResult;