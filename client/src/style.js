import _ from 'lodash';
import gql from 'graphql-tag';
import merge from 'deepmerge';

export const STYLE_QUERY = gql`
  query StyleQuery( $name: String ) {
    style( name: $name ) {
      name
      value
    }
  }
`;

export const CHANGE_STYLE_MUTATION = gql`
  mutation ChangeStyleMutation( $clientId: String!, $name: String ) {
    changeStyle( clientMutationId: $clientId, name: $name ) {
      name
      value
    }
  }
`;

export const SAVE_STYLE_MUTATION = gql`
  mutation SaveStyleMutation( $clientId: String!, $name: String, $catalog: String ) {
    saveStyle( clientMutationId: $clientId, name: $name, changes: $catalog ) {
      name
      value
    }
  }
`;

export const DELETE_STYLE_MUTATION = gql`
  mutation DeleteStyleMutation( $clientId: String!, $name: String! ) {
    deleteStyle( clientMutationId: $clientId, name: $name ) {
      name
      value
    }
  }
`;

export default class Stylist {
  constructor( client ) {
    this.style = this.get(client);
  }

  /**
   * Queries for style and returns and instance of Stylist with 
   * style properties
   * 
   * @param ApolloClient client - for running style query
   * @param string name - name of style
   * @returns Stylist | null
   */
  async get(client, name = null) {
    const { data } = await client.query({
      query: STYLE_QUERY,
      variables: name ? { name } : undefined,
    });

    if ( data && data.style ) {
      return this.format(data.style);
    }
    return null;
  }

  /**
   * Change currently selected style and returns and instance of Stylist with 
   * newly select style properties
   * 
   * @param ApolloClient client - for running change mutation
   * @param string name - name of style
   * @returns Stylist | null
   */
  async select(client, name) {
    const { data } = await client.mutate({
      mutation: CHANGE_STYLE_MUTATION,
      variables: { name }
    });
  
    if ( data && data.style ) {
      this.style = this.format(data.style);
      return this.style;
    }
    return false;
  };

  /**
   * Save style and changes then returns bool depending on if save of successful
   * 
   * @param ApolloClient client - for running save mutation
   * @param string name - name of style
   * @param Stylist catalog - Stylist storing style properties 
   * @returns bool
   */
  async save(client, name) {
    const catalog = this.printCatalog();
    const { data }  = await client.mutate({
      mutation: SAVE_STYLE_MUTATION,
      variables: { name, catalog }
    });
  
    if ( data ) {
      return true;
    }
    return false;
  };

  /**
   * Delete style then returns bool depending on if save of successful
   * 
   * @param ApolloClient client - for running delete mutation
   * @param string name - name of style
   * @returns bool
   */
  async delete(client, name) {
    const { data }  = await client.mutate({
      mutation: DELETE_STYLE_MUTATION,
      variables: { name }
    });
  };

  find( propName ) {

  }

  format( raw_style ) {
    let formatted_style = {};

    _.each(raw_style, ({ name, value }) => {
      // Split raw name
      const fqns = name.split('__');

      let formatted_prop = {};
      _.eachRight(fqns, (namespace, index) => {
        if ( index === fqns.length - 1 ) {
          formatted_prop = {};
        }
        if ( index !== fqns.length - 1 ) {
          formatted_prop = { [namespace]: formatted_prop };
          return;
        }
        
        formatted_prop = { [namespace]: value }
      });
      formatted_style = merge(formatted_style, formatted_prop);
    });

    console.log(formatted_style);

    return formatted_style;
  }

  printCatalog() {

  }
}