/**
 * Archive Queries
 */
import { gql } from 'apollo-boost';
import {
  POST_AUTHOR_FRAGMENT,
  POST_CATEGORIES_FRAGMENT,
  POST_TAGS_FRAGMENT,
  POST_FEATURED_FRAGMENT,
} from 'components/wp-templates/post-type';

export const POST_EXCERPT_FRAGMENT= gql`
  fragment PostExcerpt on Post {
    id
    postId
    excerpt
    date
    modified
    title
  }
`;

const ARCHIVE_QUERY = gql`
  query ArchiveQuery(
      $first: Int!,
      $category: String,
      $tag: String,
      $month: Int,
      $year: Int,
      $author: Int
    ) {
    posts(
      first: $first,
      where: {
        categoryName: $category,
        tag: $tag,
        author: $author,
        dateQuery: { month: $month, year: $year },
      }
    ) {
      nodes {
        ...PostExcerpt
        ...PostAuthor
        ...PostCategories
        ...PostTags
        ...PostFeatured
      }
    }
  }
  ${POST_EXCERPT_FRAGMENT}
  ${POST_AUTHOR_FRAGMENT}
  ${POST_CATEGORIES_FRAGMENT}
  ${POST_TAGS_FRAGMENT}
  ${POST_FEATURED_FRAGMENT}
`;

export default ( first, where ) => {
  let variables;
  if( where ) {
    variables = { first, ...where }
  } else {
    variables = { first }
  }
  
  return { query: ARCHIVE_QUERY, variables };
};
