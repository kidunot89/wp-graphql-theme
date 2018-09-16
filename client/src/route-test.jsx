import React, { Component } from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { Nav, Container, Row, Col } from 'reactstrap';

class RouteTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { match } = this.props;
    const url = (match.url === '/') ? '' : match.url;
    return (
      <Container fluid className="flex-fill">
        <Row className="justify-content-center">
          <Nav pills>
            <NavLink exact to={`${url}/`} className="nav-link" activeClassName="active">Route One</NavLink>
            <NavLink to={`${url}/two`} className="nav-link" activeClassName="active">Route Two</NavLink>
            <NavLink to={`${url}/three`} className="nav-link" activeClassName="active">Route Three</NavLink>
          </Nav>
        </Row>
        <Row className="flex-fill justify-content-center align-items-center">
          <h1 className="display-1">
            <Switch>
              <Route exact path={`${url}/`} render={() => "Route One"} />
              <Route path={`${url}/two`} render={() => "Route Two"} />
              <Route path={`${url}/three`} render={() => "Route Three"} />
            </Switch>
          </h1>
        </Row>
      </Container>
    );
  }
}

export default RouteTest;