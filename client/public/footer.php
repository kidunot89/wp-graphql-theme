<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Gutenbergtheme
 */

?>

<footer id="colophon" class="site-footer">
	<div class="site-info">
		<div id="social-menu" class="social-menu">
			<button class="menu-toggle" aria-controls="social" aria-expanded="false"><?php esc_html_e( 'Social Menu', 'theme' ); ?></button>
			<?php
				wp_nav_menu( array(
					'theme_location' => 'social',
					'menu_id'        => 'social-menu',
				) );
			?>
		</nav><!-- #site-navigation -->
	</div><!-- .site-info -->
</footer><!-- #colophon -->
</div><!-- #page -->
<?php wp_footer(); ?>

</body>
</html>
