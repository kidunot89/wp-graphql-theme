/**
 * Menu Queries
 */
import { gql } from 'apollo-boost';

/**
 * Menu Fragments
 */
export const MENU_ITEM_FRAGMENT = gql`
  fragment NavMenuItem on MenuItem {
    id
    menuItemId
    url
    label
    target
    childItems{
      nodes{
        id
        url
        label
        target   
      }
    }
  }
`;

export const MENU_FRAGMENT = gql`
  fragment NavMenu on Menu {
    menuId
    name
    menuItems{
      nodes{
        id
        ...NavMenuItem
      }
    }
  }
  ${MENU_ITEM_FRAGMENT}
`;

export const MENU_QUERY = gql`
  query MenuQuery( $location: MenuLocation! ) {
    menus( where: { location: $location } ){
      nodes{
        id
        ...NavMenu
      }
    }
  }${MENU_FRAGMENT}
`;

export default MENU_QUERY;