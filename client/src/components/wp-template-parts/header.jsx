import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import  { gql } from 'apollo-boost';

import { Error, Loading, GraphQLErrorMessage } from './';

export const HeaderLogo = ({ customLogo }) => {
  const { mediaItemId, sourceUrl, altText } = customLogo;
  if (customLogo) {
    return (
      <Link to="/" className="bg-black-80 ba b--black dib pa3 w2 h2 br-100">
        <img className="mx-auto d-block w-50" id={`media-item-${mediaItemId}`} src={sourceUrl} alt={altText || undefined} />
      </Link>
    );
  }
  return null;
};

export const HeaderContent = ({ title, description }) => {
  if (title) {
    return (
      <Fragment> 
        <h1 className="mt-2 text-center">{title}</h1>
        {description && <p className="h1"><small className="text-muted">{description}</small></p>}
      </Fragment>
    );
  }
  return null;
};

const HeaderDisplay = (props) => {
  const { themeMods, generalSettings } = props;
  if (generalSettings) {
    return (
      <header className="mx-0 my-5 px-5 py-0">
        <HeaderLogo {...themeMods} />
        <HeaderContent {...generalSettings} />
      </header>
    );
  }
  return (
    <Error
      header="Error"
      message={(process.env.REACT_APP_DEBUG) ? "generalSettings not found" : "An unexpected problem occured"}
    />
  );
};

/**
 * Wordpress Template-Part Header Component
 */
class Header extends Component {
  render() {
    return (
      <Query query={HEADER_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (<Loading message="Loading" />);
          }
          if (error) {
            return ( <Error header="Error" message={() => (<GraphQLErrorMessage error={error} />)} /> );
          }
          
          return (
            <HeaderDisplay {...data} >
              {this.props.children}
            </HeaderDisplay>
          );
        }}
      </Query>
    );
  }
}

export const HEADER_QUERY = gql`
  query HeaderQuery {
    generalSettings{
      title
      description
    }
    themeMods{
      customLogo{
        mediaItemId
        sourceUrl
        title
        altText
      }
    }
  }
`;

export default Header;


