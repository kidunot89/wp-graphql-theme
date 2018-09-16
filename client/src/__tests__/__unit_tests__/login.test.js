import React from 'react';
import { apolloRender as render, cleanup, fireEvent, waitForElement } from './apollo-utils';
import { Login } from '../../components/';

afterEach(cleanup);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
  }

  render() {
    return(
      <Login
        clearCurrentUser={() => {
          localStorage.setItem('user-token');
          this.setState({ loggedIn: false });
        }}
        setCurrentUser={(authToken) => {
          localStorage.setItem('user-token', authToken);
          this.setState({ loggedIn: true });
        }}
        loggedIn={this.state.loggedIn}
      />
    );
  }
}

it('shows login failed dialogue when invalid login info submitted', async () => {
  const { getByPlaceholderText, getByTestId, getByText } = render(<App />)

  // Input login info
  fireEvent.change(getByPlaceholderText('Enter Login'), { target: { value: 'invalidUser' } });
  fireEvent.change(getByPlaceholderText('Enter Password'), { target: { value: 'qwerty' } });
  
  // Fire click event
  fireEvent.click(getByTestId('login-button'));

  // Retrieve response dialogue and confirm true
  const response = await waitForElement(() => getByText('Invalid Login'));
  expect(response).toBeTruthy();
});

it('show login successful dialogue when valid login info submitted', async () => {
  const { getByPlaceholderText, getByTestId } = render(<App />)
  
  // Input login info
  fireEvent.change(getByPlaceholderText('Enter Login'), { target: { value: process.env.REACT_APP_TEST_USER } });
  fireEvent.change(getByPlaceholderText('Enter Password'), { target: { value: process.env.REACT_APP_TEST_USER_PASSWORD } });
  
  // Fire click event
  fireEvent.click(getByTestId('login-button'));

  // Retrieve response dialogue and confirm true
  const logoutButton = await waitForElement(() => getByTestId('logout-button'));
  expect(logoutButton).toBeTruthy();

  fireEvent.click(logoutButton);

  expect(getByPlaceholderText('Enter Login')).toBeTruthy();
  expect(getByPlaceholderText('Enter Password')).toBeTruthy();

});