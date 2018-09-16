<?php
	/**
	 * Custom Theme types and fields added to the WPGraphQL schema
	 *
	 * @package twentyfifteen-react-apollo
	 */

	use WPGraphQL\Data\DataSource;
	use WPGraphQL\Type\Style\Mutation\StyleDelete;
	use WPGraphQL\Type\Style\Mutation\StyleSelect;
	use WPGraphQL\Type\Style\Mutation\StyleUpdate;
	use WPGraphQL\Type\Style\StyleQuery;
	use WPGraphQL\Type\ThemeMods\Mutation\ThemeModsUpdate;
	use WPGraphQL\Type\ThemeMods\ThemeModsQuery;
	use WPGraphQL\CustomTypes;
	use WPGraphQL\Types;

  /**
	 * Retrieves WPGraphQL endpoint
	 * 
	 * @since 0.0.1
	 * @return string	 
	 */
	function twentyfifteen_graphql_endpoint() {
		return '/' . apply_filters( 'graphql_endpoint', 'graphql' );
	}

	/**
	 * Filter for adding Style, ThemeMods, Sidebar, and Widget Types to the WPGraphQL Schema
	 *
	 * @param array $schema_config
	 * @return array
	 */
	function twentyfifteen_types( $schema_config ) {
		require_once get_template_directory() . '/inc/wp-graphql/Types.php';

		if ( empty( $schema_config['types'] ) ) {
			$schema_config['types'] = [
				CustomTypes::style(),
				CustomTypes::theme_mods()
			];
		} else {
			$schema_config['types'] += [
				CustomTypes::style(),
				CustomTypes::theme_mods(),
			];
		}

		return $schema_config;
	}

	/**
	 * Filter for adding Style, ThemeMods, Sidebar, and Widget queries to the WPGraphQL RootQuery
	 *
	 * @param \GraphQL\Type\Definition\FieldDefinition $query_fields
	 * @return GraphQL\Type\Definition\FieldDefinition
	 */
	function twentyfifteen_queries( $query_fields ) {
		require_once get_template_directory() . '/inc/wp-graphql/Types.php';

		if ( empty( $query_fields['style'] ) ) {
			$query_fields['style'] = StyleQuery::root_query();
		}
		if ( empty( $query_fields['themeMods'] ) ) {
			$query_fields['themeMods'] = ThemeModsQuery::root_query();
		}
		return $query_fields;
	}
	add_filter( 'graphql_root_queries', 'twentyfifteen_queries' );

	/**
	 * Filter for adding Style, ThemeMods, Sidebar, and Widget queries to the WPGraphQL RootQuery
	 *
	 * @param \GraphQL\Type\Definition\FieldDefinition $mutation_fields
	 * @return \GraphQL\Type\Definition\FieldDefinition
	 */
	function twentyfifteen_mutations( $mutation_fields ) {
		require_once get_template_directory() . '/inc/wp-graphql/mutation-loader.php';

		if ( empty( $mutation_fields['deleteStyle'] ) ) {
			$mutation_fields['deleteStyle'] = StyleDelete::mutate();
		}

		if ( empty( $mutation_fields['selectStyle'] ) ) {
			$mutation_fields['selectStyle'] = StyleSelect::mutate();
		}

		if ( empty( $mutation_fields['updateStyle'] ) ) {
			$mutation_fields['updateStyle'] = StyleUpdate::mutate();
		}

		if ( empty( $mutation_fields['updateThemeMods'] ) ) {
			$mutation_fields['updateThemeMods'] = ThemeModsUpdate::mutate();
		}
		return $mutation_fields;
	} 
	add_filter( 'graphql_root_mutations', 'twentyfifteen_mutations' );

  /**
	 * Filter for adding fields to the AllSettings Type
	 * 
	 * @param \GraphQL\Type\Definition\FieldDefinition $fields
	 * @return \GraphQL\Type\Definition\FieldDefinition
	 */
	function twentyfifteen_all_settings_fields( $fields ) {

		/** 
		 * Holds the page_on_front setting
		 * @var array $fields['pageOnFront']
		 */
		if( empty( $fields['pageOnFront'] ) || $fields['pageOnFront']['type'] === Types::post_object( 'page' ) ) {

			$fields[ 'pageOnFront' ] = [
				'type' => Types::post_object( 'page' ),
				'description' => __( 'The page that should be displayed on the front page', THEME_NAME ),
				'resolve' => function() {
					$id = get_option( 'page_on_front' );

					return ! empty( $id ) ? get_page( absint( $id ) ) : null;
				},
			];
		}

		/** 
		 * Holds the page_for_posts setting
		 * @var array $fields['pageForPosts']
		 */
		if( empty( $fields['pageForPosts'] ) || $fields['pageForPosts']['type'] !== Types::int() ) { 
			$fields[ 'pageForPosts' ] = [
				'type' => Types::int(),
				'description' => __( 'The page that displays posts', THEME_NAME ),
				'resolve' => function() {
					$id = get_option( 'page_for_posts' );

					return ! empty( $id ) ? absint( $id ) : null;
				},
			];
		}

		/** 
		 * Holds the show_avatar setting
		 * @var array $fields['showAvatar']
		 */
		if( empty( $fields['showAvatars'] ) || $fields['showAvatars']['type'] !== Types::boolean() ) {
			$fields[ 'showAvatars' ] = [
				'type' => Types::boolean(),
				'description' => __( 'Avatar Display', THEME_NAME ),
				'resolve' => function() {
					return get_option( 'show_avatars', false );
				},
			];
		}

		/** 
		 * Holds the users_can_register setting
		 * @var array $fields['usersCanRegister']
		 */
		if( empty( $fields['usersCanRegister'] ) || $fields['usersCanRegister']['type'] !== Types::boolean() ) {
			$fields[ 'usersCanRegister' ] = [
				'type' => Types::boolean(),
				'description' => __( 'Anyone can register', THEME_NAME ),
				'resolve' => function() {
					return get_option( 'users_can_register', false );
				},
			];
		}

		/** 
		 * Holds the permalink_structure setting
		 * @var array $fields['permalinkStructure']
		 */
		if( empty( $fields['permalinkStructure'] ) || $fields['permalinkStructure']['type'] !== Types::string() ) {
			$fields[ 'permalinkStructure' ] = [
				'type' => Types::string(),
				'description' => __( 'The structure of the blog\'s permalinks.', THEME_NAME ),
				'resolve' => function() {
					return get_option( 'permalink_structure' );
				},
			];
		}

		/** 
		 * Holds the site url - recommended of the 'url' field in the `GeneralSetting` Type
		 * @var array $fields['homeUrl']
		 */
		if( empty( $fields['homeUrl'] ) || $fields['homeUrl']['type'] !== Types::string() ) {
			$fields[ 'homeUrl' ] = [
				'type' => Types::string(),
				'description' => __( 'The url to current site. Use this if site is a multisite', THEME_NAME ),
				'resolve' => function() {
					return home_url();
				},
			];
		}

		return $fields;

	}
	add_filter( 'graphql_settings_fields', 'twentyfifteen_all_settings_fields', 10 );

	/**
	 * Filter for adding fields to the Post Object Type
	 * 
	 * @param \GraphQL\Type\Definition\FieldDefinition $fields
	 * @return \GraphQL\Type\Definition\FieldDefinition
	 */
	function twentyfifteen_post_object_fields( $fields ) {
		
		/** 
		 * Holds the post type object permalink
		 * @var array $fields['permalink']
		 */
		if( empty( $fields['permalink'] ) || $fields['permalink']['type'] === Types::string() ) {
			$fields[ 'permalink' ] = [
					'type' 				=> Types::string(),
					'args' 				=> [
						'leavename' => [
							'type' 				=> Types::boolean(),
							'description' => __( 'Whether to keep post name or page name', THEME_NAME ),
						],
					],
				'description' 	=> __( 'The permalink to the post object', THEME_NAME ),
				'resolve' => function( \WP_Post $post, $args ) {
					if ( ! empty( $args['leavename'] ) && $args['leavename'] ) {
						$leavename = true;
					} else {
						$leavename = false;
					}

					/**
					 * Strip site url for routing use
					 */
					$permalink = str_replace( home_url(), '', get_permalink( $post, $leavename ) );

					return ( $permalink ) ? $permalink : null;
				},
			];

			return $fields;
		}

	}
	add_filter( 'graphql_post_fields', 'twentyfifteen_post_object_fields', 10);
	add_filter( 'graphql_page_fields', 'twentyfifteen_post_object_fields', 10);
	add_filter( 'graphql_attachment_fields', 'twentyfifteen_post_object_fields', 10);

	// Bug Fixes

	/**
	 * Fixes featuredImage resolve bug
	 *
	 * @param \GraphQL\Type\Definition\FieldDefinition $fields
	 * @return \GraphQL\Type\Definition\FieldDefinition
	 */
	function twentyfifteen_featured_image_bug( $fields ) {
		if( ! empty( $fields['featuredImage'] ) ) { 
			$fields['featuredImage']['resolve'] = function ( \WP_Post $post, $args ) {
				$thumbnail_id = get_post_thumbnail_id( $post->ID );
				return ! empty( $thumbnail_id ) ? DataSource::resolve_post_object( $thumbnail_id, 'attachment' ) : get_post( absint( $thumbnail_id ) );
			};
		}

		return $fields;
	}
	add_filter( 'graphql_post_fields', 'twentyfifteen_featured_image_bug', 10);