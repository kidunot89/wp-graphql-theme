import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
import _ from 'lodash';

// WordPress Template Components
import { NotFound, Archive, Home, PostType, Search } from './components/wp-template/';

/**
 * Wordpress Routes
 * 
 * Pretty permalinks must be on for this to work, as well as the 
 * permalinkStructure must be available an available field the allSetting Type.
 * Loaded in "/public/functions.php" by default  
 */
class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Query query={LOOP_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (<div>Loading ...</div>);
          }

          if (error) {
            return (
              <div>
              {
                (process.env.REACT_APP_DEBUG) ?
                error.graphQLErrors.map(({ message }, i) => (
                  <span key={i}>{message}</span>
                )) :
                'An unexpected error occured.'
              }
              </div>
            );
          }

          const structure = data.allSettings.permalinkStructure;
          const limit = data.allSettings.readingSettingsPostsPerPage;

          // For ugly permalinks
          if (!structure) {
            return (
              <div>{
                (process.env.REACT_APP_DEBUG) ?
                'Pretty permalinks must be on' :
                'An unexpected error occured.'
              }</div>
            );
          }
          
          let postPath = structure.replace(/%([A-z]+)%/g, ':$1');
          postPath = postPath.replace(/:(monthnum|day|hour|minute|second)/g, ':$1(\\d{2})');
          postPath = postPath.replace(/:(post_id)/g, ':$1(\\d{3})');
          postPath = postPath.replace(/:(year)/g, ':$1(\\d{4})');
          return (
            <Switch>
              <Route exact path="/" render={(props) => (<Home {...props} limit={limit} />)} />
              <Route exact path="/:year(\d{4})/:monthnum(\d{2})" render={(props)=> (<Archive {...props} limit={limit} />)} />
              <Route path="/category/:name" render={(props) => (<Archive {...props} limit={limit} />)} />
              <Route path="/tag/:name" render={(props) => (<Archive {...props} limit={limit} />)} />/>
              <Route path="/author/:name" render={(props) => (<Archive {...props} limit={limit} />)} />/>
              <Route path="/search/:input" component={Search}/>
              <Route path={postPath} render={(props)=> (<PostType {...props} />)} />
              <Route path='/(.*)' render={(props)=> (<PostType {...props} type="page"/>)} />
            </Switch>
          );
        }}
      </Query>
    );
  }
}

export const LOOP_QUERY = gql`
  query loopQuery {
    allSettings {
      permalinkStructure
      readingSettingsPostsPerPage
    }
  }
`;

export default Routes;