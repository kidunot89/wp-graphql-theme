<?php

namespace WPGraphQL\Type\Style;

use GraphQL\Error\UserError;
use GraphQL\Type\Definition\ResolveInfo;
use WPGraphQL\AppContext;
use WPGraphQL\Data\DataSource;
use WPGraphQL\Type\WPObjectType;
use WPGraphQL\Types;

/**
 * Class StyleType
 *
 * This sets up the theme modification type
 *
 * @since 0.0.1
 * @package WPGraphQL\Type\Style
 */
class StyleType extends WPObjectType {

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
	 * StyleType constructor.
	 *
	 * @access public
	 */
	public function __construct() {
		
		self::$type_name = 'Style';

		$config = [
			'name'        => self::$type_name,
			'fields'      => self::fields(),
			'description' => __( 'A theme style property', 'wp-graphql-extra-options' ),
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
          'name' => [ 
            'type' 				=> Types::string(),
            'description'	=> __( 'name of style properties', THEME_NAME ),
            'resolve'			=> function( $root, $args, $context, $info ) {
              return ( ! empty( $root[ 'name' ] ) ) ? $root[ 'name' ] : null;
            },
          ],

          'value' => [ 
            'type' 				=> Types::string(),
            'description'	=> __( 'value of style properties', THEME_NAME ),
            'resolve'			=> function( $root, $args, $context, $info ) {
              return ( ! empty( $root[ 'value' ] ) ) ? $root[ 'value' ] : null;
            },
          ],

        ];

        /**
				 * Prepare and return field definitions
				 */

				$fields = self::prepare_fields( $fields, self::$type_name );
        return ! empty( $fields ) ? $fields : null;
      };
    }

    return self::$fields;

  }
  
}