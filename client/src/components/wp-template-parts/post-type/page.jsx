import React, { Component } from 'react';
import { Parser as ReactParser } from 'html-to-react';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';
import PropTypes from 'prop-types';

import { Error } from '../';
import Post from './post';

class Page extends Component {
  constructor(props) {
    super(props);

    this.getQueryProps = this.getQueryProps.bind(this);
  }

  getQueryProps() {
    const { id, front, uri } = this.props;
    if (front) {
      return { query: FRONT_PAGE_QUERY };
    }
    if (uri) {
      return { query: PAGE_BY_URI_QUERY, variables: { uri } };
    }
    return { query: PAGE_QUERY, variables: { id } };
  }

  render() {
    const queryProps = this.getQueryProps();
    const { front, uri } = this.props;
    return (
      <Query {...queryProps}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (<div>Loading ...</div>);
          }

          if (error) {
            console.error(queryProps);
            return (<div>{
              (process.env.REACT_APP_DEBUG) ?
              error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              )) :
              'An unexpected error occured. Please, try again later.'
            }</div>);
          }


          const parser = new ReactParser();
          const { pageForPosts, readingSettingsPostsPerPage } = data.allSettings;
          let content;
          let pageId;
          if (front) {
            content = data.allSettings.pageOnFront.content;
            pageId = data.allSettings.pageOnFront.pageId;
          } else if (uri) {
            content = data.pageBy.content;
            pageId = data.pageBy.pageId;
          } else if (data.page) {
            content = data.page.content;
            pageId = data.page.pageId;
          } else {
            return (
              <Error
                header={() => (<h2>404</h2>)}
                message={() => (<p>Sorry we can't locate the page you are looking for.</p>)}
              />
            );
          }

          if (pageId === pageForPosts) {
            return (<Post className="fl w-100" first={readingSettingsPostsPerPage} header={() => (<h2>News</h2>)}/>);
          }
          return (
            <div className="fn fl-ns w-50-ns">
              {parser.parse(content)}
            </div>
          );
        }}
      </Query>
    );
  }
}

/**
 * Page PropTypes
 */
Page.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  front: PropTypes.bool,
  id: PropTypes.number,
  uri: PropTypes.string,
  where: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }),
};

Page.defaultProps = {
  as: undefined,
  className: undefined,
  front: undefined,
  id: undefined,
  uri: undefined,
  where: undefined,
}

/**
 * Page Fragments
 */
export const PAGE_CONTENT_FRAGMENT = gql`
  fragment PageContent on Page {
    pageId
    title
    content
    date
    modified
  }
`

/**
 * AllSetting Fragments
 */
export const ALL_SETTINGS_FRAGMENT = gql`
  fragment AllSettings on Settings {
      pageForPosts
      readingSettingsPostsPerPage
  }
`

/**
 * Page Queries
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
  ${ALL_SETTINGS_FRAGMENT}
`;

export const PAGE_BY_URI_QUERY = gql`
  query PageByUriQuery($uri: String!) {
    pageBy(uri: $uri) {
      ...PageContent
    }
    allSettings {
      ...AllSettings
    }
  }
  ${PAGE_CONTENT_FRAGMENT}
  ${ALL_SETTINGS_FRAGMENT}
`;

export const FRONT_PAGE_QUERY = gql`
  query FrontPageQuery {
    allSettings{
      pageOnFront{
        ...PageContent
      }
      ...AllSettings
    }
  }
  ${PAGE_CONTENT_FRAGMENT}
  ${ALL_SETTINGS_FRAGMENT}
`;

export default Page;