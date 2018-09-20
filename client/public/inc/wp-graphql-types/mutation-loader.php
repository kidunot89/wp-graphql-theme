<?php
  /**
   * Loads WPGraphQL custom mutation namespaces
   * @package twentyfifteen
   */

  require_once get_template_directory() . '/inc/stylist.php';
  require_once __DIR__ . '/Data/DataSource.php';
  require_once __DIR__ . '/Style/Mutation/StyleMutation.php';
  require_once __DIR__ . '/Style/Mutation/StyleDelete.php';
  require_once __DIR__ . '/Style/Mutation/StyleSelect.php';
  require_once __DIR__ . '/Style/Mutation/StyleUpdate.php';
  require_once __DIR__ . '/ThemeMods/Mutation/ThemeModsMutation.php';
  require_once __DIR__ . '/ThemeMods/Mutation/ThemeModsUpdate.php';