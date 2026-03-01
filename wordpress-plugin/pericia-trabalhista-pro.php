<?php
/**
 * Plugin Name: Perícia Trabalhista Pro
 * Plugin URI: https://pericia-trabalhista-pro.com
 * Description: Sistema completo para gestão de laudos periciais trabalhistas com integração ao sistema web.
 * Version: 1.0.0
 * Author: Perícia Trabalhista Pro
 * Author URI: https://pericia-trabalhista-pro.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: pericia-trabalhista-pro
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PTP_VERSION', '1.0.0');
define('PTP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PTP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PTP_API_BASE', 'pericia-trabalhista-pro/v1');

/**
 * Main plugin class
 */
class PericiaTrabalhistaPro {
    
    private static $instance = null;
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_api_routes'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_shortcode('pericia_trabalhista_form', array($this, 'render_form_shortcode'));
        add_shortcode('pericia_trabalhista_dashboard', array($this, 'render_dashboard_shortcode'));
        
        // Activation hook
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Load text domain
        load_plugin_textdomain('pericia-trabalhista-pro', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Initialize custom post types
        $this->register_post_types();
        
        // Initialize custom roles
        $this->register_roles();
    }
    
    /**
     * Register custom post types
     */
    private function register_post_types() {
        // Perícia Process
        register_post_type('ptp_process', array(
            'labels' => array(
                'name' => __('Processos Periciais', 'pericia-trabalhista-pro'),
                'singular_name' => __('Processo Pericial', 'pericia-trabalhista-pro'),
                'menu_name' => __('Perícias', 'pericia-trabalhista-pro'),
                'add_new' => __('Adicionar Novo', 'pericia-trabalhista-pro'),
                'add_new_item' => __('Adicionar Novo Processo', 'pericia-trabalhista-pro'),
                'edit_item' => __('Editar Processo', 'pericia-trabalhista-pro'),
                'new_item' => __('Novo Processo', 'pericia-trabalhista-pro'),
                'view_item' => __('Ver Processo', 'pericia-trabalhista-pro'),
                'search_items' => __('Buscar Processos', 'pericia-trabalhista-pro'),
                'not_found' => __('Nenhum processo encontrado', 'pericia-trabalhista-pro'),
                'not_found_in_trash' => __('Nenhum processo na lixeira', 'pericia-trabalhista-pro'),
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'excerpt', 'custom-fields', 'thumbnail'),
            'menu_icon' => 'dashicons-clipboard',
            'capability_type' => 'post',
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'processos-periciais'),
        ));
        
