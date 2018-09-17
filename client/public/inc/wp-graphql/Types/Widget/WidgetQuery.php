<?php

namespace WPGraphQL\Type\Widget;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQLRelay\Relay;
use WPGraphQL\AppContext;
use WPGraphQL\CustomTypes;
use WPGraphQL\Data\DataSource;
use WPGraphQL\Data\ExtraSource;
use WPGraphQL\Types;

/**
 * Class WidgetQuery
 *
 * @package WPGraphQL\Type\Widget
 * @since   0.0.31
 */
class WidgetQuery {
  /**
	 * Holds the root_query field definition
	 *
	 * @var array $root_query
	 */
	private static $root_query;

	/**
	 * Holds the widget_by field definition
	 *
	 * @var array $widget_by
	 */
	private static $widget_by;

	/**
	 * Method that returns the root query field definition
	 *
	 * @return array
	 * @since  0.0.31
	 */
	public static function root_query() {
    if ( null === self::$root_query ) {

			self::$root_query = [
				'type' => CustomTypes::widget(),
				'description' => __( 'A WordPress widget', 'wp-graphql' ),
				'args' => [
					'id' => Types::non_null( Types::id() ),
				],
				'resolve' => function( $source, array $args, AppContext $context, ResolveInfo $info ) {
					$id_components = Relay::fromGlobalId( $args['id'] );
					//var_dump( $id_components );
					return ExtraSource::resolve_widget( $id_components['id'] );
				},
			];

		}

		return self::$root_query;
	}
	
	/**
	 * Method that returns the "widget_by" field definition to get a widget by id or name.
	 *
	 * @return array
	 */
	public static function widget_by() {
    if ( null === self::$widget_by ) {

			self::$widget_by = [
				'type' => CustomTypes::widget(),
				'description' => __( 'A WordPress widget', 'wp-graphql' ),
				'args' => [
					'id' 		=> Types::string(),
					'name' 	=> Types::string(),
				],
				'resolve' => function( $source, array $args, AppContext $context, ResolveInfo $info ) {

					if( ! empty( $args[ 'id' ] ) ) {
						return ExtraSource::resolve_widget( $args[ 'id' ] );
					}
					if( ! empty( $args[ 'name' ] ) ) {
						return ExtraSource::resolve_widget( $args[ 'name' ], 'name' );
					}

					return null;

				},
			];

		}

		return self::$widget_by;
  }
}