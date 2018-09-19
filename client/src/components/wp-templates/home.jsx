import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import { Post, Page } from './post-type/';

/**
 * Wordpress Home Template-Part Front Page Component
 */
class HomePage extends Component {
  render() {
    const { id } = this.props;
    return (
      <Fragment>
        <div className="fl w-100">
          <Post as="section" className="mw8 center" first={3} header={() => (<h2>News</h2>)}/>
        </div>
        <div className="fl w-100 bg-light-blue">
          <Page as="section" id={id} />
        </div>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  id: PropTypes.string.isRequired,
}

export default HomePage;