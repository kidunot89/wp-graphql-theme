import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import { FrontPage } from '../wp-template-parts/home/';
import { Post } from '../wp-template-parts/post-type/';

/**
 * Wordpress Home Template Component
 * 
 * renders Front-Page template-part if pageOnFront exist otherwise
 * renders Post template-part
 */
class Home extends Component {

  render() {
    return (
      <Query query={HOME_QUERY} >
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                {(process.env.REACT_APP_DEBUG) ?
                error.graphQLErrors.map(({ message }, i) => (
                  <span key={i}>{message}</span>
                )) :
                'An unexpected error occured.'}
              </div>
            );
          }

          const { pageOnFront, readingSettingsPostsPerPage } = data.allSettings;
          if (pageOnFront) {
            return (<FrontPage id={pageOnFront.pageId} />);
          }
          return (<Post className="fl w-100" first={readingSettingsPostsPerPage} header={() => (<h2>News</h2>)}/>)
        }}
      </Query>
    );
  }
}

Home.propTypes = {
  match: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export const HOME_QUERY = gql`
  query HomeQuery {
    allSettings{
      pageOnFront {
        pageId
      }
      readingSettingsPostsPerPage
    }
  }
`;

export default Home;