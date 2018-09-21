# WP-GraphQL-Theme
A recreation of the TwentyFifteen Wordpress theme made using [**React.js**](https://reactjs.org) and [**React-Apollo**](https://apollographql.com). The [**WPGraphQL**](https://github.com/wp-graphql/wp-graphql) and [**WPGraphQL-JWT-Authenication**](https://github.com/wp-graphql/wp-graphql-jwt-authentication) plugins need to be installed and activated for theme to work properly. This is meant to serve as a boilerplate for future themes I build with React.js, Apollo. 

## Demo
Coming soon... I think

## Usage 
**Not anywhere close to stable**
1. Run `npm run build` in `client` directory. - If you haven't run the `build` command before but run the docker test enviroment you may have to change the permissions on the build folder or just delete it as the administrator and run `npm run build` again. 
2. Move new `build` directory to the wordpress theme folder and rename it how ever you'd like.
3. Activate new theme in `Wordpress Dashboard` - Remember WPGraphQL and WPGraphQL-JWT-Authenication must be properly installed and activated for this theme to work.

## Testing
Right now the easiest way to get the webpack devServer up and running with a working WPGraphQL plugin is to use the docker environment. Although it's possible without Docker, but its very easy to run into problems.

## Docker Test Environment
Docker-Compose is needed along with Docker. The WP test site is proxied for use with the devServer. You can reach the WPGraphQL endpoint at `/graphql`. Edit your `/etc/hosts` file to add an entry for `wpgraphql.example`, e.g. `127.0.0.1 localhost wpgraphql.example`. You don't have to use `wpgraphql.example` but whatever your use have to change all the entries of `wpgraphql.example` in these files.

* `/docker-compose.yml`
* `/client/.env.development`
* `/client/package.json - `proxy` array take note of the port number and ensure that it matches the first port number `jwilder/nginx-proxy:alpine`'s ports field in `docker-compose.yml`

### Setup instructions
Run the following commands from your terminal in the project root directory.

1. Run `composer install` from inside the `server` directory.

2. Run `npm install && npm run build` from inside the `client` directory. 

3. Run `docker-compose -f docker-compose.dev.yml up -d` - sets up the wordpress test site

4. Wait 30 seconds and navigate to `http://wpgraphql.example:8000/` or the address you setup. Run through the installation and activate the `WPGraphQL Test Settings` plugin. Now you ready to run tests.

5. Run `npm start` from inside `client` directory to run devServer with proxied test site.

## Test Folder Structure
All tests are located in `./client/src/__tests__/` and created using [**React Testing Library**](https://github.com/kentcdodds/react-testing-library) and [**Jest**](https://jestjs.io) 

* `__core_tests__` - WPCore Components tests
* `__customizr_tests__` - WPCustomizr Components tests
* `__router_tests__` - WPRouter Components tests
* `__templates_tests__` - WPTemplates Components tests

## Notes
* Gutenberg is supported.
* I wouldn't recommend changing anything but the contents `/client/public/inc/wp-graphql` in the `/client/public` directory. The contents `/client/public` handle WP theme function and SEO optimization on top of loading the JS application. Neither of which it does a great job at but it function a great base going forward.

## Client-side TODO
1. Create mock data and tests

2. Write proper documentation

3. Add transitions

4. Create WPCustomizr Components

5. (Maybe) Finish Widgets

## Server-side TODO
1. Add and polish sample data created by `WPGraphQL Test Settings`

2. Add a Bootstrap 4 shortcode plugin.
