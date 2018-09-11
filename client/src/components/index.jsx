import React, { Component } from 'react';
import Header from './header';
import MainContent from './main-content';
import Attachment from './apollo/attachment';
import List from './apollo/list';
import ListItem from './apollo/list-item';
import Login from './apollo/login';
import Menu from './apollo/menu';
import Page from './apollo/page';
import Post from './apollo/post';
import Routes from './apollo/routes';
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
      this.Attachment = customizable(Attachment, stylist, 'attachment');
      this.List = customizable(List, stylist, 'list');
      this.ListItem = customizable(ListItem, stylist, 'list-item');
      this.Login = customizable(Login, stylist, 'login');
      this.Menu = customizable(Menu, stylist, 'menu');
      this.Post = customizable(Post, stylist, 'post');
      this.Page = customizable(Page, stylist, 'page');
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
  customizable, customizr, Attachment, List,
  ListItem, Login, Menu, Post, 
  Page, Routes, Sidebar, Widget, 
  Header, MainContent
};