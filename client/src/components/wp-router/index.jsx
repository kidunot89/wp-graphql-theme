import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
import _ from 'lodash';

import { WPTemplates } from 'components/';

// WordPress Router Components
import * as Archive from './archive';
import Home from './home';
import Search from './search';
import Singular from './singular';

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
          if (loading) return (<WPTemplates.Loading page />);
          if (error) return (<WPTemplates.Error page message={error.message} />);

          if ( data && data.allSettings ) {
            const {
              pageForPosts,
              pageOnFront,
              permalinkStructure: structure,
              readingSettingsPostsPerPage: limit,
            } = data.allSettings;

            // For ugly permalinks
            if (!structure) {
              if (error) return (<WPTemplates.Error page message={'Pretty permalinks must be on'} />);
            }
            
            // Format post-type path from permalink structure
            const postsPath = structure.replace(/%([A-z]+)%/g, ':$1')
            .replace(/:(monthnum|day|hour|minute|second)/g, ':$1(\\d{2})')
            .replace(/:(post_id)/g, ':$1(\\d{3})')
            .replace(/:(year)/g, ':$1(\\d{4})');

            return (
              <Switch>
                <Route exact path="/" render={(props) => (<Home {...{ ...props, limit, pageOnFront }} />)} />
                <Route exact path="/:year(\d{4})/:month(\d{2})" render={({ match: params })=> (<Archive.Post {...{ ...params, limit }} />)} />
                <Route path="/category/:name" render={({ match: params }) => (<Archive.Category {...{ ...params, limit }} />)} />
                <Route path="/tag/:name" render={({ match: params }) => (<Archive.Tag {...{ ...params, limit }} />)} />/>
                <Route path="/author/:name" render={({ match: params }) => (<Archive.Author {...{ ...params, limit }} />)} />/>
                <Route path="/search/:input" component={Search}/>
                <Route path={postsPath} render={(props)=> (<Singular {...props} />)} />
                <Route path='/(.*)' render={(props)=> (<Singular {...props} type="page"/>)} />
              </Switch>
            );
          }
        }}
      </Query>
    );
  }
}

export const LOOP_QUERY = gql`
  query loopQuery {
    allSettings {
      pageForPosts
      pageOnFront
      permalinkStructure
      readingSettingsPostsPerPage
    }
  }
`;

export default Routes;