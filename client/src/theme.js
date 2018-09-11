import _ from 'lodash';
import gql from 'graphql-tag';

export const THEME_MODS_QUERY = gql`
  query AllThemeMods {
    allThemeMods{
      name
      value
    }
  }
`;

const loadTheme = async (client) => {
  const themeMods = client.query({
    query: THEME_MODS_QUERY,
  });

  const theme = {
    style: {
      primaryColor: themeMods.primaryColor || '#FFFFFF',
      secondaryColor: themeMods.secondaryColor || '#FFFFFF', 
    },
    core: {
      app: {},

      header: {
        logo: (themeMods.customLogo) ? {
          id: themeMods.customLogo,
          className: themeMods.logoCSS || 'site-logo',
        } : null,

        title: {
          content: themeMods.siteTitle || 'Site Title',
          className: themeMods.siteTitleCSS || 'site-title'
        },

        description: (themeMods.description) ? {
          content: themeMods.description,
          className: themeMods.taglineCSS || 'site-description',
        } : null,
      },

      main: {},

      footer: {}
    },
    templates: {
      post: {
        postTitle: themeMods.showPostTitle ? {
          className: themeMods.postTitleCSS || 'post-title',
        } : null,

        postContent: {
          className: themeMods.postContentCSS || 'post-content',
        },

        postDetails: themeMods.showPostDetails ? {
          className: themeMods.postDetailsCSS || 'post-details',
          width: themeMods.postDetailsWidth || '50%',
          height: themeMods.postDetailsHeight || null,
          position: themeMods.postDetailsPosition || 'right',
          bottom: themeMods.postDetailsBottom || true,

          postAuthorDetails: themeMods.showPostAuthorDetails ? {
            className: themeMods.postAuthorDetailsCSS || 'post-author',

            userAvatar: themeMods.showPostAuthorAvatar ? {
              className: themeMods.postAuthorAvatarCSS || 'post-author-avatar',
              width: themeMods.postAuthorAvatarWidth || '256px',
              height: themeMods.postAuthorAvatarHeight || '256px',
            } : null,
          } : null,

          postDateDetails: themeMods.showPostDateDetails ? {
            className: themeMods.postDateDetailsCSS || 'post-date',
          } : null,

          postTagsDetails: themeMods.showPostTagsDetails ? {
            className: themeMods.postTagsDetailsCSS || 'post-tags',
            separator: themeMods.postTagsSeparator || ','
          }: null,

          postCategoryDetails: themeMods.showPostCategoryDetails ? {
            className: themeMods.postCategoryDetailsCSS || 'post-tags',
            separator: themeMods.postCategorySeparator || ','
          }: null,
        } : null,
      },

      page: {

      },

      attachment: {

      },

      login: {

      },

      list: {

      },

      listItem: {

      },
      
      sidebar: {

      },
      
      widget: {

      }
    },
    components: {

    }
  }
};

const saveTheme = async (client, catalog) => {

}

export const buildStylist = async (client) => {
  

  const stylist = (style) = catalog[style] || {};
};