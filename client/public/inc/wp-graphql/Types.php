<?php
  namespace WPGraphQL;

  require_once ABSPATH . WPINC . '/class-wp-customize-manager.php';
  require_once __DIR__ . '/ThemeMods/ThemeModsFields.php';
  require_once __DIR__ . '/ThemeMods/ThemeModsType.php';
  require_once __DIR__ . '/ThemeMods/ThemeModsQuery.php';
  require_once __DIR__ . '/ThemeMods/Mutation/ThemeModsMutation.php';
  require_once __DIR__ . '/ThemeMods/Mutation/ThemeModsUpdate.php';

  use WPGraphQL\Type\ThemeMods\ThemeModsType;

  class ThemeTypes {
    private static $theme_mods;

    public static function theme_mods() {
      return self::$theme_mods ?: self::$theme_mods = new ThemeModsType();
    }
  }