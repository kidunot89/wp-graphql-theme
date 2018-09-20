import { gql } from 'apollo-boost';

const PAGES = `
  pages( first: $limit, where: {search: $input } ){
    nodes {
      id
      pageId
      content
      title
      permalink
    }
  }
`;

const POSTS = `
  posts( first: $limit, where: {search: $input } ){
    nodes {
      id
      postId
      content
      title
      permalink
      tags{ nodes{ id name } }
      categories{ nodes{ id name } }
      featuredImage{ id altText sourceUrl }
    }
  }
`;

export default (input, filter, limit) => {
  let queryString;
  switch(filter) {
    case 'page':
      queryString = `${PAGES}`
      break;

    case 'post':
      queryString = `${POSTS}`
      break;

    default:
      queryString = `${POSTS}${PAGES}`
  }

  queryString = `
  query SearchQuery($limit: Int!, $input: String!) {
    ${queryString}
  }`

  return { query: gql`${queryString}`, variables: { input, limit } };
}