import React from 'react';
import { cleanup, fireEvent, render, waitForElement } from 'react-testing-library';
import Customizer, { ComponentList, ComponentOptions, Container } from '../customizer';
import { Menu, Login } from '../components';

afterEach(cleanup);

it(`displays a list of stylable components. The selected one is
  isolated and rendered inside the container. Style options pretaining
  to the selected component are displayed on options`, async () => {
  const { container, getByText, getByLabelText } = render(<Customizer />);

  // Check default selected component

  // Confirm selected component has been rendered

  // Change selected component

  // Confirm selected component being rendered has updated

});

it(`displays`, async () => {

});