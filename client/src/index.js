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
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Retrieve GraphQL Endpoint
 * 
 * Endpoint retrieved from WordPress on production, but 
 * must be provided manually for Webpack Dev Server. 
 * 
 */
const httpLink = new HttpLink({
  uri: (process.env.REACT_APP_APOLLO_CLIENT_URI) ? 
    process.env.REACT_APP_APOLLO_CLIENT_URI : window.endpoint,
  credentials: 'same-origin',
});

// Delete window.endpoint and script#ep as a security measure
const endpoint = document.querySelector('#ep');
if (endpoint) {
  document.querySelector('body').removeChild(endpoint);
  delete window.endpoint;
}


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
  cache: new InMemoryCache(),
});

/**
 * Render App to #root
 */
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);


registerServiceWorker();
