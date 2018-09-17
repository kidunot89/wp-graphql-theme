<?php

namespace WPGraphQL\Type\ThemeMods;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\ResolveInfo;
use WPGraphQL\AppContext;
use WPGraphQL\Data\DataSource;
use WPGraphQL\Data\ExtraSource;
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

				$fields = [
					'background' => [ 
						'type' 				=> Types::post_object( 'attachment' ),
						'description'	=> __( 'custom background', 'wp-graphql-extra-options' ),
						'resolve'			=> function( $root, $args, $context, $info ) {
							if( ! empty( $root['background'] ) ) { 
								return ( ! empty( $root['background']['id'] ) ) ?
									DataSource::resolve_post_object( absint( $root['background']['id'] ), 'attachment' ) :
									null;
							}
			
							return null;
						}
					],
					'backgroundColor' => [ 
						'type' 				=> Types::string(),
						'description'	=> __( 'background color', 'wp-graphql-extra-options' ),
						'resolve'			=> function( $root, $args, $context, $info ) {
							return ( ! empty( $root['background_color'] ) ) ? $root['background_color'] : null;
						}
					],
					'customCssPostId' => [ 
						'type' 				=> Types::int(),
						'description'	=> __( 'custom theme logo', 'wp-graphql-extra-options' ),
						'resolve'			=> function( $root, $args, $context, $info ) {
							return ( ! empty( $root['custom_css_post_id'] ) ) ? $root['custom_css_post_id'] : null;
						}
					],
					'customLogo' => [ 
						'type' 				=> Types::post_object( 'attachment' ),
						'description'	=> __( 'custom theme logo', 'wp-graphql-extra-options' ),
						'resolve'			=> function( $root, $args, $context, $info ){
							return ( ! empty( $root['custom_logo'] ) ) ? DataSource::resolve_post_object( absint( $root['custom_logo'] ), 'attachment' ) : null;
						}
					],
					'headerImage' => [ 
						'type' 				=> Types::post_object( 'attachment' ),
						'description'	=> __( 'custom header image', 'wp-graphql-extra-options' ),
						'resolve'			=> function( $root, $args, $context, $info ){
							if( ! empty ( $root['header_image'] ) ) {
								return ( ! empty( $root['header_image']['id'] ) ) ?
									DataSource::resolve_post_object( absint( $root['header_image']['id'] ), 'attachment' ) :
									null;
							}
							
							return null;
						},
					],
					'navMenuLocations' => [
						'type' 				=> Types::menu(),
						'description'	=> __( 'theme menu locations', 'wp-graphql-extra-options' ),
						'args'				=> [
							'location' => [
								'type'	=> Types::string(),
								'description' => __( 'theme menu location name', 'wp-graphql-extra-options' )
							],
						],
						'resolve'			=> function($root, $args, $context, $info ) {
							if ( ! empty( $args[ 'location' ] ) && ! empty ( $root['nav_menu_locations'] ) ) {
								$location = $args[ 'location' ];
								return ( ! empty( $root['nav_menu_locations'][ $location ] ) ) ?
									DataSource::resolve_term_object( absint( $root['nav_menu_locations'][ $location ] ), 'nav_menu' ) :
									null;
							}
			
							return null;
						}
					]
				];

				/**
				 * Get default field types, prepare fields and return field definitions
				 */
				$fields = self::prepare_fields( self::get_default_fields( $fields ), self::$type_name );
				return ! empty( $fields ) ? $fields : null;
			};
		}

    return self::$fields;
	}

	/**
	 * Adds custom fields stored in theme_mods to field definitions
	 *
	 * @param array $fields
	 * @return array
	 */
	private static function get_default_fields( $fields ) {
		
		/**
		 * Loop through theme mod data and define fields
		 */
		foreach( ExtraSource::resolve_theme_mods_data() as $mod_name => $mod_data ) {
			/**
			 * Format mod name to a WPGraphQL-friendly name
			 */
			$field_key = lcfirst( str_replace( ['_', '-'], '', ucwords( $mod_name, '_-' ) ) );
			
			/**
			 * Continue if field exists
			 */
			if ( ! empty( $fields[ $field_key ] ) ) continue;
			
			/**
			 * Define field
			 */
			$fields[ $field_key ] = [ 
				'type' 				=> Types::string(),
				'description'	=> $mod_name,
				'resolve'			=> function( $root, $args, $context, $info ) use( $mod_name ) {
					return ( ! empty( $root[ $mod_name ] ) ) ? (string) $root[ $mod_name ] : null;
				}
			];

		}

		return $fields;
	}

}

