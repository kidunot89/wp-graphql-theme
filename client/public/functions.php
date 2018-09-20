<?php
/**
 * TwentyFifteen with React-Apollo functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package twentyfifteen-react-apollo
 */

	/**
	 * Theme Constants
	 * 
	 * @since 0.0.1
	 */
	if( ! defined( 'THEME_NAME' ) ) {
		define( 'THEME_NAME', 'twentyfifteen-react-apollo' );		
	}

	if( ! defined( 'THEME_VERSION' ) ) {
		define( 'THEME_VERSION', '0.0.1' );		
	}

	/**
	 * Checks for installation WPGraphQL-related plug-ins
	 * 
	 * @since 0.0.1
	 */
	function twentyfifteen_check_dependencies() {

		$error = null;

		if (! defined( 'WPGRAPHQL_VERSION' ) ) {
			$error = new WP_Error( 'missing_dependency', sprintf( __( "WPGraphQL must be installed and activated to use the %s theme", "example" ), THEME_NAME ) );
		} 

		if (! defined( 'WPGRAPHQL_JWT_AUTHENTICATION_VERSION' ) ) {
			$error = new WP_Error( 'missing_dependency', sprintf( __( "WPGraphQL JWT Authentication must be installed and activated to use the %s theme", "example" ), THEME_NAME ) );
		}

		if ( is_wp_error( $error ) ) {
			echo $error->get_error_message();
		}

	}
	add_action( 'after_setup_theme', 'twentyfifteen_check_dependencies' );

	/**
	 * Checks if WPGraphQL-related plugins are active
	 * 
	 * @since 0.0.1
	 */
	function twentyfifteen_check_active() {

		$error = null;

		if ( ! is_plugin_active( WPGRAPHQL_PLUGIN_DIR ) ) {
			$error = new WP_Error( 'missing_dependency', sprintf( __( "WPGraphQL must be activated to use the %s theme", "example" ), THEME_NAME ) );
		} 

		if ( ! is_plugin_active( WPGRAPHQL_JWT_AUTHENTICATION_PLUGIN_DIR ) ) {
			$error = new WP_Error( 'missing_dependency', sprintf( __( "WPGraphQL JWT Authentication must be activated to use the %s theme", "example" ), THEME_NAME ) );
		}

		if ( is_wp_error( $error ) ) {
			throw new Exception( $error->get_error_message() );
		}

	}
	add_action( 'plugins_loaded', 'twentyfifteen_check_active' );

	/**
	 * Sets up defaults and registers
	 *
	 * @since 0.0.1
	 */
	function twentyfifteen_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 */
		load_theme_textdomain( THEME_NAME, get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo' );

		/**
		 * Add support for Gutenburg Styling
		 */
		add_theme_support( 'align-wide' );

		/**
		 * Register Menu
		 */
		register_nav_menus(
			array(
				'primary' => __( 'Primary Menu' ),
				'social' => __( 'Social Links Menu' )
			 )
		 );
	 }
	 add_action( 'after_setup_theme', 'twentyfifteen_setup' );

	/**
	 * Register widget area.
	 */
	function twentyfifteen_widgets_init() {
		register_sidebar(
			array(
				'name'          => __( 'Widget Area', THEME_NAME ),
				'id'            => 'sidebar-1',
				'description'   => __( 'Add widgets here to appear in your sidebar.', THEME_NAME ),
			)
		);
	}
	add_action( 'widgets_init', 'twentyfifteen_widgets_init' );


	/**
	 * Queues up theme JS and CSS files to be loaded.
	 * 
	 * @since 0.0.1
	 */
	function twentyfifteen_enqueue_scripts() {

    $assets = json_decode( file_get_contents( get_template_directory() . '/asset-manifest.json' ), true );

		wp_enqueue_style( 'theme-docs', get_stylesheet_uri() );

		// DEBUG
		//wp_enqueue_style( 'main-style', get_template_directory_uri() . '/' . $assets['main.css'] );
		wp_enqueue_script( 'main-script', get_template_directory_uri() . '/' . $assets['main.js'], array(), THEME_VERSION, true );

	}
	add_action( 'wp_enqueue_scripts', 'twentyfifteen_enqueue_scripts' );
	
	/**
	 * Implement the Custom Header feature.
	 */
	require get_template_directory() . '/inc/custom-header.php';

	/**
	 * Custom template tags for this theme.
	 */
	require get_template_directory() . '/inc/template-tags.php';

	/**
	 * Functions which enhance the theme by hooking into WordPress.
	 */
	require get_template_directory() . '/inc/template-functions.php';
	
	/**
   * Adds Customizr settings
   */
  require get_template_directory() . '/inc/stylist.php';

  /**
   * Adds GraphQL schema modifications
   */
	require get_template_directory() . '/inc/wp-graphql.php';