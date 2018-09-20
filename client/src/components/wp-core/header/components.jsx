import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Custom Logo Stateless Component
 */
const Logo = ({ sourceUrl, altText, mediaDetails, className }) => {
  if ( mediaDetails && mediaDetails.sizes ) {
    let src;
    let srcset;
    _.each(mediaDetails.sizes, ({ sourceUrl: resizeUrl }, index) => {
      if (index === 0 ) {
        src = resizeUrl;
      }
      srcset = (srcset) ? `${srcset}, ${resizeUrl} ${index + 1}x` : `${resizeUrl} ${index + 1}x`
    });

    return (
      <img alt={altText} src={src} srcSet={srcset} className={className} />
    );
  }
  return (
    <img src={sourceUrl} alt={altText} />
  );
}

/**
 * Site Title Stateless Component
 */
const Title = ({ className, content }) => (
  <h1 className={className}>{content}</h1>
);

/**
 * Site Description / Tagline Stateless Component
 */
const Description = ({ className, content }) => (
  <h2 className={className}><small>{content}</small></h2>
);

export { Logo, Title, Description };