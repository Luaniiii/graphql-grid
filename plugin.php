<?php
/**
 * Plugin Name: Gutenberg Block Tech
 * Description: Custom Gutenberg Block with GraphQL + React + Tailwind
 * Author: Luan Boshnjaku
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

add_action('init', function () {

    $block_json = __DIR__ . '/block.json';
    $asset_file = __DIR__ . '/build/index.asset.php';
    $asset = file_exists($asset_file) ? require $asset_file : ['dependencies' => [], 'version' => filemtime(__DIR__ . '/build/index.js')];

    wp_register_script(
        'graphql-grid-editor',
        plugins_url('build/index.js', __FILE__),
        $asset['dependencies'],
        $asset['version'],
        true
    );

    wp_register_style(
        'graphql-grid-style',
        plugins_url('build/style-index.css', __FILE__),
        [],
        filemtime(__DIR__ . '/build/style-index.css')
    );

    register_block_type($block_json, [
        'editor_script' => 'graphql-grid-editor',
        'style' => 'graphql-grid-style',
        'render_callback' => function ($attributes) {
            $postsToShow = $attributes['postsToShow'] ?? 4;
            $currentId = $attributes['currentPostId'] ?? get_the_ID();

            $query = '
    query GetLatestPosts($count: Int!, $excludeIds: [ID!]!) {
      posts(first: $count, where: { notIn: $excludeIds }) {
        nodes {
          id
          title
          slug
          uri
          featuredImage {
            node { sourceUrl(size: THUMBNAIL) }
          }
        }
      }
    }';

            $currentId = $attributes['currentPostId'] ?? get_the_ID();

            $variables = [
                'count' => $postsToShow,
                'excludeIds' => $currentId ? [$currentId] : []
            ];

            $result = function_exists('graphql_execute_sync') ? graphql_execute_sync(null, $query, $variables) : null;
            $latest_posts = $result['data']['posts']['nodes'] ?? [];

            $html = '<div class="lpg-wrapper" data-posts-to-show="' . esc_attr($postsToShow) . '">';
            foreach ($latest_posts as $post) {
                $title = $post['title'] ?? '';
                $link = $post['link'] ?? '/';
                $featured = $post['featuredImage']['node']['sourceUrl'] ?? '';

                $html .= '<div class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">';
                if ($featured) {
                    $html .= '<img src="' . esc_url($featured) . '" alt="' . esc_attr($title) . '" class="w-full h-40 object-cover rounded mb-3">';
                }
                $html .= '<a href="' . esc_url($link) . '" class="text-sm md:text-base font-semibold text-gray-800 hover:text-blue-600 hover:underline truncate">' . esc_html($title) . '</a>';
                $html .= '</div>';
            }
            $html .= '</div>';

            return $html;
        }
    ]);
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'graphql-grid-frontend',
        plugins_url('src/view.js', __FILE__),
        ['wp-element'],
        filemtime(__DIR__ . '/src/view.js'),
        true
    );

    wp_enqueue_style('graphql-grid-style');

    wp_localize_script('graphql-grid-frontend', 'lpgSettings', [
        'graphqlEndpoint' => home_url('/graphql'),
        'currentPostId' => get_the_ID(),
        'homeUrl' => home_url(),
    ]);
});

add_action('enqueue_block_editor_assets', function () {
    wp_localize_script('graphql-grid-editor', 'lpgSettings', [
        'graphqlEndpoint' => home_url('/graphql'),
        'currentPostId' => get_the_ID(),
        'homeUrl' => home_url(),
    ]);
});
