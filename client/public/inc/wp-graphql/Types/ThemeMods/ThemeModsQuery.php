<?php

namespace WPGraphQL\Type\ThemeMods;

use WPGraphQL\CustomTypes;
use WPGraphQL\Types;
use WPGraphQL\Data\DataSource;
use WPGraphQL\Data\ExtraSource;

/**
 * Class ThemeModsQuery
 *
 * @since 0.0.1
 * @package WPGraphQL\Type\ThemeMods
 */
class ThemeModsQuery {

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
				'type'        => CustomTypes::theme_mods(),
				'resolve'     => function () {
					return ExtraSource::resolve_theme_mods_data();
				},
			];
		}

		return self::$root_query;
	}
}
