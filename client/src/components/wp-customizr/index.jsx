import React, { Component } from 'react';

const SettingsPanel = () => (<div className="panel"></div>)

class Customizr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children } = this.props;
    return (
      <div className="customizr">
        <SettingsPanel />
        {children}
      </div>
    )
  }
}

export default Customizr;
