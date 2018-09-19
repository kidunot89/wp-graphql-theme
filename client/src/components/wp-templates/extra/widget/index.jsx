import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Container, Row } from 'reactstrap';

import { Error, Loading, wrapper } from 'components/wp-templates/';
import getWidgetQuery from './query';
import * as Widgets from './types';



class WidgetRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, id } = this.props;
    return (
      <Query query={getWidgetQuery(type)} variables={{ id }}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading iconSize="3x" />);
          if (error) return (<Error fault="query" debugMsg={error.message} className="my-4" as="div" />);

          if (data && data.widget) {
            const Widget = Widgets[type];
            
            if (Widget) {
              const { title } = data.widget;

              return (
                <Container>
                  {title && <Row><p className="widget-title">{title}</p></Row>}
                  <Row><Widget id={id} {...data.widget}/></Row>
                </Container>
              )
            }

            return (<Error fault="query" debugMsg={`Widget type ${type} is currently not supported`} className="my-4" />);
          }
        }}
      </Query>
    );
  }
}

WidgetRenderer.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default wrapper(WidgetRenderer);