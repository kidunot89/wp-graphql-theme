<?php
  /**
   * TwentyFifteen Stylist
   * 
   * @package twentyfifteen-react-apollo
   */
  namespace TwentyFifteen;  

  /**
   * Stylist static class
   * 
   * For manipulating theme style settings
   */
  class Stylist {

    /**
     * Holds style list
     * @var array
     */
    private static $styles;

    /**
     * Defines style properties
     *
     * @return array
     */
    private static function default_style() {
      return array(
        //Base style settings
        'style'       => array(
          'colors'      => array(
            'primary'   => '',
            'secondary' => '',
            'tertiary'  => '',
            'dark'      => '',
            'light'     => '',
          ),
          'typography'  => array(
            'body-font'   => '',
            'header-font' => ''    
          ),
        ),
    
        //Core component style settings
        'core'        => array(
          'container' => array(
            'fluid' => true,
          ),
          'header'    => array(
            'logo'        => array(
              'className' => 'custom-logo'
            ),
            'title'       => array(
              'className' => 'site-title'
            ),
            'description' => array(
              'className' => 'site-description',
            ),
          ),
          'footer'    => array(),
          'main'      => array(),
        ),
    
        //Template Component style settings
        'templates'   => array(
          'attachment'  => array(),
          'list'        => array(),
          'list-item'   => array(),
          'login'       => array(),
          'menu'        => array(),
          'page'        => array(),
          'post'        => array(
            'title'   => array(),
            'content' => array(),
            'details' => array(
              'show'      => true,
              'position'  => 'left',
              'bottom'    => true,
              'width'     => '50%',
              'height'    => null,
              'author'    => array(
                'show'      => true,
                'className' => 'post-author',
                'avatar'    => array(
                  'className' => 'post-author-avatar',
                  'show'      => true,
                  'width'     => '50%',
                  'height'    => null,
                ),
              ),
              'date'      => array(
                'show'      => true,
                'className' => 'post-date',
              ),
              'tags'      => array(
                'show'      => true,
                'className' => 'post-tags',
                'separator' => ',',
              ),
              'category'  => array(
                'show'      => true,
                'className' => 'post-tags',
                'separator' => ',',
              ),
            ),
          ),
          'sidebar'     => array(),
        ),
        'components'  => array(),
      );
    }

    /**
     * Initialize style properties if not exist
     */
    public static function init() {
      // Set styles list
      if ( empty( self::$styles ) ) {

        // Update theme styles list
        $styles = array_merge( array(
          /**
           * Add default styles here
           * 'style-id' => 'style-namespace'
           */
          'default' => 'base',
        ), get_theme_mod( 'theme-styles', array() ) );

        // Set updated list
        set_theme_mod( 'theme-styles', $styles );

        self::$styles = $styles;
      }

      // Load default styles
      self::load_style( self::default_style(), 'base' );

      // Sets current style to default if one is set
      $current = get_theme_mod('current-theme-style', false);
      if ( false === $current ) {
        set_theme_mod('current-theme-style', 'base');
      }

    }

    /**
     * Add style properties if they don't exist
     *
     * @param array $props - style properties
     * @param string $namespace - property prefix
     * @param bool $overwrite - save over existing properties
     * @param string $delimiter - namespace separator
     */
    public static function load_style( $props, $namespace = '', $overwrite = false, $delimiter = '__' ) {
      foreach( $props as $name => $value ) {
        if ( is_array( $value ) ) {
          self::load_style( $value, "{$namespace}{$delimiter}{$name}", $overwrite, $delimiter );
          continue;
        }
        // Check if property exists and overwrite if specified or create if doesn't exist
        $prop = get_theme_mod( "{$namespace}{$delimiter}{$name}", false );
        if ( $prop === false || $overwrite ) {
          set_theme_mod( "{$namespace}{$delimiter}{$name}", $value );
        }
      }
    }

    /**
     * Gets style properties of a style. If style not specified the current style is selected.
     * Style setting names are prefixed like so. Eg. 'namespace__settingName' 
     *
     * @param string $style_name - name of style
     * @return array
     */
    public static function style( $style_name = null ) {
      // initialize styles
      if ( empty( self::$styles ) ) self::init();
      
      if ( is_null( $style_name ) ) {
        $style_name = get_theme_mod('current-theme-style', 'default');
      }

      // Output array
      $style = [];

      // Style namespace
      $namespace = "{$style_name}__";

      foreach( get_theme_mods() as $fq_prop_name => $prop_value) {
        if ( substr( $fq_prop_name, 0, strlen( $namespace ) ) === $namespace ) {
          $prop_name = substr( $fq_prop_name, strlen( $namespace ) );
          $style[] = [
            'name'  => $prop_name,
            'value' => $prop_value,
          ];
        }
      }

      // Use default style to get properties not included in current style
      if ( $style_name !== 'default' ) {
        $style = array_merge(
          self::style( 'default' ),
          $style 
        );
      } 

      return $style;
    }

    /**
     * Change selected style
     *
     * @param string $name
     * @return boolean
     */
    public static function change_style( $name ) {
      // initialize styles
      if ( empty( self::$styles ) ) self::init();
    }

    public static function save_style( $name, $catalog ) {
      // initialize styles
      if ( empty( self::$styles ) ) self::init();
    }

    public static function delete_style( $name ) {
      // initialize styles
      if ( empty( self::$styles ) ) self::init();
    }
  }
  