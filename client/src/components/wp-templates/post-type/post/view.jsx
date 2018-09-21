import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom'
import { Parser as ReactParser } from 'html-to-react';
import { Col } from 'reactstrap';

const parser = new ReactParser();

/**
 * Renders list of taxonomy links
 */
export const TaxonomyView = ({ className, taxonomy, terms, root }) => (
  <span className={className}>
    <strong className="taxonomy-name text-capitalize">
      {taxonomy === 'tag' ? 'Tagged' : 'Posted in'}
    </strong>
    {_.map(terms, ({ name, id }) => (
      <Link to={`${root}/${taxonomy}/${name}`} key={id}>{name}</Link>
    ))}
  </span>
);

/**
 * Render post view
 */
class PostView extends Component {
  constructor(props) {
    super(props);
    this.entryTitle = this.entryTitle.bind(this);
    this.entryMeta = this.entryMeta.bind(this);
    this.entryFeatured = this.entryFeatured.bind(this);
    this.entryContent = this.entryContent.bind(this);
  }

  entryTitle() {
    const { title, singular, root, permalink: url } = this.props;
    
    if (singular) return (<h1 className="entry-title">{title}</h1>);
    
    return (
      <Link to={`${root}/${url}`}><h2 className="entry-title">{title}</h2></Link>
    );
  }

  entryMeta() {
    const { date, modified, author: { userId, nicename }, root } = this.props;
    const created = new Date(date);
    const updated = (modified) ? new Date(modified) : false;
    const format = { month: 'long', day: 'numeric', year: 'numeric' }
    return (
      <div className="entry-meta">
        <span className="posted-on">
          Posted on
          {' '}<time className="entry-date published">{created.toLocaleDateString("en-US", format)}</time>
          {updated && (<time className="updated">{updated.toLocaleDateString("en-US", format)}</time>)}
        </span>
        <span className="byline">
          {' '}by <Link to={`${root}/author/${userId}`}>{nicename}</Link>
        </span>
      </div>
    );
  }

  entryContent() {
    const { excerpt, content, isGutenPost } = this.props;

    return (
      <div className={`entry-content${isGutenPost ? ' guten-content' : ''}`}>
        {parser.parse(excerpt || content)}
      </div>
    );
  }

  entryFeatured() {
    const { featuredImage } = this.props;
    if (featuredImage) {
      const { altText, sourceUrl } = featuredImage;
      return (<img className="entry-featured" alt={altText} src={sourceUrl} />)
    }
    return null;
  }

  render() {
    const { 
      postId, tags, categories, root,
      isGutenPost, singular
    } = this.props;

    const {
      entryTitle: Title,
      entryMeta: Meta,
      entryFeatured: Featured,
      entryContent: Content,
    } = this;

    if(isGutenPost && singular) return (
      <Col tag="article" id={`post-${postId}`} className="post">
        <Content />
        <footer className="entry-footer">
          <Meta />
          <TaxonomyView className="tag-links" taxonomy="tag" terms={tags.nodes} root={root} />
          <TaxonomyView className="tag-links" taxonomy="category" terms={categories.nodes} root={root} />
        </footer>
      </Col>
    );

    return (
      <div tag="article" id={`post-${postId}`} className="post">
        <Featured />
        <header className="entry-header">
          <Title />
          <Meta />
        </header>
        <Content />
        <footer className="entry-footer">
          <TaxonomyView className="tag-links" taxonomy="tag" terms={tags.nodes} root={root} />
          <TaxonomyView className="tag-links" taxonomy="category" terms={categories.nodes} root={root} />
        </footer>
      </div>
    );
  }
}

const postProps = {
  postId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  excerpt: PropTypes.string,
  date: PropTypes.string.isRequired,
  modified: PropTypes.string,
  featuredImage: PropTypes.shape({}),
  tags: PropTypes.shape({}),
  categories: PropTypes.shape({}),
};

const postDefaults = {
  className: undefined,
  content: undefined,
  excerpt: undefined,
  featuredImage: undefined,
};

PostView.propTypes = {
  ...postProps,
  root: PropTypes.string.isRequired,
  singular: PropTypes.bool,
};

PostView.defaultProps = {
  ...postDefaults,
  singular: false,
};

export default PostView;
