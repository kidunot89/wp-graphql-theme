/**
 * Page Queries
 */
import { gql } from 'apollo-boost';

/**
 * Fragments
 */
export const PAGE_CONTENT_FRAGMENT = gql`
  fragment PageContent on Page {
    pageId
    title
    content
    date
    modified
  }
`;

/**
 * Queries
 */
export const PAGE_QUERY = gql`
  query PageQuery($id: ID!) {
    page(id: $id){
      ...PageContent
    }
    allSettings {
    ...AllSettings
    }
  }
  ${PAGE_CONTENT_FRAGMENT}
`;

export const PAGE_BY_URI_QUERY = gql`
  query PageByUriQuery($uri: String!) {
    pageBy(uri: $uri) {
      ...PageContent
    }
  }
  ${PAGE_CONTENT_FRAGMENT}
`;

/**
 * Function for selecting a query based on provided props
 * 
 * @param {string} id - global id for requested page
 * @param {string} uri - uri for requested page
 */
export default (id, uri) => {
  if (uri) {
    return { query: PAGE_BY_URI_QUERY, variables: { uri } };
  }

  return { query: PAGE_QUERY, variables: { id } };
};
