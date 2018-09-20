/**
 * Post Queries
 */
import { gql } from 'apollo-boost';

/**
 * Fragments
 */
export const POST_CONTENT_FRAGMENT= gql`
  fragment PostContent on Post {
    id
    postId
    content
    date
    modified
    title
  }
`;

export const POST_AUTHOR_FRAGMENT = gql`
  fragment PostAuthor on Post {
    author {
      id
      userId
      nicename
      avatar {
        url
        foundAvatar
      }
    }
  }
`;

export const POST_CATEGORIES_FRAGMENT = gql`
  fragment PostCategories on Post {
    categories {
      nodes {
        id
        name
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
      id
      mediaItemId
      title
      altText
      sourceUrl
    }
  }
`;

/**
 * Queries
 */
export const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      ...PostContent
      ...PostAuthor
      ...PostCategories
      ...PostTags
      ...PostFeatured
    }
  }
  ${POST_CONTENT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_CATEGORIES_FRAGMENT}
  ${POST_TAGS_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export const POST_SLUG_QUERY = gql`
  query PostQuery($slug: String!) {
    postBy(slug: $slug) {
      ...PostContent
      ...PostAuthor
      ...PostCategories
      ...PostTags
      ...PostFeatured
    }
  }
  ${POST_CONTENT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_CATEGORIES_FRAGMENT}
  ${POST_TAGS_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export default ({ id, slug }) => {
  if (slug) {
    return { query: POST_SLUG_QUERY, variables: { slug } };
  } else {
    return { query: POST_QUERY, variables: { id } };
  }
}