        // Laudo Pericial
        register_post_type('ptp_laudo', array(
            'labels' => array(
                'name' => __('Laudos Periciais', 'pericia-trabalhista-pro'),
                'singular_name' => __('Laudo Pericial', 'pericia-trabalhista-pro'),
                'menu_name' => __('Laudos', 'pericia-trabalhista-pro'),
                'add_new' => __('Adicionar Novo', 'pericia-trabalhista-pro'),
                'add_new_item' => __('Adicionar Novo Laudo', 'pericia-trabalhista-pro'),
                'edit_item' => __('Editar Laudo', 'pericia-trabalhista-pro'),
                'new_item' => __('Novo Laudo', 'pericia-trabalhista-pro'),
                'view_item' => __('Ver Laudo', 'pericia-trabalhista-pro'),
                'search_items' => __('Buscar Laudos', 'pericia-trabalhista-pro'),
                'not_found' => __('Nenhum laudo encontrado', 'pericia-trabalhista-pro'),
                'not_found_in_trash' => __('Nenhum laudo na lixeira', 'pericia-trabalhista-pro'),
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'excerpt', 'custom-fields', 'thumbnail'),
            'menu_icon' => 'dashicons-media-document',
            'capability_type' => 'post',
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'laudos-periciais'),
        ));
    }
    
    /**
     * Register custom user roles
     */
    private function register_roles() {
        // Perito Role
        add_role('ptp_perito', __('Perito', 'pericia-trabalhista-pro'), array(
            'read' => true,
            'edit_posts' => true,
            'edit_published_posts' => true,
            'publish_posts' => true,
            'read_private_posts' => true,
            'edit_ptp_process' => true,
            'edit_ptp_laudo' => true,
            'read_ptp_process' => true,
            'read_ptp_laudo' => true,
        ));
        
        // Assistente Role
        add_role('ptp_assistente', __('Assistente Pericial', 'pericia-trabalhista-pro'), array(
            'read' => true,
            'edit_posts' => false,
            'read_ptp_process' => true,
            'read_ptp_laudo' => true,
        ));
    }
    
    /**
     * Register API routes
     */
    public function register_api_routes() {
        register_rest_route(PTP_API_BASE, '/processos', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_processos'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'create_processo'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
        ));
        
        register_rest_route(PTP_API_BASE, '/processos/(?P<id>\\d+)', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_processo'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
            array(
                'methods' => 'PUT',
                'callback' => array($this, 'update_processo'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
            array(
                'methods' => 'DELETE',
                'callback' => array($this, 'delete_processo'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
        ));
        
        register_rest_route(PTP_API_BASE, '/laudos', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_laudos'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'create_laudo'),
                'permission_callback' => array($this, 'check_api_permission'),
            ),
        ));
    }
    
    /**
     * Check API permission
     */
    public function check_api_permission() {
        return current_user_can('read') || wp_verify_nonce($_REQUEST['_wpnonce'] ?? '', 'wp_rest');
    }
    
    /**
     * Get processos
     */
    public function get_processos($request) {
        $args = array(
            'post_type' => 'ptp_process',
            'posts_per_page' => $request->get_param('per_page') ?? 10,
            'paged' => $request->get_param('page') ?? 1,
        );
        
        $query = new WP_Query($args);
        $processos = array();
        
        foreach ($query->posts as $post) {
            $processos[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'status' => $post->post_status,
                'date' => $post->post_date,
                'meta' => get_post_meta($post->ID),
            );
        }
        
        return new WP_REST_Response($processos, 200);
    }
    
    /**
     * Create processo
     */
    public function create_processo($request) {
        $params = $request->get_params();
        
        $post_id = wp_insert_post(array(
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['content'] ?? ''),
            'post_status' => 'publish',
            'post_type' => 'ptp_process',
        ));
        
        if (is_wp_error($post_id)) {
            return new WP_REST_Response(array('error' => $post_id->get_error_message()), 400);
        }
        
        // Save meta fields
        if (isset($params['meta']) && is_array($params['meta'])) {
            foreach ($params['meta'] as $key => $value) {
                update_post_meta($post_id, $key, sanitize_text_field($value));
            }
        }
        
        return new WP_REST_Response(array('id' => $post_id, 'message' => 'Processo criado com sucesso'), 201);
    }
    
    /**
     * Get processo
     */
    public function get_processo($request) {
        $post_id = $request->get_param('id');
        $post = get_post($post_id);
        
        if (!$post || $post->post_type !== 'ptp_process') {
            return new WP_REST_Response(array('error' => 'Processo não encontrado'), 404);
        }
        
        return new WP_REST_Response(array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'content' => $post->post_content,
            'status' => $post->post_status,
            'date' => $post->post_date,
            'meta' => get_post_meta($post->ID),
        ), 200);
    }
    
    /**
     * Update processo
     */
    public function update_processo($request) {
        $post_id = $request->get_param('id');
        $params = $request->get_params();
        
        $post_data = array(
            'ID' => $post_id,
        );
        
        if (isset($params['title'])) {
            $post_data['post_title'] = sanitize_text_field($params['title']);
        }
        
        if (isset($params['content'])) {
            $post_data['post_content'] = wp_kses_post($params['content']);
        }
        
        $result = wp_update_post($post_data);
        
        if (is_wp_error($result)) {
            return new WP_REST_Response(array('error' => $result->get_error_message()), 400);
        }
        
        // Update meta fields
        if (isset($params['meta']) && is_array($params['meta'])) {
            foreach ($params['meta'] as $key => $value) {
                update_post_meta($post_id, $key, sanitize_text_field($value));
            }
        }
        
        return new WP_REST_Response(array('message' => 'Processo atualizado com sucesso'), 200);
    }
    
    /**
     * Delete processo
     */
    public function delete_processo($request) {
        $post_id = $request->get_param('id');
        $result = wp_delete_post($post_id, true);
        
        if (!$result) {
            return new WP_REST_Response(array('error' => 'Erro ao deletar processo'), 400);
        }
        
        return new WP_REST_Response(array('message' => 'Processo deletado com sucesso'), 200);
    }
    
    /**
     * Get laudos
     */
    public function get_laudos($request) {
        $args = array(
            'post_type' => 'ptp_laudo',
            'posts_per_page' => $request->get_param('per_page') ?? 10,
            'paged' => $request->get_param('page') ?? 1,
        );
        
        $query = new WP_Query($args);
        $laudos = array();
        
        foreach ($query->posts as $post) {
            $laudos[] = array(
                'id' => $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'status' => $post->post_status,
                'date' => $post->post_date,
                'meta' => get_post_meta($post->ID),
            );
        }
        
        return new WP_REST_Response($laudos, 200);
    }
    
    /**
     * Create laudo
     */
    public function create_laudo($request) {
        $params = $request->get_params();
        
        $post_id = wp_insert_post(array(
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['content'] ?? ''),
            'post_status' => 'publish',
            'post_type' => 'ptp_laudo',
        ));
        
        if (is_wp_error($post_id)) {
            return new WP_REST_Response(array('error' => $post_id->get_error_message()), 400);
        }
        
        // Save meta fields
        if (isset($params['meta']) && is_array($params['meta'])) {
            foreach ($params['meta'] as $key => $value) {
                update_post_meta($post_id, $key, sanitize_text_field($value));
            }
        }
        
        return new WP_REST_Response(array('id' => $post_id, 'message' => 'Laudo criado com sucesso'), 201);
    }
    
    /**
     * Enqueue frontend scripts
     */
    public function enqueue_scripts() {
        wp_enqueue_style('ptp-frontend', PTP_PLUGIN_URL . 'assets/css/frontend.css', array(), PTP_VERSION);
        wp_enqueue_script('ptp-frontend', PTP_PLUGIN_URL . 'assets/js/frontend.js', array('jquery'), PTP_VERSION, true);
        
        wp_localize_script('ptp-frontend', 'ptp_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ptp_nonce'),
            'api_base' => rest_url(PTP_API_BASE),
        ));
    }
    
    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        wp_enqueue_style('ptp-admin', PTP_PLUGIN_URL . 'assets/css/admin.css', array(), PTP_VERSION);
        wp_enqueue_script('ptp-admin', PTP_PLUGIN_URL . 'assets/js/admin.js', array('jquery', 'wp-api'), PTP_VERSION, true);
        
        wp_localize_script('ptp-admin', 'ptp_admin', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ptp_nonce'),
            'api_base' => rest_url(PTP_API_BASE),
        ));
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('Perícia Trabalhista Pro', 'pericia-trabalhista-pro'),
            __('Perícia Pro', 'pericia-trabalhista-pro'),
            'manage_options',
            'ptp-dashboard',
            array($this, 'render_admin_dashboard'),
            'dashicons-clipboard',
            30
        );
        
        add_submenu_page(
            'ptp-dashboard',
            __('Dashboard', 'pericia-trabalhista-pro'),
            __('Dashboard', 'pericia-trabalhista-pro'),
            'manage_options',
            'ptp-dashboard',
            array($this, 'render_admin_dashboard')
        );
        
        add_submenu_page(
            'ptp-dashboard',
            __('Configurações', 'pericia-trabalhista-pro'),
            __('Configurações', 'pericia-trabalhista-pro'),
            'manage_options',
            'ptp-settings',
            array($this, 'render_admin_settings')
        );
    }
    
    /**
     * Render admin dashboard
     */
    public function render_admin_dashboard() {
        include PTP_PLUGIN_DIR . 'admin/templates/dashboard.php';
    }
    
    /**
     * Render admin settings
     */
    public function render_admin_settings() {
        include PTP_PLUGIN_DIR . 'admin/templates/settings.php';
    }
    
    /**
     * Render form shortcode
     */
    public function render_form_shortcode($atts) {
        $atts = shortcode_atts(array(
            'type' => 'processo',
            'redirect' => '',
        ), $atts);
        
        ob_start();
        include PTP_PLUGIN_DIR . 'public/templates/form.php';
        return ob_get_clean();
    }
    
    /**
     * Render dashboard shortcode
     */
    public function render_dashboard_shortcode($atts) {
        $atts = shortcode_atts(array(
            'user_role' => 'perito',
            'show_stats' => 'true',
        ), $atts);
        
        ob_start();
        include PTP_PLUGIN_DIR . 'public/templates/dashboard.php';
        return ob_get_clean();
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create database tables
        $this->create_tables();
        
        // Set default options
        add_option('ptp_version', PTP_VERSION);
        add_option('ptp_api_url', '');
        add_option('ptp_api_key', '');
        add_option('ptp_webhook_url', '');
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Create database tables
     */
    private function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'ptp_process_data';
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            process_id bigint(20) NOT NULL,
            field_name varchar(100) NOT NULL,
            field_value longtext,
            created_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            updated_at datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            PRIMARY KEY  (id),
            KEY process_id (process_id),
            KEY field_name (field_name)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

// Initialize plugin
PericiaTrabalhistaPro::get_instance();
