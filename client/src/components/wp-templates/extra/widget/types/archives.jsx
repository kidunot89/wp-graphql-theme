import React from 'react';
import PropTypes from 'prop-types';

const ArchivesWidget = props => {
  return (
    <div>

    </div>
  );
}

ArchivesWidget.propTypes = {
  id: PropTypes.string.isRequired,
  count: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  urls: PropTypes.arrayOf(PropTypes.string),
};

export default ArchivesWidget;