<?php
  /**
   * TwentyFifteen Theme Customizer
   * 
   * @package twentyfifteen-react-apollo
   */
  namespace TwentyFifteen;

  /**
   * Customizr static class
   */
  class Customizr {
    private static $settings;

    public static function get_wp_customize() {
      return self::$settings;
    }
   
    public static function register_settings( &$wp_customize ) {
      if ( is_null( self::$instance ) ) {
        self::$instance = &$wp_customize->settings();
      }
      self::style( $wp_customize );
      self::core( $wp_customize );
      self::templates( $wp_customize );
      self::components( $wp_customize );
    }

    /**
     * Registers base style settings of React app
     *
     * @param WP_Customize $wp_customize
     */
    private static function style( $wp_customize ) {
      // Style Panel
      $panel_name = 'style';
      $wp_customize->add_panel( $panel_name, array(
        'title' => esc_html__( 'Base Style', THEME_NAME ),
      ) );

      // Colors
      $wp_customize->add_section( 'style-color' , array(
        'title' => esc_html__( 'Color Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Typography
      $wp_customize->add_section( 'style-typography' , array(
        'title' => esc_html__( 'Typography Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );
    }

    /**
     * Registers style settings of React app core components
     *
     * @param WP_Customize $wp_customize
     */
    private static function core( $wp_customize ) {
      // Core Panel
      $panel_name = 'core';
      $wp_customize->add_panel( $panel_name, array(
        'title' => esc_html__( 'Core Style', THEME_NAME ),
      ) );

      // App settings
      $section_name = 'core-app';
      $wp_customize->add_section( $section_name , array(
        'title' => esc_html__( 'App', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Header settings
      $section_name = 'core-header';
      $wp_customize->add_section( $section_name , array(
        'title' => esc_html__( 'Header', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      $wp_customize->add_setting( 'logo-CSS', array(
        'default'           => 'site-logo',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_control( 'logo-CSS', array(
        'section' => $section_name,
        'type'    => 'input',
        'label'   => esc_html__( 'Custom Logo CSS Classes', THEME_NAME ),
      ) );
      $wp_customize->add_setting( 'site-title-CSS', array(
        'default'           => 'site-title',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_control( 'site-title-CSS', array(
        'section' => $section_name,
        'type'    => 'input',
        'label'   => esc_html__( 'Site Title CSS Classes', THEME_NAME ),
      ) );
      $wp_customize->add_setting( 'tagline-CSS', array(
        'default'           => 'site-description',
        'sanitize_callback' => 'esc_textarea',
      ) );
      $wp_customize->add_control( 'tagline-CSS', array(
        'section' => $section_name,
        'type'    => 'input',
        'label'   => esc_html__( 'Site Tagline CSS Classes', THEME_NAME ),
      ) );

      // Main Content settings
      $section_name = 'core-main';
      $wp_customize->add_section( $section_name , array(
        'title' => esc_html__( 'Main Content', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Footer settings
      $section_name = 'core-footer';
      $wp_customize->add_section( $section_name , array(
        'title' => esc_html__( 'Footer', THEME_NAME ),
        'panel' => $panel_name,
      ) );
    }

    /**
     * Registers style settings of React-Apollo template components
     *
     * @param WP_Customize $wp_customize
     */
    private static function templates( $wp_customize ) {
      // Core Panel
      $panel_name = 'templates';
      $wp_customize->add_panel( $panel_name, array(
        'title' => esc_html__( 'Templates\' Style', THEME_NAME ),
      ) );

      // Attachment Template settings
      $wp_customize->add_section( 'template-attachment' , array(
        'title' => esc_html__( 'Attachment Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // List Template settings
      $wp_customize->add_section( 'template-list' , array(
        'title' => esc_html__( 'List Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // List Item Template settings
      $wp_customize->add_section( 'template-list-item' , array(
        'title' => esc_html__( 'List Item Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Login Template settings
      $wp_customize->add_section( 'template-page' , array(
        'title' => esc_html__( 'Login Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Page Template settings
      $wp_customize->add_section( 'template-page' , array(
        'title' => esc_html__( 'Page Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Post Template settings
      $wp_customize->add_section( 'template-post' , array(
        'title' => esc_html__( 'Post Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );
      $wp_customize->add_setting( 'show-post-title', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-title-CSS', array(
        'default'           => 'post-title',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-content-CSS', array(
        'default'           => 'post-content',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'show-post-details', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-details-CSS', array(
        'default'           => 'post-details',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-details-width', array(
        'default'           => '50%',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-details-height', array(
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-details-position', array(
        'default'           => 'right',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-details-bottom', array(
        'default' => false,
      ) );
      $wp_customize->add_setting( 'show-post-author-details', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-author-details-CSS', array(
        'default'           => 'post-author',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'show-post-author-avatar', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-author-avatar-CSS', array(
        'default'           => 'post-author-avatar',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-author-avatar-width', array(
        'default'           => '256px',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-author-avatar-height', array(
        'default'           => '256px',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'show-post-date-details', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-date-details-CSS', array(
        'default'           => 'post-date',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'show-post-tags-details', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-tags-details-CSS', array(
        'default'           => 'post-tags',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-tags-separator', array(
        'default'           => ',',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'show-post-category-details', array(
        'default' => true,
      ) );
      $wp_customize->add_setting( 'post-category-details-CSS', array(
        'default'           => 'post-tags',
        'sanitize_callback' => 'esc_textarea'
      ) );
      $wp_customize->add_setting( 'post-category-separator', array(
        'default'           => ',',
        'sanitize_callback' => 'esc_textarea'
      ) );

      // Sidebar Template settings
      $wp_customize->add_section( 'template-sidebar' , array(
        'title' => esc_html__( 'Sidebar Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );

      // Widget Template settings
      $wp_customize->add_section( 'template-widget' , array(
        'title' => esc_html__( 'Widget Template Settings', THEME_NAME ),
        'panel' => $panel_name,
      ) );
    }

    /**
     * Registers style settings of other components
     *
     * @param WP_Customize $wp_customize
     */
    private static function components( $wp_customize ) {

    }
  }
  add_action( 'customize_register' , array( __NAMESPACE__.'\\Customizr' , 'register_settings' ) );