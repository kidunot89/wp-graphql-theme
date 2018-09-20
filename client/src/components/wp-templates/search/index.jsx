import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import {
  Button, Col, Input, InputGroup,
  InputGroupButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'

import { Error, Loading } from 'components/wp-templates';
import getQueryProps from './query';

library.add(fas);

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.filter = this.filter.bind(this);
    this.inputBar = this.inputBar.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = { input: '', filter: 'all', isOpen: false };
  }

  handleInput({ target: { value }}) {
    this.setState({ input: value });
  }

  filter(filter) {
    this.setState({ filter })
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  inputBar() {
    const { filter, input } = this.state;

    return (
      <InputGroup>
        <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.isOpen} toggle={this.toggle}>
          <Button><FontAwesomeIcon icon={['fas', 'search']} /></Button>
          <DropdownToggle split />
          <DropdownMenu>
            <DropdownItem onClick={this.filter.bind(this, 'all')}>
              {filter === 'all' && (<FontAwesomeIcon icon={['fas', 'check']} />)}All
            </DropdownItem>
            <DropdownItem onClick={this.filter.bind(this, 'post')}>
              {filter === 'post' && (<FontAwesomeIcon icon={['fas', 'check']} />)} Posts Only
            </DropdownItem>
            <DropdownItem onClick={this.filter.bind(this, 'page')}>
              {filter === 'page' && (<FontAwesomeIcon icon={['fas', 'check']} />)} Pages Only
            </DropdownItem>
          </DropdownMenu>
        </InputGroupButtonDropdown>
        <Input value={input} onChange={this.handleInput} placeholder="Search..." />
      </InputGroup>
    )
  }

  render() {
    const { inputBar: InputBar } = this;
    const { filter, input } = this.state;
    return (
      <Fragment>
        <Col>
          <InputBar />
        </Col>
        { input !== '' ? (
          <Query {...getQueryProps(input, filter, this.props.limit)}>
            {({ data, loading, error, refetch }) => {
              if (loading) return (<Loading as={Col} className="post" />);
              if (error) return (
                <Error fault="query" debugMsg={error.message} as={Col} className="post" />
              );

              if(data) {
                // To Print Out Results
                console.log(data);
              }
              
              return (<Error fault="404" message="No content found related to your input" as={Col} className="post" />);
            }}
          </Query>
        ) : (
          <Loading
            as={Col}
            message="Enter some keyword into the search bar"
            className="post"
            altIcon={() => (<FontAwesomeIcon icon={['fas', 'hand-pointer']} size="10x" />)}
          />
        ) } 
      </Fragment>
    );
  }
}

/**
 * Page PropTypes
 */
Search.propTypes = {
  input: PropTypes.string,
  limit: PropTypes.number.isRequired,
  root: PropTypes.string.isRequired,
};

Search.defaultProps = {
  input: undefined,
}

export default Search;