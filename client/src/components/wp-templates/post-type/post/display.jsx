import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Parser as ReactParser } from 'html-to-react';
import { Col } from 'reactstrap';

const parser = new ReactParser();

export const Title = ({ className, content, dates }) => (<h1 className={className}>{content}</h1>);

export const Content = ({ className, content }) => (<div className={className}>{parser.parse(content)}</div>);
export const Excerpt = ({ className, content }) => (<div className={className}>{parser.parse(content)}</div>)

export const Featured = ({ className, sourceUrl }) => (<img className={className} src={sourceUrl} />);

export const Author = ({ className, avatar, userId, nicename, root }) => (
  <div className={className}>
    { avatar &&  (<img src={avatar.url} alt="avatar" />) }
    <Link to={`${root}/author/${userId}`}>{nicename}</Link>
  </div>
);

export const Dates = ({ dates: { className, created, modified } }) => (
  <Fragment>
    <time className={className}>Created: {created}</time>
    {(modified !== created) && (<time className={className}>Updated: {modified}</time>)}
  </Fragment>
);

export const Tags = ({ content, root }) => null;
export const Categories = ({ content, root }) => null;

class Display extends Component {
  render() {
    const {
      postId, title, content, excerpt,
      date, modified, featuredImage, author,
      tags, categories, root
    } = this.props;

    return (
      <Fragment>
        <Col tag="article" id={`post-${postId}`} className="post w-100 px-0">
          {featuredImage && (<Featured {...featuredImage} className="post-featured"/>)}
          <header className="post-header">
            <Title className="post-title"content={title} dates={{ created: date, updated: modified }} />         
          </header>
          <div className="post-body">
            {excerpt ? (<Excerpt className="post-content"content={excerpt} />) : (<Content className="post-content" content={content} />)}
            <div className="post-details">
              <Author className="post-author-details" {...author} root={root} />
              <Dates className="post-date" dates={{ created: date, updated: modified }} />
              <Tags className="post-tags" content={tags.nodes}/>
              <Categories className="post-categories" content={categories.nodes} root={root} />
            </div>
          </div>
        </Col>
      </Fragment>
    );
  }
}

Display.propTypes = {
  className: PropTypes.string,
  postId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  excerpt: PropTypes.string,
  date: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  featuredImage: PropTypes.shape({}),
  tags: PropTypes.shape({}),
  categories: PropTypes.shape({}),
  root: PropTypes.string.isRequired,
};

Display.defaultProps = {
  className: undefined,
  content: undefined,
  excerpt: undefined,
  featuredImage: undefined,
};

Display.Featured = Featured;
Display.Title = Title;
Display.Content = Content;
Display.Excerpt = Excerpt;
Display.Author = Author;
Display.Dates = Dates;
Display.Tags = Tags;
Display.Categories = Categories;

export default Display;
