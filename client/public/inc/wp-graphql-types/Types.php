<?php
  namespace WPGraphQL;
  
  require_once __DIR__ . '/loader.php';

  use WPGraphQL\Type\Sidebar\SidebarType;
  use WPGraphQL\Type\Style\StyleType;
  use WPGraphQL\Type\ThemeMods\ThemeModsType;
  use WPGraphQL\Type\Widget\WidgetInterfaceType;

  class CustomTypes {
    private static $sidebar;
    private static $style;
    private static $theme_mods;
    private static $widget;

    public static function sidebar() {
      return self::$sidebar ?: self::$sidebar = new SideBarType();
    }

    public static function style() {
      return self::$style ?: self::$style = new StyleType();
    }

    public static function theme_mods() {
      return self::$theme_mods ?: self::$theme_mods = new ThemeModsType();
    }

    public static function widget() {
      return self::$widget ?: self::$widget = new WidgetInterfaceType();
    }
  }