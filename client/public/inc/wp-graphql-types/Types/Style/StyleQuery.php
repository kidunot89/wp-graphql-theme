<?php

namespace WPGraphQL\Type\Style;

use GraphQL\Type\Definition\ResolveInfo;
use TwentyFifteen\Stylist;
use WPGraphQL\AppContext;
use WPGraphQL\CustomTypes;
use WPGraphQL\Types;
use WPGraphQL\Data\DataSource;

/**
 * Class StyleQuery
 *
 * @since 0.0.1
 * @package WPGraphQL\Type\Style
 */
class StyleQuery {

	/**
	 * Holds the root_query field definition
	 * @var array $root_query
	 * @since 0.0.1
	 */
  private static $root_query;
  
  /**
	 * Method that returns the root query field definition
	 * for ThemeMods
	 *
	 * @access public
	 *
	 * @return array $root_query
	 */
	public static function root_query() {
		if ( null === self::$root_query ) {
			self::$root_query = [
				'type'    => Types::list_of( CustomTypes::style() ),
				'args'		=> array(
					'name' => Types::string(),
				),
				'resolve'	=> function ( $source, array $args, AppContext $context, ResolveInfo $info ) {
          if ( ! empty( $args['name'] ) ) {
            return Stylist::style( $args['name'] );
          }
          return Stylist::style();
				},
			];
		}

		return self::$root_query;
  }
  
}