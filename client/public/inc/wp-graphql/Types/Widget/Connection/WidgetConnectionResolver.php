<?php

namespace WPGraphQL\Type\Widget\Connection;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQLRelay\Connection\ArrayConnection;
use WPGraphQL\AppContext;
use WPGraphQL\Data\ConnectionResolver;
use WPGraphQL\Data\ExtraSource;
use WPGraphQL\Types;

/**
 * Class WidgetConnectionResolver
 *
 * @package WPGraphQL\Type\Widget\Connection
 * @since   0.0.31
 */
class WidgetConnectionResolver extends ConnectionResolver {

	/**
	 * This returns the $query_args that should be used when querying for widget in the widgetConnectionResolver.
	 * This checks what input $args are part of the query, combines them with various filters, etc and returns an
	 * array of $query_args to be used in the query
	 *
	 * @param mixed       $source  The query source being passed down to the resolver
	 * @param array       $args    The arguments that were provided to the query
	 * @param AppContext  $context Object containing app context that gets passed down the resolve tree
	 * @param ResolveInfo $info    Info about fields passed down the resolve tree
	 *
	 * @return array
	 */
	public static function get_query_args( $source, array $args, AppContext $context, ResolveInfo $info ) {
		
		/**
		 * Prepare for later use
		 */
		$last  = ! empty( $args['last'] ) ? $args['last'] : null;
		$first = ! empty( $args['first'] ) ? $args['first'] : null;

		$query_args = [];

		/**
		 * Collect the input_fields and prepare them for sending to the query
		 */
		$input_fields = [];
		if ( ! empty( $args['where'] ) ) {
			$input_fields = self::sanitize_input_fields( $args['where'], $source, $args, $context, $info );
		}

		/**
		 * Determine where we're at in the Graph and adjust the query context appropriately.
		 *
		 * For example, if we're querying for widgets as a field of sidebar query, this will 
		 * automatically set the query to pull widget that belong to that sidebar
		 */
		if ( true === is_array( $source ) && ! empty( $source[ 'is_sidebar' ] ) ) {
			$query_args['sidebar'] = $source[ 'id' ];
		}

		/**
		 * Merge the where args with the default query_args
		 */
		if ( ! empty( $args['where'] ) ) {
			$input_fields = self::sanitize_input_fields( $args['where'], $source, $args, $context, $info );
			$query_args = array_merge( $query_args, $input_fields );
		}

		/**
		 * Filter the $query args to allow folks to customize queries programmatically
		 *
		 * @param array       $query_args The args that will be passed to the WP_Query
		 * @param mixed       $source     The source that's passed down the GraphQL queries
		 * @param array       $args       The inputArgs on the field
		 * @param AppContext  $context    The AppContext passed down the GraphQL tree
		 * @param ResolveInfo $info       The ResolveInfo passed down the GraphQL tree
		 */
		$query_args = apply_filters( 'graphql_widget_connection_query_args', $query_args, $source, $args, $context, $info );
		
		return $query_args;

	}

