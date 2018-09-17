import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

class PostsList extends Component {
  render() {
    const ItemComponent = this.props.component;
    const { title } = this.props;
    return (
      <Fragment>
        <h2 className="athelas ph3 ph0-l">{title}</h2>
        <Query query={LISTS_QUERY}>
          {({ data, loading, error, refetch }) => {
            if (loading) {
              return (
                <div className="flex w-100 h-100 items-center justify-center pt7">
                  <div>Loading ...</div>
                </div>
              );
            }

            if (error) {
              return (
                <div className="flex w-100 h-100 items-center justify-center pt7">
                  <div>An unexpected error occured.</div>
                </div>
              );
            }

            return (
              <Fragment>
                {data.posts.nodes && _.map(data.posts.nodes, (post, n) => (
                  (n % 2 === 0) ? <ItemComponent key={post.id} {...post} /> : <ItemComponent key={post.id} {...post} flipped />
                ))}
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

PostsList.propTypes = {
  component: PropTypes.func.isRequired,
  title: PropTypes.string,
};

PostsList.defaultProps = {
  title: 'Results',
};

export default PostsList;

export const LISTS_QUERY = gql`
  query First5Query {
    posts(first: 5) {
      nodes{
        title
        id
        date
        content
        featuredImage {
          id
          sourceUrl
          title
        }
        author{
          username
          id
          avatar{
            url
          }
        }
      }
    }
  }
`;
