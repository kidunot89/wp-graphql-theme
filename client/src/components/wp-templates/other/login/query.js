/**
 * Login Queries and Mutations
 */
import { gql } from 'apollo-boost';

/**
 * Mutations
 */
export const LOGIN_MUTATION = gql`
  mutation LoginUser( $clientId: String!, $login: String!, $password: String! ) {
    login( input: { clientMutationId: $clientId, username: $login, password: $password } ) {
      authToken
      user {
        id
        name
      }
    }
  }
`;

/**
 * Queries
 */
export const VIEWER_QUERY = gql`
  query GetViewer {
    viewer {
      id
      nicename
      firstName
    }
  }
`;