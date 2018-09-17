import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Parser as ReactParser } from 'html-to-react';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

import PostResult from '../search/';

/**
 * Displays a list of posts
 * @param array posts           - list of post objects
 * @param func RenderComponent  - component to display individual list item  
 */
const PostsList = ({ posts, ItemComponent }) => (
  _.map(posts.nodes, (post) => (<ItemComponent key={`post-${post.postId}`} {...post} />))
);

const PostDetails = () => null;
const PostContent = () => null;
const PostTags = () => null;
const PostFeatured = () => null;

/**
 * Display a single post
 * @param array postId        - post id
 * @param array title         - post title
 * @param array content       - post content
 * @param array date          - date post was created
 * @param array modified      - date post was last updated
 * @param array featuredImage - post featured image object
 * @param array tags          - post tag objects
 * @param array author        - post author objects
 */
const PostDisplay = ({
  postId, title, content, date,
  modified, featuredImage, tags, author,
}) => {
  const parser = new ReactParser();
  return (
    <article id={`post-${postId}`} className="cf ph3 ph5-ns pv5">
      <header className="fn fl-ns w-50-ns pr4-ns">
        {(featuredImage) ? (
          <Fragment>
            <img src={featuredImage.sourceUrl} className="pt3 bt bw2" />
            <h1 className="f2 lh-title fw9 mb3 mt0">
              {title}
            </h1>
          </Fragment>
        ) : (
          <h1 className="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
            {title}
          </h1>
        )}
        <h2 className="f3 mid-gray lh-title">
          {author.avatar && 
            (<img src={author.avatar.url} className="br2 h3 w3 dib" alt="avatar" />)
          }
          <br />
          <Link 
            to={`/author/${author.id}`} 
            className="f4 fw7 dib pa2 no-underline bg-animate bg-white hover-bg-light-blue black"
          >
            {author.username}
          </Link>
        </h2>
        <time className="f6 ttu tracked gray">Created: {date}</time>
        <br />
        {(modified !== date) &&
          (<time className="f6 ttu tracked gray">Updated: {modified}</time>)
        }
      </header>
      <div className="fn fl-ns w-50-ns">
        {parser.parse(content)}
      </div>
    </article>
  );
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.getQueryProps = this.getQueryProps.bind(this);
  }

  getQueryProps() {
    const { id, slug, first, last, where } = this.props;

    if (where) {
      let whereQuery = ARCHIVE_POSTS_QUERY; 
      if (where.author) whereQuery = USER_POSTS_QUERY;

      return { query: whereQuery, variables: { limit: first, ...where } };
    }

    if (first) {
      return { query: POSTS_FIRST_QUERY, variables: { limit: first } };
    }

    if (last) {
      return { query: POSTS_LAST_QUERY, variables: { limit: last } };
    }

    if (slug) {
      return { query: POST_SLUG_QUERY, variables: { slug: slug } };
    }

    return { query: POST_QUERY, variables: { id } };
  }

  render() {
    const { renderList, renderItem, renderPost } = this.props;
    const queryProps = this.getQueryProps();
    return (
      <Query {...queryProps}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (<div>Loading ...</div>);
          }

          if (error && data === undefined) {
            return (<div>{
              (process.env.REACT_APP_GRAPHQL_DEBUG) ?
              error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              )) :
              'An unexpected error occured. Please, try again later.'
            }</div>);
          }

          if (data.posts) {
            const List = renderList || PostsList;
            return (<List posts={data.posts} ItemComponent={renderItem || PostResult } />)
          }

          let post;
          if (data.postBy) {
            post = data.postBy;
          } else if (data.post) {
            post = data.post;
          }

          const Display = renderPost || PostDisplay;
          return (<Display {...post} />)
        }}
      </Query>
    );
  }
}

Post.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  excerpt: PropTypes.bool,
  first: PropTypes.number,
  header: PropTypes.func,
  id: PropTypes.number,
  last: PropTypes.number,
  renderItem: PropTypes.func,
  renderList: PropTypes.func,
  renderPost: PropTypes.func,
  slug: PropTypes.string,
  where: PropTypes.shape({
    month: PropTypes.number,
    year: PropTypes.number,
    author: PropTypes.number,
  }),
};

Post.defaultProps = {
  as: undefined,
  className: undefined,
  excerpt: undefined,
  first: undefined,
  header: undefined,
  id: undefined,
  last: undefined,
  renderList: undefined,
  renderItem: undefined,
  slug: undefined,
  where: undefined,
};

/**
 * POST_QUERY FRAGMENTS
 */
export const POST_CONTENT_FRAGMENT= gql`
  fragment PostContent on Post {
    postId
    content
    date
    modified
    title
  }
`;

export const POST_EXCERPT_FRAGMENT= gql`
  fragment PostExcerpt on Post {
    postId
    excerpt(format: RAW)
    permalink
    date
    title
  }
`;

export const POST_AUTHOR_FRAGMENT = gql`
  fragment PostAuthor on Post {
    author {
      userId
      nicename
      avatar {
        url
        foundAvatar
      }
    }
  }
`;

export const POST_TAGS_FRAGMENT = gql`
  fragment PostTags on Post {
    tags {
      nodes {
        id
        name
      }
    }
  }
`;

export const POST_FEATURED_FRAGMENT = gql`
  fragment PostFeatured on Post {
    featuredImage {
      mediaItemId
      title
      altText
      sourceUrl
    }
  }
`;

/**
 * POST_QUERY
 */
export const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      ...PostContent
      ...PostAuthor
      ...PostTags
      ...PostFeatured
    }
  }
  ${POST_CONTENT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_TAGS_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export const POST_SLUG_QUERY = gql`
  query PostQuery($slug: String!) {
    postBy(slug: $slug) {
      ...PostContent
      ...PostAuthor
      ...PostTags
      ...PostFeatured
    }
  }
  ${POST_CONTENT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_TAGS_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

/**
 * POSTS_QUERY
 */
export const POSTS_FIRST_QUERY = gql`
  query PostsFirstQuery($limit: Int!) {
    posts(first: $limit) {
      nodes {
        ...PostExcerpt
        ...PostAuthor
        ...PostFeatured
      }
    }
  }
  ${POST_EXCERPT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export const POSTS_LAST_QUERY = gql`
  query PostsLastQuery($limit: Int!) {
    posts(last: $limit) {
      nodes {
        ...PostExcerpt
        ...PostAuthor
        ...PostFeatured
      }
    }
  }
  ${POST_EXCERPT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export const ARCHIVE_POSTS_QUERY = gql`
  query ArchivePostsQuery($limit: Int!, $year: Int!, $month: Int!) {
    posts(first: $limit, where: {dateQuery: {year: $year, month: $month}}) {
      nodes {
        ...PostExcerpt
        ...PostAuthor
        ...PostFeatured
      }
    }
  }
  ${POST_EXCERPT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export const USER_POSTS_QUERY = gql`
  query UserPostsQuery($limit: Int!, $author: String!) {
    posts(first: $limit, where: {authorName: $author}) {
      nodes {
        ...PostExcerpt
        ...PostAuthor
        ...PostFeatured
      }
    }
  }
  ${POST_EXCERPT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export default Post;