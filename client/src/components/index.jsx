import React, { Component } from 'react';
import Error from './error';
import Header from './header';
import Loading from './loading';
import MainContent from './main-content';
import Login from './apollo/login';
import Menu from './apollo/menu';
import Sidebar from './apollo/sidebar';
import Widget from './apollo/widget';

/**
 * Customizr Component High-Order Component
 * @param React.Component WrappedComponent 
 * @param Theme stylist 
 * @param String styleName 
 */
function customizable(WrappedComponent, stylist, styleName) {
  // ...and returns another component...
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        style: stylist.getComponentStyle(styleName),
        focus: false,
      };
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent style={this.state.style} {...this.props} />;
    }
  };
}

/**
 * Creates a Customizr Component catalog
 * @param Theme stylist - component style catalog 
 */
const customizr = (stylist) => {
  return class {
    constructor() {
      this.add = this.add.bind(this);
      this.remove = this.remove.bind(this);
      this.Header = customizable(Header, stylist, 'header');
      this.MainContent = customizable(MainContent, stylist, 'main-content');
      this.Login = customizable(Login, stylist, 'login');
      this.Menu = customizable(Menu, stylist, 'menu');
      this.Sidebar = customizable(Sidebar, stylist, 'sidebar');
      this.Widget = customizable(Widget, stylist, 'widget');
    }

    add(Component, componentName) {
      this[componentName] = Component;
    }

    remove(componentName) {
      if (componentName !== 'add' || componentName !== 'remove') {
        delete this[componentName];
      }
    }
  };
};

export { 
  customizable, customizr,
  Login, Menu, Sidebar, Widget, 
  Error, Header, Loading, MainContent
};