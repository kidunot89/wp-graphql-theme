/**
 *  Theme Starting Point
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import registerServiceWorker from './registerServiceWorker';

import App from './app';

/**
 * Retrieve GraphQL Endpoint
 * 
 * Endpoint retrieved from WordPress on production, but 
 * must be provided manually for Webpack Dev Server. 
 * 
 */

// Delete window.endpoint and span#graphql as a security measure
const graphqlDOM = document.querySelector('#graphql');
let endpoint;
if (graphqlDOM) {
  endpoint = graphqlDOM.getAttribute('data-endpoint');
  graphqlDOM.parentElement.removeChild(graphqlDOM);
}
const httpLink = new HttpLink({
  uri: (process.env.REACT_APP_APOLLO_CLIENT_URI) ? 
    process.env.REACT_APP_APOLLO_CLIENT_URI : endpoint,
  credentials: 'same-origin',
});


// Add the authorization to the headers
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('user-token') || null,
    } 
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    dataIdFromObject: object => object.id || null
  }),
});

// Get app container ID attribute
const appContainer = (process.env.NODE_ENV === 'production') ? 'page' : 'root';

/**
 * Render App to #root
 */
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById(appContainer),
);

registerServiceWorker();