	/**
	 * This queries the registered widgets and returns the response
	 *
	 * @param $query_args
	 *
	 * @return array
	 */
	public static function get_query( $query_args ) {
		global $wp_registered_widgets;

		/**
		 * Holds the query data to return
		 */
		$query = [];

		/**
		 * Query registered widget by where args
		 */
		$valid = [];
		foreach( $wp_registered_widgets as $id => $widget ) {
			if( ! empty( $query_args[ 'id' ] ) ) {
				if( $widget[ 'id' ] !== $query_args[ 'id' ] ) continue;
			}
			if( ! empty( $query_args[ 'name' ] ) ) {
				if( $widget[ 'name' ] !== $query_args[ 'name' ] ) continue;
			}
			if( ! empty( $query_args[ 'type' ] ) ) {
				if( $widget[ 'callback' ][0]->id_base !== $query_args[ 'type' ] ) continue;
			}
			$valid[ $id ] = $widget;
		}

		/**
		 * If Sidebar connection
		 */
		if ( ! empty( $query_args[ 'sidebar' ] ) ) {

			/**
			 * Get sidebar ID
			 */
			$sidebar_id = $query_args[ 'sidebar' ];

			/**
			 * Retrieve Sidebar > Widget listing
			 */
			$sidebars_widgets = get_option( 'sidebars_widgets', array() );
			if ( array_key_exists( $sidebar_id, $sidebars_widgets ) ) {
				$widget_ids = $sidebars_widgets[ $sidebar_id ];
				/**
				 * If empty sidebar return empty array
				 */
				if ( empty( $widget_ids ) ) {
					return $query;
				}
				
				/**
				 * Loop over each widget_id so we can fetch the data out of the wp_options table.
				 */
				foreach ( $widget_ids as $id ) {
					/**
					 * If widget not in valid widgets array continue.
					 */
					if ( empty( $valid[ $id ] ) ) continue;
					
					/**
					 * Create widget data object and add it to the query response
					 */
					$query[] = ExtraSource::create_widget_data_object( $valid[ $id ] );
				}

			}

		} else {

			foreach ( $valid as $valid_widget ) {
				/**
				 * Create widget data object and add it to the query response
				 */
				$query[] = ExtraSource::create_widget_data_object( $valid_widget );
			}

		}

		return $query;

	}

	/**
	 * Take an array return a connection - This helps bypass a bug in ConnectionResolver's get_array_slice function on line #119
	 *
	 * @return array
	 */
	public static function get_connection( $query, $null, $source, $args, $context, $info ) {
		$info = self::get_query_info( $query );
		$items = $info['items'];
		$array = [];
		if ( ! empty( $items ) && is_array( $items ) ) {
			foreach ( $items as $item ) {
				if( is_array( $item ) ) {
					$array[] = $item;
				}
			}
		}

		$meta = self::get_array_meta( $query, $args );
		$connection = ArrayConnection::connectionFromArraySlice( $array, $args, $meta );
		$connection['nodes'] = $array;
		return $connection;
	}

	/**
	 * This sets up the "allowed" args, and translates the GraphQL-friendly keys to WP_Query
	 * friendly keys. There's probably a cleaner/more dynamic way to approach this, but
	 * this was quick. I'd be down to explore more dynamic ways to map this, but for
	 * now this gets the job done.
	 *
	 * @param array       $args     Query "where" args
	 * @param mixed       $source   The query results for a query calling this
	 * @param array       $all_args All of the arguments for the query (not just the "where" args)
	 * @param AppContext  $context  The AppContext object
	 * @param ResolveInfo $info     The ResolveInfo object
	 *
	 * @since  0.0.5
	 * @access public
	 * @return array
	 */
	public static function sanitize_input_fields( array $args, $source, array $all_args, AppContext $context, ResolveInfo $info ) {

		$arg_mapping = [
			'id'   			=> 'id',
			'name'     	=> 'name',
			'basename'  => 'type',
		];

		/**
		 * Map and sanitize the input args to the WP_Query compatible args
		 */
		$query_args = Types::map_input( $args, $arg_mapping );

		/**
		 * Filter the input fields
		 * This allows plugins/themes to hook in and alter what $args should be allowed to be passed
		 * from a GraphQL Query to the WP_Query
		 *
		 * @param array       $query_args The mapped query arguments
		 * @param array       $args       Query "where" args
		 * @param string      $post_type  The post type for the query
		 * @param mixed       $source     The query results for a query calling this
		 * @param array       $all_args   All of the arguments for the query (not just the "where" args)
		 * @param AppContext  $context    The AppContext object
		 * @param ResolveInfo $info       The ResolveInfo object
		 *
		 * @since 0.0.5
		 * @return array
		 */
		$query_args = apply_filters( 'graphql_map_input_fields_to_widget_query', $query_args, $args, $source, $all_args, $context, $info );

		/**
		 * Return the Query Args
		 */
		return ! empty( $query_args ) && is_array( $query_args ) ? $query_args : [];

	}

}