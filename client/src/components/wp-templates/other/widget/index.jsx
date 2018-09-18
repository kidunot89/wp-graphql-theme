import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Col } from 'reactstrap';

import { Error, Loading, wrapper } from 'components/wp-templates/';
import getWidgetQuery from './query';



class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, id } = this.props;
    console.log(getWidgetQuery(type));
    return (
      <Col>
        <Query query={getWidgetQuery(type)} variables={{ id }}>
        {({ data, loading, error, refetch }) => {
          if (loading) return (<Loading page />);
          if (error) return (<Error fault="query" debugMsg={error.message} className="my-4" />);

          if (data && data.widget) {
            console.log(data);
            return null;
          }
        }}
        </Query>
      </Col>
    );
  }
}

Widget.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default wrapper(Widget);