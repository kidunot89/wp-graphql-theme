import { gql } from 'apollo-boost';

const getWidgetQuery = (type) => {
  let fragment;
  switch (type) {
    case 'ArchivesWidget':
      fragment = gql `
        fragment WidgetInfo on ArchivesWidget {
          title
          count
          dropdown
        }
      `;
      break;

    case 'AudioWidget':
      fragment = gql `
        fragment WidgetInfo on AudioWidget {
          title
          audio
          preload
          loop
        }
      `;
      break;

    case 'CalendarWidget':
      fragment = gql `
        fragment WidgetInfo on CalendarWidget {
          title
        }
      `;
      break;

    case 'CategoriesWidget':
      fragment = gql `
        fragment WidgetInfo on CategoriesWidgett {
          title
          count
          dropdown
          hierarchical 
        }
      `;
      break;

    case 'CustomHTMLWidget':
      fragment = gql `
        fragment WidgetInfo on CustomHTMLWidget {
          title
          content
        }
      `;
      break;

    case 'GalleryWidget':
      fragment = gql `
        fragment WidgetInfo on GalleryWidget {
          title
          columns
          size
          linkType
          orderbyRandom
          images
        }
      `;
      break;

    case 'ImageWidget':
      fragment = gql `
        fragment WidgetInfo on ImageWidget {
          title
          image
          linkType
          linkUrl
        }
      `;
      break;

    case 'MetaWidget':
      fragment = gql `
        fragment WidgetInfo on MetaWidget {
          title
        }
      `;
      break;

    case 'NavMenuWidget':
      fragment = gql `
        fragment WidgetInfo on NavMenuWidget {
          title
          menu
        }
      `;
      break;

    case 'PagesWidget':
      fragment = gql `
        fragment WidgetInfo on PagesWidget {
          title
          sortby
          exclude
        }
      `;
      break;

    case 'RecentCommentsWidget':
      fragment = gql `
        fragment WidgetInfo on RecentCommentsWidget {
          title
          commentsPerDisplay
        }
      `;
      break;

    case 'RecentPostsWidget':
      fragment = gql `
        fragment WidgetInfo on RecentPostsWidget {
          title
          postsPerDisplay
          showDate
        }
      `;
      break;

    case 'RSSWidget':
      fragment = gql `
        fragment WidgetInfo on RSSWidget {
          title
          url
          itemsPerDisplay
          error
          showSummary
          showAuthor
          showDate 
        }
      `;
      break;

    case 'SearchWidget':
      fragment = gql `
        fragment WidgetInfo on VideoWidget {
          title
        }
      `;
      break;

    case 'TagCloudWidget':
      fragment = gql `
        fragment WidgetInfo on TagCloudWidget {
          title
          showCount
          taxonomy {
            name
            showCloud
          }
        }
      `;
      break;

    case 'TextWidget':
      fragment = gql `
        fragment WidgetInfo on TextWidget {
          title
          text
          filterText
          visual 
        }
      `;
      break;

    case 'VideoWidget':
      fragment = gql `
        fragment WidgetInfo on VideoWidget {
          title
          loop
          preload
          video 
        }
      `;
      break;

    default:
  }

  return gql`
    query WidgetQuery($id: ID!) {
      widget(id: $id) {
        ...WidgetInfo
      }
    }
    ${fragment}
  `;
};

export default getWidgetQuery;