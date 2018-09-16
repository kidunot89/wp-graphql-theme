<?php

  namespace WPGraphQL\Data;

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

  }