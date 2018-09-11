import React from 'react';
import { apolloRender as render, cleanup, waitForElement } from './apollo-utils';
import { Menu } from '../../components/';

afterEach(cleanup);

it(`fetches data for wordpress menu by menu_location
    setting via wp-graphql plugin and displays it`, async () => {

  const { container, getByText } = render(<Menu id="test-menu" location="primary" pills vertical />);
  expect(container.querySelector('#test-menu')
    .getAttribute('class')).toEqual('nav flex-column nav-pills');
  
  const actual = await waitForElement(() => {
    return [
      getByText('Hello world!'),
      getByText('Sample Page'),
      getByText('Custom Link'),
    ];
  });

  expect(actual[0]).toBeTruthy();
  expect(actual[1]).toBeTruthy();
  expect(actual[2]).toBeTruthy();
});

it(`fetches data for another wordpress menu by menu_location
    setting via wp-graphql plugin and displays it`, async () => {
  const { container, getByText } = render(<Menu id="test-menu" location="social" tabs />);
  expect(container.querySelector('#test-menu')
    .getAttribute('class')).toEqual('nav nav-tabs');

  const actual = await waitForElement(() => {
    return [
      getByText('Facebook'),
      getByText('Twitter'),
      getByText('LinkedIn'),
      getByText('Github'),
    ];
  });

  expect(actual[0]).toBeTruthy();
  expect(actual[1]).toBeTruthy();
  expect(actual[2]).toBeTruthy();
  expect(actual[3]).toBeTruthy();
});