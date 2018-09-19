/**
 * Sidebar Queries
 */
import { gql } from 'apollo-boost';

/**
 * Fragments
 */
export const WIDGETS_INFO_FRAGMENT = gql`
  fragment WidgetsInfo on Sidebar {
    widgets {
      nodes{
        id
        __typename
      }
    }
  }
`;

export const SIDEBAR_INFO_FRAGMENT = gql`
  fragment SidebarInfo on Sidebar {
    id
    sidebarId
    name
  }
`;

/**
 * Queries
 */
export const SIDEBAR_QUERY = gql`
  query SidebarQuery($id: String!) {
    sidebarBy(id: $id) {
      ...SidebarInfo
      ...WidgetsInfo
    }
  }
  ${SIDEBAR_INFO_FRAGMENT}
  ${WIDGETS_INFO_FRAGMENT}
`;

export default SIDEBAR_QUERY;