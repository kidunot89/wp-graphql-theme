<?php
  namespace WPGraphQL;
  
  require_once __DIR__ . '/loader.php';

  use WPGraphQL\Type\Style\StyleType;
  use WPGraphQL\Type\ThemeMods\ThemeModsType;

  class CustomTypes {
    private static $style;
    private static $theme_mods;

    public static function style() {
      return self::$style ?: self::$style = new StyleType();
    }

    public static function theme_mods() {
      return self::$theme_mods ?: self::$theme_mods = new ThemeModsType();
    }
  }