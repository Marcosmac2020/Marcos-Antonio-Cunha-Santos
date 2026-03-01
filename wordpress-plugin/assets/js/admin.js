/**
 * Perícia Trabalhista Pro - Admin JavaScript
 */

(function($) {
    'use strict';

    // Main admin object
    window.PTPAdmin = {
        init: function() {
            this.bindEvents();
            this.loadDashboardStats();
            this.initCharts();
        },

        bindEvents: function() {
            // Form submissions
            $(document).on('submit', '.ptp-ajax-form', this.handleFormSubmit);
            
            // Delete confirmations
            $(document).on('click', '.ptp-delete-btn', this.handleDelete);
            
            // Toggle settings sections
            $(document).on('click', '.ptp-settings-toggle', this.toggleSettings);
            
            // API test button
            $(document).on('click', '#ptp-test-api', this.testApiConnection);
        },

        handleFormSubmit: function(e) {
            e.preventDefault();
            
            var $form = $(this);
            var $submitBtn = $form.find('button[type="submit"]');
            var originalText = $submitBtn.text();
            
            // Show loading state
            $submitBtn.prop('disabled', true).text('Salvando...');
            
            // Remove previous notices
            $('.ptp-notice').remove();
            
            // Submit form via AJAX
            $.ajax({
                url: ptp_admin.ajax_url,
                type: 'POST',
                data: $form.serialize() + '&action=ptp_save_form&nonce=' + ptp_admin.nonce,
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        PTPAdmin.showNotice('success', response.data.message);
                        
                        // Reset form if specified
                        if (response.data.reset) {
                            $form[0].reset();
                        }
                        
                        // Trigger custom event
                        $(document).trigger('ptp:form:saved', [response.data]);
                    } else {
                        PTPAdmin.showNotice('error', response.data.message || 'Erro ao salvar formulário.');
                    }
                },
                error: function() {
                    PTPAdmin.showNotice('error', 'Erro de conexão. Tente novamente.');
                },
                complete: function() {
                    $submitBtn.prop('disabled', false).text(originalText);
                }
            });
        },

        handleDelete: function(e) {
            e.preventDefault();
            
            if (!confirm('Tem certeza que deseja excluir este item?')) {
                return;
            }
            
            var $btn = $(this);
            var itemId = $btn.data('id');
            var itemType = $btn.data('type');
            
            $btn.prop('disabled', true).text('Excluindo...');
            
            $.ajax({
                url: ptp_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'ptp_delete_item',
                    nonce: ptp_admin.nonce,
                    id: itemId,
                    type: itemType
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        PTPAdmin.showNotice('success', response.data.message);
                        
                        // Remove item from DOM
                        $btn.closest('.ptp-item-row').fadeOut(300, function() {
                            $(this).remove();
                            PTPAdmin.loadDashboardStats(); // Refresh stats
                        });
                        
                        // Trigger custom event
                        $(document).trigger('ptp:item:deleted', [response.data]);
                    } else {
                        PTPAdmin.showNotice('error', response.data.message || 'Erro ao excluir item.');
                    }
                },
                error: function() {
                    PTPAdmin.showNotice('error', 'Erro de conexão. Tente novamente.');
                },
                complete: function() {
                    $btn.prop('disabled', false).text('Excluir');
                }
            });
        },

        toggleSettings: function() {
            var $toggle = $(this);
            var $section = $toggle.next('.ptp-settings-content');
            
            $section.slideToggle(300);
            $toggle.toggleClass('open');
        },

        testApiConnection: function() {
            var $btn = $(this);
            var apiUrl = $('#ptp_api_url').val();
            var apiKey = $('#ptp_api_key').val();
            
            if (!apiUrl || !apiKey) {
                PTPAdmin.showNotice('error', 'Preencha a URL da API e a chave de API.');
                return;
            }
            
            $btn.prop('disabled', true).text('Testando...');
            
            $.ajax({
                url: ptp_admin.api_base + '/test',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiKey,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    PTPAdmin.showNotice('success', 'Conexão com API estabelecida com sucesso!');
                },
                error: function(xhr) {
                    var message = 'Falha na conexão com a API.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        message += ' Erro: ' + xhr.responseJSON.message;
                    }
                    PTPAdmin.showNotice('error', message);
                },
                complete: function() {
                    $btn.prop('disabled', false).text('Testar Conexão');
                }
            });
        },

        loadDashboardStats: function() {
            $.ajax({
                url: ptp_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'ptp_get_dashboard_stats',
                    nonce: ptp_admin.nonce
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        PTPAdmin.updateStatsDisplay(response.data.stats);
                    }
                }
            });
        },

        updateStatsDisplay: function(stats) {
            // Update stat cards
            $('.ptp-stat-number').each(function() {
                var $stat = $(this);
                var statType = $stat.data('stat');
                
                if (stats[statType] !== undefined) {
                    $stat.text(stats[statType]);
                }
            });
        },

        initCharts: function() {
            // Initialize charts if Chart.js is available
            if (typeof Chart !== 'undefined') {
                this.initProcessChart();
                this.initActivityChart();
            }
        },

        initProcessChart: function() {
            var ctx = document.getElementById('ptp-process-chart');
            if (!ctx) return;
            
            $.ajax({
                url: ptp_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'ptp_get_chart_data',
                    nonce: ptp_admin.nonce,
                    chart: 'processes'
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: response.data.labels,
                                datasets: [{
                                    label: 'Novos Processos',
                                    data: response.data.data,
                                    borderColor: '#667eea',
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    tension: 0.4
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top'
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                }
            });
        },

        initActivityChart: function() {
            var ctx = document.getElementById('ptp-activity-chart');
            if (!ctx) return;
            
            $.ajax({
                url: ptp_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'ptp_get_chart_data',
                    nonce: ptp_admin.nonce,
                    chart: 'activity'
                },
                dataType: 'json',
                success: function(response) {
                    if (response.success) {
                        new Chart(ctx, {
                            type: 'doughnut',
                            data: {
                                labels: response.data.labels,
                                datasets: [{
                                    data: response.data.data,
                                    backgroundColor: [
                                        '#3498db',
                                        '#2ecc71',
                                        '#f39c12',
                                        '#e74c3c',
                                        '#9b59b6'
                                    ]
                                }]
                            },
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'right'
                                    }
                                }
                            }
                        });
                    }
                }
            });
        },

        showNotice: function(type, message) {
            var $notice = $('<div class="ptp-notice ' + type + '">' + message + '</div>');
            
            // Insert at the top of the main content
            $('.wrap > h1').after($notice);
            
            // Auto-hide after 5 seconds
            setTimeout(function() {
                $notice.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
            
            // Scroll to top to show notice
            $('html, body').animate({
                scrollTop: $notice.offset().top - 50
            }, 300);
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        PTPAdmin.init();
    });

})(jQuery);
