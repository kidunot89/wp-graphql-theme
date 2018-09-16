import React from 'react';

const Error = ({ as, className, header = 'Sorry, an unexpected error occured.', message = 'Please, try again later.' }) => {
  const Header = (typeof header === 'function') ? header : () => (<h2>{header}</h2>);
  const Message = (typeof message  === 'function') ? message : () => (<p>{message}</p>);
  const containerClassName = className || 'fatal-error';
  return (
    <div className={containerClassName}>
      <Header />
      <Message />
    </div>
  )
};

export default Error;

const GraphQLErrorMessage = ({ error }) => {
  if (process.env.REACT_APP_DEBUG) {
    return (
      <p>
        {error.graphQLErrors.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
      </p>
    );
  }
  return (<p>An unexpected error occured</p>);
};

const Loading = ({ as, className, message = 'Loading...' }) => {
  const Message = (typeof message === 'function') ? message : () => (<h2>{message}</h2>);
  const containerClassName = className || 'loading';
  return (
    <div className={containerClassName}>
      <Message />
    </div>
  )
};

const ImageNotFound = ({ className, src }) => {
  const imgClassName = className || 'img-not-found';
  const imgSrc = src || '/assets/default.png'
  return (<img className={imgClassName} src={imgSrc} alt="" />);
};

export { GraphQLErrorMessage, Loading, ImageNotFound };