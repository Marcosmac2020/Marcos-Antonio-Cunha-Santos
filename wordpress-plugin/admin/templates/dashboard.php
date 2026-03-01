<?php
/**
 * Admin Dashboard Template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$stats = $this->get_dashboard_stats();
$recent_activity = $this->get_recent_activity();
?>

<div class="ptp-admin-wrapper">
    <div class="ptp-dashboard-header">
        <h1><?php _e('Perícia Trabalhista Pro', 'pericia-trabalhista-pro'); ?></h1>
        <p><?php _e('Sistema completo para gestão de laudos periciais trabalhistas', 'pericia-trabalhista-pro'); ?></p>
    </div>

    <!-- Stats Grid -->
    <div class="ptp-stats-grid">
        <div class="ptp-stat-card processos">
            <div class="ptp-stat-number" data-stat="processos"><?php echo esc_html($stats['processos']); ?></div>
            <div class="ptp-stat-label"><?php _e('Processos Ativos', 'pericia-trabalhista-pro'); ?></div>
        </div>
        
        <div class="ptp-stat-card laudos">
            <div class="ptp-stat-number" data-stat="laudos"><?php echo esc_html($stats['laudos']); ?></div>
            <div class="ptp-stat-label"><?php _e('Laudos Emitidos', 'pericia-trabalhista-pro'); ?></div>
        </div>
        
        <div class="ptp-stat-card pendentes">
            <div class="ptp-stat-number" data-stat="pendentes"><?php echo esc_html($stats['pendentes']); ?></div>
            <div class="ptp-stat-label"><?php _e('Pendentes', 'pericia-trabalhista-pro'); ?></div>
        </div>
        
        <div class="ptp-stat-card concluidos">
            <div class="ptp-stat-number" data-stat="concluidos"><?php echo esc_html($stats['concluidos']); ?></div>
            <div class="ptp-stat-label"><?php _e('Concluídos', 'pericia-trabalhista-pro'); ?></div>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
        <!-- Recent Activity -->
        <div class="ptp-recent-activity">
            <h2><?php _e('Atividade Recente', 'pericia-trabalhista-pro'); ?></h2>
            
            <?php if (empty($recent_activity)): ?>
                <p><?php _e('Nenhuma atividade recente encontrada.', 'pericia-trabalhista-pro'); ?></p>
            <?php else: ?>
                <ul class="ptp-activity-list">
                    <?php foreach ($recent_activity as $activity): ?>
                        <li class="ptp-activity-item">
                            <div class="ptp-activity-icon <?php echo esc_attr($activity['type']); ?>">
                                <?php
                                $icon = '';
                                switch ($activity['type']) {
                                    case 'processo':
                                        $icon = '📋';
                                        break;
                                    case 'laudo':
                                        $icon = '📄';
                                        break;
                                    case 'prazo':
                                        $icon = '⏰';
                                        break;
                                    default:
                                        $icon = '📌';
                                }
                                echo esc_html($icon);
                                ?>
                            </div>
                            <div class="ptp-activity-content">
                                <div class="ptp-activity-title"><?php echo esc_html($activity['title']); ?></div>
                                <div class="ptp-activity-time"><?php echo esc_html($activity['time']); ?></div>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>
        </div>

        <!-- Quick Actions -->
        <div class="ptp-recent-activity">
            <h2><?php _e('Ações Rápidas', 'pericia-trabalhista-pro'); ?></h2>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="ptp-button" onclick="window.location.href='<?php echo admin_url('post-new.php?post_type=ptp_process'); ?>'">
                    <?php _e('Novo Processo', 'pericia-trabalhista-pro'); ?>
                </button>
                
                <button class="ptp-button" onclick="window.location.href='<?php echo admin_url('post-new.php?post_type=ptp_laudo'); ?>'">
                    <?php _e('Novo Laudo', 'pericia-trabalhista-pro'); ?>
                </button>
                
                <button class="ptp-button secondary" onclick="window.location.href='<?php echo admin_url('edit.php?post_type=ptp_process'); ?>'">
                    <?php _e('Ver Todos os Processos', 'pericia-trabalhista-pro'); ?>
                </button>
                
                <button class="ptp-button secondary" onclick="window.location.href='<?php echo admin_url('admin.php?page=ptp-settings'); ?>'">
                    <?php _e('Configurações', 'pericia-trabalhista-pro'); ?>
                </button>
            </div>
        </div>
    </div>

    <!-- Charts Section -->
    <?php if (class_exists('ChartJs')): ?>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
        <div class="ptp-recent-activity">
            <h2><?php _e('Evolução de Processos', 'pericia-trabalhista-pro'); ?></h2>
            <canvas id="ptp-process-chart" width="400" height="200"></canvas>
        </div>
        
        <div class="ptp-recent-activity">
            <h2><?php _e('Distribuição de Status', 'pericia-trabalhista-pro'); ?></h2>
            <canvas id="ptp-activity-chart" width="400" height="200"></canvas>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php
// Helper methods
class PTP_Dashboard_Helper {
    
    public function get_dashboard_stats() {
        return array(
            'processos' => wp_count_posts('ptp_process')->publish,
            'laudos' => wp_count_posts('ptp_laudo')->publish,
            'pendentes' => $this->get_pendent_count(),
            'concluidos' => $this->get_concluded_count(),
        );
    }
    
    public function get_recent_activity() {
        global $wpdb;
        
        $activities = array();
        
        // Recent processes
        $recent_processes = get_posts(array(
            'post_type' => 'ptp_process',
            'numberposts' => 3,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        
        foreach ($recent_processes as $process) {
            $activities[] = array(
                'type' => 'processo',
                'title' => sprintf(__('Novo processo: %s', 'pericia-trabalhista-pro'), $process->post_title),
                'time' => sprintf(__('%s atrás', 'pericia-trabalhista-pro'), human_time_diff(strtotime($process->post_date)))
            );
        }
        
        // Recent laudos
        $recent_laudos = get_posts(array(
            'post_type' => 'ptp_laudo',
            'numberposts' => 2,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        
        foreach ($recent_laudos as $laudo) {
            $activities[] = array(
                'type' => 'laudo',
                'title' => sprintf(__('Novo laudo: %s', 'pericia-trabalhista-pro'), $laudo->post_title),
                'time' => sprintf(__('%s atrás', 'pericia-trabalhista-pro'), human_time_diff(strtotime($laudo->post_date)))
            );
        }
        
        return $activities;
    }
    
    private function get_pendent_count() {
        $args = array(
            'post_type' => 'ptp_process',
            'post_status' => 'pending',
            'numberposts' => -1
        );
        
        $posts = get_posts($args);
        return count($posts);
    }
    
    private function get_concluded_count() {
        $args = array(
            'post_type' => 'ptp_process',
            'post_status' => 'completed',
            'numberposts' => -1
        );
        
        $posts = get_posts($args);
        return count($posts);
    }
}

$dashboard_helper = new PTP_Dashboard_Helper();
