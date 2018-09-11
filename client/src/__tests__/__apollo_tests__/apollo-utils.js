// apollo-utils.js
import React from 'react';
import { render } from 'react-testing-library';
import { ApolloProvider } from "react-apollo";
import ApolloClient from 'apollo-client';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
};

global.localStorage = new LocalStorageMock;

const customRender = (node, ...options) => {
  
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_APOLLO_CLIENT_URI,
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
    cache: new InMemoryCache(),
  });

  return render(
    <ApolloProvider client={client}>
      {node}
    </ApolloProvider>,
    ...options,
  );
}

// re-export everything
export * from 'react-testing-library'

// override render method
export {customRender as apolloRender}
