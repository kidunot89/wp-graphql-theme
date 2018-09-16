import React from 'react';
import { Switch, Route } from 'react-router-dom';

class PostNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route path="/page/:id" render={({ match }) => null}/>
      </Switch>
    );
  }
}

export default PostNavigation;
