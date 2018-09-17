<?php
  /**
   * Loads WPGraphQL custom query namespaces
   * @package twentyfifteen
   */
  require_once get_template_directory() . '/inc/stylist.php';
  require_once __DIR__ . '/TypeRegistry.php';
  require_once __DIR__ . '/WPInterfaceType.php';
  require_once __DIR__ . '/Types/Sidebar/Connection/SidebarConnectionResolver.php';
  require_once __DIR__ . '/Types/Widget/Connection/WidgetConnectionResolver.php';
  require_once __DIR__ . '/Data/DataSource.php';
  require_once __DIR__ . '/Types/Sidebar/Connection/SidebarConnectionDefinition.php';
  require_once __DIR__ . '/Types/Sidebar/SidebarQuery.php';
  require_once __DIR__ . '/Types/Sidebar/SidebarType.php';
  require_once __DIR__ . '/Types/Style/StyleType.php';
  require_once __DIR__ . '/Types/Style/StyleQuery.php';
  require_once __DIR__ . '/Types/Style/Mutation/StyleMutation.php';
  require_once __DIR__ . '/Types/Style/Mutation/StyleDelete.php';
  require_once __DIR__ . '/Types/Style/Mutation/StyleUpdate.php';
  require_once __DIR__ . '/Types/ThemeMods/ThemeModsType.php';
  require_once __DIR__ . '/Types/ThemeMods/ThemeModsQuery.php';
  require_once __DIR__ . '/Types/ThemeMods/Mutation/ThemeModsMutation.php';
  require_once __DIR__ . '/Types/ThemeMods/Mutation/ThemeModsUpdate.php';
  require_once __DIR__ . '/Types/Widget/Connection/WidgetConnectionDefinition.php';
  require_once __DIR__ . '/Types/Widget/WidgetQuery.php';
  require_once __DIR__ . '/Types/Widget/WidgetInterfaceType.php';
  require_once __DIR__ . '/Types/Widget/WidgetTypes.php';