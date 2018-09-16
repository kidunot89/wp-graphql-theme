<?php
  /*
    Plugin Name: WPGraphQL Test Settings
    Version: 0.0.1
    Description: Sets up WPGraphQL test environment
    Author: Geoff Taylor
    Author URI: https://axistaylor.com
    Plugin URI: https://axistaylor.com
    Text Domain: wp-graphql-test
    Domain Path: /languages
  */

  new WPGraphQLSettingsTest();
  class WPGraphQLSettingsTest {

    public function __construct() {
      $this->constants();

      register_activation_hook( __FILE__, array( &$this, 'activate' ) );
      register_deactivation_hook( __FILE__, array( &$this, 'deactivate' ) );
      $this->actions_and_filters();
    }

    private function constants() {
      if( ! defined('WPG_VERSION') ) {
        define('WPG_VERSION', '0.0.1');
      }

      if( ! defined('WPG_PATH') ) {
        define( 'WPG_PATH', plugin_dir_path(__FILE__) );
      }
    }

    /**
     * Adds actions and filters in one place
     */
    private function actions_and_filters() {
      add_action( 'init', array( &$this, 'init' ) );
      add_action( 'admin_init', array( &$this, 'admin_init' ) );

      // Add GraphQL Secret
      add_filter( 'graphql_jwt_auth_secret_key', function() {
        return '{LKO?wh,8HXwa$QjMR&*J{Q/^D&nKtkt(fu-V]f+6a^.0;O.IXP6,zYZ5WGH-i?*';
      });
    }

    /**
     * Run this on every page load
     */
    public function init() {
      global $wp_rewrite;
      $wp_rewrite->set_permalink_structure( '/%year%/%monthnum%/%postname%/' );
    }

    /**
     * do stuff when the admin interface is loaded…
     */
    public function admin_init() {

    }

    /**
     * Stuff to do when this plugin is activated
     */
    public function activate() {
      $this->activate_dependencies();
      $this->create_demo_posts();
      $this->create_demo_pages();
      $this->create_demo_menus();
    }

    /**
     * Stuff to do when this plugin is deactivated (cleanup and leave it as you found it)
     */
    public function deactivate() {
      
    }

    /**
     * Activate WPGraphQL-related plugins
     */
    private function activate_dependencies() {
      activate_plugin('wp-graphql/wp-graphql.php');
      activate_plugin('wp-graphiql/wp-graphiql.php');
      activate_plugin('wp-graphql-jwt-authentication/wp-graphql-jwt-authentication.php');
    }

    private function create_demo_pages() {
      $about = file_get_contents( WPG_PATH . '/pages/about.html', true );
      wp_insert_post( array(
        'post_type'     => 'page',
        'post_title'    => 'About Twenty Fifteen',
        'post_content'  => $about,
        'post_status'   => 'publish',
        'post_slug'     => 'about-twenty-fifteen'
      ) );

      $readability = file_get_contents( WPG_PATH . '/pages/readability.html', true );
      wp_insert_post( array(
        'post_type'     => 'page',
        'post_title'    => 'Readability',
        'post_content'  => $readability,
        'post_status'   => 'publish',
        'post_slug'     => 'readability'
      ) );

      $image_alignment_and_styles = file_get_contents( WPG_PATH . '/pages/image-alignment-and-styles.html', true );
      wp_insert_post( array(
        'post_type'     => 'page',
        'post_title'    => 'Image Alignment and Styles',
        'post_content'  => $image_alignment_and_styles,
        'post_status'   => 'publish',
        'post_slug'     => 'image-alignment-and-styles'
      ) );

      $html_elements = file_get_contents( WPG_PATH . '/pages/html-elements.html', true );
      wp_insert_post( array(
        'post_type'     => 'page',
        'post_title'    => 'HTML Elements',
        'post_content'  => $html_elements,
        'post_status'   => 'publish',
        'post_slug'     => 'html-elements'
      ) );

      $parent_page = file_get_contents( WPG_PATH . '/pages/parent-page.html', true );
      $parent_id = wp_insert_post( array(
        'post_type'     => 'page',
        'post_title'    => 'A Parent Page',
        'post_content'  => $parent_page,
        'post_status'   => 'publish',
        'post_slug'     => 'a-parent-page'
      ) );

      if ( $parent_id ) {
        $first_page = file_get_contents( WPG_PATH . '/pages/first-page.html', true );
        wp_insert_post( array(
          'post_type'     => 'page',
          'post_title'    => 'First Child',
          'post_content'  => $first_page,
          'post_status'   => 'publish',
          'post_slug'     => 'first-child',
          'post_parent'   =>  $parent_id,
          'menu_order'    =>  0
        ) );

        $second_page = file_get_contents( WPG_PATH . '/pages/second-page.html', true );
        wp_insert_post( array(
          'post_type'     => 'page',
          'post_title'    => 'Second Child',
          'post_content'  => $second_page,
          'post_status'   => 'publish',
          'post_slug'     => 'second-child',
          'post_parent'   =>  $parent_id,
          'menu_order'    =>  1
        ) );

        $third_page = file_get_contents( WPG_PATH . '/pages/third-page.html', true );
        wp_insert_post( array(
          'post_type'     => 'page',
          'post_title'    => 'Third Child',
          'post_content'  => $third_page,
          'post_status'   => 'publish',
          'post_slug'     => 'third-child',
          'post_parent'   =>  $parent_id,
          'menu_order'    =>  2
        ) );

        $fourth_page = file_get_contents( WPG_PATH . '/pages/fourth-page.html', true );
        wp_insert_post( array(
          'post_type'     => 'page',
          'post_title'    => 'Fourth Child',
          'post_content'  => $fourth_page,
          'post_status'   => 'publish',
          'post_slug'     => 'fourth-child',
          'post_parent'   =>  $parent_id,
          'menu_order'    =>  3
        ) );
      }
    }

    private function create_demo_posts() {

    }

    /**
     * Create test menus and registered them to twentyfifteen menu locations.
     */
    private function create_demo_menus() {
      $menu_name = 'Primary';
      $menu_exists = wp_get_nav_menu_object( $menu_name );

      if ( ! $menu_exists ) {
        $primary_id = wp_create_nav_menu($menu_name);

        // Set up default menu items
        $posts = get_posts( array(
          'name'        => 'hello-world',
          'post_type'   => 'post',
          'post_status' => 'publish',
          'numberposts' => 1
        ) );
        if ( $posts ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('Home'),
            'menu-item-object'    => 'post',
            'menu-item-object-id' => $posts[0]->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('about-twenty-fifteen');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('About Twenty Fifteen'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('readability');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('Readability'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('image-alignment-and-styles');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('Image Alignment and Styles'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('html-elements');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('HTML Elements'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('a-parent-page');
        if ( $page ) {
          $parent_item_id = wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('A Parent Page'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        $page = get_page_by_path('a-parent-page/first-child');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('First Page'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish',
            'menu-item-parent-id' => $parent_item_id,
          ));
        }

        $page = get_page_by_path('a-parent-page/second-child');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('Second Page'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish',
            'menu-item-parent-id' => $parent_item_id,
          ));
        }

        $page = get_page_by_path('a-parent-page/third-child');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('The Third'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish',
            'menu-item-parent-id' => $parent_item_id,
          ));
        }

        $page = get_page_by_path('a-parent-page/fourth-child');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('And The Fourth'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish',
            'menu-item-parent-id' => $parent_item_id,
          ));
        }
      }

      $menu_name = 'Social';
      $menu_exists = wp_get_nav_menu_object( $menu_name );

      if ( ! $menu_exists ) {
        $social_id = wp_create_nav_menu( $menu_name );

        // Set up default menu items
        wp_update_nav_menu_item($social_id, 0, array(
          'menu-item-title'   => __('Facebook'),
          'menu-item-classes' => 'facebook',
          'menu-item-url'     => 'https://facebook.com',
          'menu-item-status'  => 'publish'
        ));

        wp_update_nav_menu_item($social_id, 0, array(
          'menu-item-title'   => __('Twitter'),
          'menu-item-classes' => 'twitter',
          'menu-item-url'     => 'https://twitter.com',
          'menu-item-status'  => 'publish'
        ));

        wp_update_nav_menu_item($social_id, 0, array(
          'menu-item-title'   => __('GitHub'),
          'menu-item-classes' => 'github',
          'menu-item-url'     => 'https://github.com',
          'menu-item-status'  => 'publish'
        ));

        wp_update_nav_menu_item($social_id, 0, array(
          'menu-item-title'   => __('LinkedIn'),
          'menu-item-classes' => 'linkedin',
          'menu-item-url'     => 'https://linkedin.com',
          'menu-item-status'  => 'publish'
        ));

        wp_update_nav_menu_item($social_id, 0, array(
          'menu-item-title'   => __('Wordpress'),
          'menu-item-classes' => 'wordpress',
          'menu-item-url'     => 'https://wordpress.org',
          'menu-item-status'  => 'publish'
        ));

      }

      // Set menu locations
      $locations = array(
        'primary' => $primary_id,
        'social' => $social_id
      );

      set_theme_mod( 'nav_menu_locations', $locations );
    }
  }
?>