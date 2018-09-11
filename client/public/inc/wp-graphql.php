<?php
	/**
	 * Custom Theme types and fields added to the WPGraphQL schema
	 *
	 * @package twentyfifteen-react-apollo
	 */

	use WPGraphQL\Type\ThemeMods\Mutation\ThemeModsUpdate;
	use WPGraphQL\Type\ThemeMods\ThemeModsQuery;
	use WPGraphQL\ThemeTypes;
	use WPGraphQL\Types;

  /**
	 * Retrieves GraphQL endpoint
	 * 
	 * @since 0.0.1
	 * @return string	 
	 */
	function twentyfifteen_graphql_endpoint() {
		return '/' . apply_filters( 'graphql_endpoint', 'graphql' );
	}

	function twentyfifteen_types( $config ) {
		require_once get_template_directory() . '/inc/wp-graphql/Types.php';

		if ( empty( $config['types'] ) ) {
			$config['types'] = [ ThemeTypes::theme_mods() ];
		} else {
			$config['types'] += [ ThemeTypes::theme_mods() ];
		}
	}

	function twentyfifteen_theme_mods_queries( $fields ) {
		require_once get_template_directory() . '/inc/wp-graphql/Types.php';

		if ( empty( $fields['themeMods'] ) ) {
			$fields['themeMods'] = ThemeModsQuery::root_query();
		}
		return $fields;
	}
	add_filter( 'graphql_root_queries', 'twentyfifteen_theme_mods_queries' );

	function twentyfifteen_theme_mods_mutations( $fields ) {
		require_once get_template_directory() . '/inc/wp-graphql/ThemeMods/Mutation/ThemeModsMutation.php';
		require_once get_template_directory() . '/inc/wp-graphql/ThemeMods/Mutation/ThemeModsUpdate.php';

		if ( empty( $fields['themeMods'] ) ) {
			$fields['updateThemeMods'] = ThemeModsUpdate::mutate();
		}
		return $fields;
	} 
	add_filter( 'graphql_root_mutations', 'twentyfifteen_theme_mods_mutations' );

  /**
	 * Adds required settings that don't use the Settings API to the allSettings type schema
	 * 
	 * @since  				0.4.0
	 * @return array 	filtered fields
	 */
	function twentyfifteen_add_settings_field( $fields ) {

		/** 
		 * page_on_front
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
		 * page_for_posts
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
		 * show_avatars
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
		 * users_can_register
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
		 * permalink_structure - used for making react-router mimic permalinks
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
		 * home_url() - for retrieving the current site's home url on multi-sites
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
	add_filter( 'graphql_settings_fields', 'twentyfifteen_add_settings_field', 10 );

	/**
	 * Adds permalink field to post objects type
	 * 
	 * @since  				0.5.0
	 * @return array 	filtered fields
	 */
	function twentyfifteen_add_post_object_fields( $fields ) {
		
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
					if ( ! empty( $args[ 'leavename' ] ) && $args[ 'leavename' ] ) {
						$leavename = true;
					} else {
						$leavename = false;
					}

					$permalink = str_replace( home_url(), '', get_permalink( $post, $leavename ) );

					return ( $permalink ) ? $permalink : null;
				},
			];

			return $fields;
		}

	}
	add_filter( 'graphql_post_fields', 'twentyfifteen_add_post_object_fields', 10);
	add_filter( 'graphql_page_fields', 'twentyfifteen_add_post_object_fields', 10);
	add_filter( 'graphql_attachment_fields', 'twentyfifteen_add_post_object_fields', 10);
