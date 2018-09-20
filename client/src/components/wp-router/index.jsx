import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Col } from 'reactstrap';

import { WPTemplates } from 'components/';

// WordPress Router Components
import * as Archive from './archive';
import Home from './home';
import Singular from './singular';

/**
 * Wordpress Routes
 * 
 * Pretty permalinks must be on for this to work, as well as the 
 * permalinkStructure must be available an available field the allSetting Type.
 * Loaded in "/public/functions.php" by default  
 */
class WPRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Query query={LOOP_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<WPTemplates.Loading as={Col} />);
          if (error) return (
            <WPTemplates.Error fault="query" debugMsg={error.message} as={Col} className="post" />
          );

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

            const slug = (pageForPosts) ? pageForPosts.slug : false;

            // Get base url
            const { root } = this.props;
            return (
              <Switch>
                <Route exact path={`${root}/`} render={() => (<Home {...{ limit, pageOnFront, root }} />)} />
                <Route exact path={`${root}/:year(\\d{4})`} render={({ match: { params } }) => (<Archive.ByDate {...{ ...params, limit, root }} />)} />
                <Route exact path={`${root}/:year(\\d{4})/:monthnum(\\d{2})`} render={({ match: { params } })=> (<Archive.ByDate {...{ ...params, limit, root }} />)} />
                <Route path={`${root}/category/:name`} render={({ match: { params } }) => (<Archive.ByCategory {...{ ...params, limit, root }} />)} />
                <Route path={`${root}/tag/:name`} render={({ match: { params } }) => (<Archive.ByTag {...{ ...params, limit, root }} />)} />/>
                <Route path={`${root}/author/:name`} render={({ match: { params } }) => (<Archive.ByAuthor {...{ ...params, limit, root }} />)} />
                <Route path={`${root}/search/:input`} render={({ match: { params } }) => (<WPTemplates.Search {...{ ...params, limit, root }} />)} />
                {slug & (<Route exact path={`${root}/${slug}`} render={() => (<Archive.Latest {...{ limit, root }} />)} />)}
                <Route exact path={`${root}${postsPath}`} render={props => (<Singular {...{ ...props, root }} />)} />
                <Route path={`${root}/(.*)`} render={props => (<Singular {...{ ...props, root }} type="page"/>)} />
              </Switch>
            );
          }
        }}
      </Query>
    );
  }
}

WPRouter.propTypes = {
  root: PropTypes.string.isRequired,
};

export const LOOP_QUERY = gql`
  query loopQuery {
    allSettings {
      pageForPosts{
        id
        slug
      }
      pageOnFront
      permalinkStructure
      readingSettingsPostsPerPage
    }
  }
`;

export default WPRouter;