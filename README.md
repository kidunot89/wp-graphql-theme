# WP-Twenty-Fifteen-React.js
A recreation of the TwentyFifteen Wordpress theme made using [**React.js**](https://reactjs.org) and [**React-Apollo**](https://apollographql.com). The [**WPGraphQL**](https://github.com/wp-graphql/wp-graphql) and [**WPGraphQL-JWT-Authenication**](https://github.com/wp-graphql/wp-graphql-jwt-authentication) plugins need to be installed and activated for theme to work properly. This is meant to serve as a boilerplate for future themes I build with React.js, Apollo.

## Usage 
**Not ready for use**

## Testing
Right now the easiest way to get the all tests up and running is to use Docker and Compose. Although it's possible without Docker, but its very easy to run into problems.  

## Setup Docker Test Environment
Run the following commands from your terminal in the project root directory. Docker and Composer need to be installed. The WP test site is proxied for use with the devServer. You can reach the WPGraphQL endpoint at `/graphql`;

1. Run `composer install` from inside the `server` directory - this will install the necessary dependencies

2. Edit your `/etc/hosts` file to add an entry for `wpgraphql.example`, e.g.:

3. `127.0.0.1 localhost wpgraphql.example`

4. Run `docker-compose -f docker-compose.dev.yml up -d` - sets up the wordpress test site

5. Wait 30 seconds and navigate to `http://wpgraphql.example:8000/` Run through the installation and activate the `WPGraphQL Test Setup` plugin. Now you ready to run tests.

6. Run `npm run test` from inside `client` directory to run tests.

7. Run `npm start` from inside `client` directory to run devServer with proxied test site.

## Test Folder Structure
All tests are located in `./client/src/__tests__/` and created using [**React Testing Library**](https://github.com/kentcdodds/react-testing-library) and [**Jest**](https://jestjs.io)

### `__apollo_tests__`

These are integration tests meant to be tested against a wordpress test site. Modify `.env.test` the configuration settings. 

### `__unit_tests__`

These are unit tests and identical to the apollo tests but use Apollo's `MockedProvider` to simulate the WPGraphQL schema

### `__customizer_test__`

These are unit tests of the components that make up the customizer

## TODO
1. Finish apollo tests

2. Create mock data and unit tests

3. Create customizer tests

4. Add build boilerplate configurations
