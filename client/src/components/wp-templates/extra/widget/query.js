import { gql } from 'apollo-boost';

const getFields = type => {
  switch(type) {
    case 'CalendarWidget':
    case 'MetaWidget':
    case 'SearchWidget':
      return 'title';

    case 'ArchivesWidget':
      return 'title count dropdown urls';

    case 'AudioWidget':
      return 'title audio preload loop';

    case 'CategoriesWidget':
      return 'title count dropdown hierarchical';

    case 'CustomHTMLWidget':
      return 'title content';

    case 'GalleryWidget':
      return 'title columns size linkType orderbyRandom images';

    case 'ImageWidget':
      return 'title image linkType linkUrl';

    case 'NavMenuWidget':
      return 'title menu';

    case 'PagesWidget':
      return 'title sortby exclude';

    case 'RecentCommentsWidget':
      return 'title commentsPerDisplay';

    case 'RecentPostsWidget':
      return 'title postsPerDisplay showDate';

    case 'RSSWidget':
      return 'title url itemsPerDisplay error showSummary showAuthor showDate';

    case 'TagCloudWidget':
      return 'title showCount taxonomy tags';

    case 'TextWidget':
      return 'title text filterText visual';

    case 'VideoWidget':
      return 'title loop preload video'
  }
}

const getWidgetQuery = (type) => {
  const fields = getFields(type);    
  const fragmentString = `fragment ${type}Info on ${type} { ${fields}}`;
  const queryString = `
    query WidgetQuery($id: ID!) {
      widget(id: $id) {
        ...${type}Info
      }
    }`;

  return gql`${queryString}${fragmentString}`;
};

export default getWidgetQuery;