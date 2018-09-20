import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Parser as ReactParser } from 'html-to-react';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading } from 'components/wp-templates';
import getQueryProps from './query';

class Page extends Component {
  render() {
    const { id, uri } = this.props;
    return (
      <Query {...getQueryProps(id, uri)}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading as={Col} className="post" />);
          if (error) return (
            <Error fault="query" debugMsg={error.message} as={Col} className="post" />
          );

          const parser = new ReactParser();
          const { page, pageBy } = data;

          if ( page || pageBy ) {
            const { title, content } = page || pageBy;
            return (
              <Col className="post">
                <header className="post-header">
                  <h1 className="post-title">{title}</h1>
                </header>
                <div className="post-body">{parser.parse(content)}</div>
              </Col>
            );
          }
          
          return (<Error fault="404" as={Col} className="post" />);
        }}
      </Query>
    );
  }
}

/**
 * Page PropTypes
 */
Page.propTypes = {
  id: PropTypes.string,
  uri: PropTypes.string,
};

Page.defaultProps = {
  id: undefined,
  uri: undefined,
}

export default Page;
