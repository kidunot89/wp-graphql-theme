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
      $this->create_test_menus();
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

    /**
     * Create test menus and registered them to twentyfifteen menu locations.
     */
    private function create_test_menus() {
      $menu_name = 'Primary';
      $menu_exists = wp_get_nav_menu_object( $menu_name );

      if( ! $menu_exists ){
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

        $page = get_page_by_path('sample-page');
        if ( $page ) {
          wp_update_nav_menu_item($primary_id, 0, array(
            'menu-item-title'     => __('Sample Page'),
            'menu-item-object'    => 'page',
            'menu-item-object-id' => $page->ID,
            'menu-item-type'      => 'post_type',
            'menu-item-status'    => 'publish'
          ));
        }

        wp_update_nav_menu_item($primary_id, 0, array(
          'menu-item-title'   => __('Custom Link'),
          'menu-item-url'     => 'https://wpgraphql.com',
          'menu-item-status'  => 'publish'
        ));
      }

      $menu_name = 'Social';
      $menu_exists = wp_get_nav_menu_object( $menu_name );

      // If it doesn't exist, let's create it.
      if( ! $menu_exists ){
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