<?php

namespace WPGraphQL\Type\ThemeMods;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\ResolveInfo;
use TwentyFifteen\Customizr;
use WPGraphQL\AppContext;
use WPGraphQL\Data\DataSource;
use WPGraphQL\Type\WPObjectType;
use WPGraphQL\Types;

/**
 * Class ThemeModsType
 *
 * This sets up the theme modification type
 *
 * @since 0.0.1
 * @package WPGraphQL\Type\ThemeMods
 */
class ThemeModsType extends WPObjectType {

	/**
	 * Holds the type name
	 *
	 * @var string $type_name
	 */
	private static $type_name;

	/**
	 * Holds the $fields definition for the SettingsType
	 *
	 * @var array $fields
	 * @access private
	 */
	private static $fields;

	/**
	 * ThemeModType constructor.
	 *
	 * @access public
	 */
	public function __construct() {
		
		self::$type_name = 'ThemeMods';

		$config = [
			'name'        => self::$type_name,
			'fields'      => self::fields(),
			'description' => __( 'All of registered theme modifications', 'wp-graphql-extra-options' ),
		];

    parent::__construct( $config );
    
  }

  /**
	 * This defines the fields for the ThemeMods type
	 *
	 * @param $mods
	 *
	 * @access private
	 * @return \GraphQL\Type\Definition\FieldDefinition|mixed|null
	 */
	private static function fields() {

		if (null === self::$fields) {
			self::$fields = function() {
				
				/**
				 * Get theme_mod_data
				 */
				$theme_mods_data = self::get_theme_mods_data();
				
				/**
				 * Loop through data and resolve field definition
				 */
				$fields = [];
				foreach( $theme_mods_data as $mod_name => $mod_data ) {

					/**
					 * Format mod name to a WPGraphQL-friendly name
					 */
					$field_key = lcfirst( str_replace( ['_', '-'], '', ucwords( $mod_name, '_-' ) ) );
					
					/**
					 * Dynamically build the individual setting and it's fields
					 * then add it to $fields
					 */
					$field = ThemeModsFields::$mod_name();
					
					if (false !== $field)	$fields[ $field_key ] = $field;

				}

				/**
				 * Prepare and return field definitions
				 */

				$fields = self::prepare_fields( $fields, self::$type_name );
				return ! empty( $fields ) ? $fields : null;
			};
		}

    return self::$fields;

	}
	
	/**
	 * Retrieves and formats theme modification data
	 *
	 * @param array|null $theme_mods - array of raw theme modification data
	 * @return array|null
	 */
	public static function get_theme_mods_data() {
		require_once ABSPATH . WPINC . '/theme.php';
		require_once get_template_directory() . '/inc/customizr.php';
		$_REQUEST['wp_customize'] = 'on';
		\_wp_customize_include();

		global $wp_customize;
		$wp_customize->setup_theme();
		/**
		 * Output array
		 */
		$theme_mod_data = [];
		/**
		 * Loop through raw active theme mods array and format theme mod data
		 */
		
		$theme_mods = $wp_customize->settings();
		var_dump( $theme_mods );
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

