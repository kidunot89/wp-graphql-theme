<?php

  namespace WPGraphQL\Data;

  use GraphQL\Type\Definition\ResolveInfo;
  use GraphQL\Error\UserError;
  use WPGraphQL\AppContext;
  use WPGraphQL\Type\Sidebar\Connection\SidebarConnectionResolver;
  use WPGraphQL\Type\Widget\Connection\WidgetConnectionResolver;

  /*
    Class ExtraSource
    Meant to serve an a extension of WPGraphQL\Data\DataSource

    @package twentyfifteen
  */
  class ExtraSource {

    /**
     * Retrieves and formats theme modification data
     *
     * @param array|null $theme_mods - array of raw theme modification data
     * @return array|null
     */
    public static function resolve_theme_mods_data() {
      /**
       * Output array
       */
      $theme_mod_data = [];
      /**
       * Loop through raw active theme mods array and format theme mod data
       */
      
      $theme_mods = get_theme_mods();
      foreach( $theme_mods as $mod_name => $mod_data ){
        if( gettype($mod_name) === 'integer' ) continue;
        switch( $mod_name ) {
          /**
           * Custom CSS Post Id
           */
          case 'custom_css_post_id':
            $theme_mod_data[ $mod_name ] = absint($mod_data);
            break;
          
          /**
           * Background
           */
          case 'background_preset':
          case 'background_size':
          case 'background_repeat':
          case 'background_attachment':
            $key = str_replace('background_', '', $mod_name );
            $theme_mod_data[ 'background' ][ $key ] = $mod_data;
            break;
          case 'background_image':
            $theme_mod_data[ 'background' ]['id'] = attachment_url_to_postid( (string) $mod_data );
            break;
          case 'background_color':
            $theme_mod_data[ $mod_name ] =  (string) $mod_data;
            break;
          /**
           * Custom Logo
           */
          case 'custom_logo':
            $theme_mod_data[ $mod_name ] = absint( $mod_data );
            break;
          /**
           * Header Image
           */
          case 'header_image_data':
            $theme_mod_data[ 'header_image' ] += get_object_vars( $mod_data );
            break;
          case 'header_image':
            $theme_mod_data[ 'header_image' ]['id'] = attachment_url_to_postid( (string) $mod_data );
            break;
          /**
           * Nav Menu Locations and Custom Mods
           */
          default:
            $theme_mod_data[ $mod_name ] = $mod_data;
        }
      }
      return $theme_mod_data;
    }

    /**
     * Returns an array of data about the sidebar you are requesting
     *
     * @param string $name Name of the sidebar you want info for
     *
     * @return null|array
     * @throws \Exception
     * @since  0.0.31
     * @access public
     */
    public static function resolve_sidebar( $sidebar_id, $index = null ) {
      global $wp_registered_sidebars;

      if ( empty( $wp_registered_sidebars ) ) {
        throw new UserError( sprintf( __( 'No sidebars are registered', 'wp-graphql' ), $index ) );
      }

      /**
       * Get registered sidebar data
       */
      $sidebar = null;
      if ( ! is_null( $index ) ) {

        foreach( $wp_registered_sidebars as $registered_sidebar ) {
          if( $registered_sidebar[ $index ] === $sidebar_id ) {
            $sidebar = $registered_sidebar;
            break;
          }
        }
        if( ! $sidebar ) {
          throw new UserError( sprintf( __( 'No sidebar was found with that %s', 'wp-graphql' ), $index ) );
        }

      } else {
        
        /**
         * Throw if requested sidebar not found
         */
        if( ! array_key_exists( $sidebar_id, $wp_registered_sidebars ) ) {
          throw new UserError( sprintf( __( 'No sidebar was found with that sidebar_id', 'wp-graphql' ) ) );
        }
        $sidebar = $wp_registered_sidebars[ $sidebar_id ];

      }
      
      /**
       * for nodeDefinitions
       */
      $sidebar[ 'is_sidebar' ] = true;

      /**
       * Return requested sidebar array
       */
      return $sidebar;

    }

    /**
     * Wrapper for SidebarConnectionResolver::resolve
     *
     * @param array    		$source  sidebar object
     * @param array       $args    Array of arguments to pass to reolve method
     * @param AppContext  $context AppContext object passed down
     * @param ResolveInfo $info    The ResolveInfo object
     *
     * @return array
     * @since  0.0.31
     * @access public
     */
    public static function resolve_sidebars_connection( $source, array $args, AppContext $context, ResolveInfo $info ) {
      return SidebarConnectionResolver::resolve( $source, $args, $context, $info );
    }

    /**
     * Returns an array of data about the widget you are requesting
     *
     * @param string $name Name of the sidebar you want info for
     *
     * @return null|array
     * @throws \Exception
     * @since  0.0.31
     * @access public
     */
    public static function resolve_widget( $widget_id, $index = null ) {
      global $wp_registered_widgets;

      $id = null;
      if ( ! is_null( $index ) ) {

        /**
         * Loop through registered widget and compare index value
         */
        foreach( $wp_registered_widgets as $key => $registered_widget ) {
          if( $registered_widget[ $index ] === $widget_id ) {
            $id = $key;
            break;
          }
        }

        /**
         * Throw if requested widget not found
         */
        if( ! $id ) {
          throw new UserError( sprintf( __( 'No widget was found with that %s', 'wp-graphql' ), $index ) );
        }

      } else {
        /**
         * Throw if requested widget not found
         */
        if( ! array_key_exists( $widget_id, $wp_registered_widgets ) ) {
          throw new UserError( sprintf( __( 'No widget was found with the that ID', 'wp-graphql' ) ) );
        }

        $id = $widget_id;

      }

      /**
       * Return requested widget data object
       */
      return self::create_widget_data_object( $wp_registered_widgets[ $id ] );
    }

    /**
     * Wrapper for WidgetConnectionResolver::resolve
     *
     * @param array    		$source  sidebar object
     * @param array       $args    Array of arguments to pass to reolve method
     * @param AppContext  $context AppContext object passed down
     * @param ResolveInfo $info    The ResolveInfo object
     *
     * @return array
     * @since  0.0.31
     * @access public
     */
    public static function resolve_widgets_connection( $source, array $args, AppContext $context, ResolveInfo $info ) {
      return WidgetConnectionResolver::resolve( $source, $args, $context, $info );
    }

    /**
     * Create widget data 
     *
     * @since 0.0.31
     * @param array $widget
     * @return array
     */
    public static function create_widget_data_object( $widget ) {
      $widget_data = [
        'id' => $widget['id'],
        'name' => $widget['name'],
        'widget_description' => ( ! empty( $widget['description'] ) ) ? $widget['description'] : '',
        'type' => $widget['callback'][0]->id_base,
        'is_widget' => true,
      ];

      /**
       * The name of the option in the database is the name of the widget class.
       */
      $option_name = $widget['callback'][0]->option_name;

      /**
       * Widget data is stored as an associative array. To get the right data we need to get the right key
       * which is stored in $wp_registered_widgets
       */
      $key = $widget['params'][0]['number'];
      
      /**
       * Retrieve widget data if exist
       */
      if( $key > -1 ) {
        $widget_data += get_option( $option_name )[ $key ];
      }

      return $widget_data;
    }
  
    /**
     * Return an array of data for all active widget types
     *
     * @return array
     */
    public static function get_active_widget_types() {
      global $wp_registered_widgets;

      /**
       * Holds the query data to return
       */
      $types = [];

      /**
       * Loop through registered widgets
       */
      foreach( $wp_registered_widgets as $widget ) {
        $widget_data = self::create_widget_data_object( $widget );
        $type = $widget_data['type'];
        if( ! empty( $types[$type] ) ) continue;
        unset( $widget_data['id'] );
        unset( $widget_data['name'] );
        unset( $widget_data['type'] );
        unset( $widget_data['is_widget'] );
        
        $types[$type] = $widget_data;
      }

      return $types;
    }

  }