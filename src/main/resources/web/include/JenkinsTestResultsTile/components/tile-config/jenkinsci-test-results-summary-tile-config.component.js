/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import template from './jenkinsc-test-results-tile-config.tpl.html';


class JenkinsCiTileConfigController {

    static $inject = ['JenkinsCIService', 'Ids', '$q', '$timeout'];

    constructor(JenkinsCIService, Ids, $q, $timeout) {
        this.sonarSummaryService = JenkinsCIService;
        this.Ids = Ids;
        this.$q = $q;
        this.$timeout = $timeout;

        this.metricsHandlers = {
            addCandidates: this.getMetricsByOptions.bind(this)
        };

        this.onBeforeSaveListener = this.beforeSave.bind(this);
    }

    $onInit() {
        this.parent.registerSaveListener(this.onBeforeSaveListener);
        this.metrics = _.keys(this.tile.properties.metrics.value).map(id => {
            return {id, title: this.tile.properties.metrics.value[id]};
        });

        this.isLoading = true;
        this.$q.all([
            this.refreshSonarServers(),
            this.refreshSonarMetrics()
        ]).finally(() => this.$timeout(() => this.isLoading = false));
    }

    $onDestroy() {
        this.parent.unregisterSaveListener(this.onBeforeSaveListener);
    }

    getMetricsByOptions(metadata, options) {
        return this.$q.resolve(_.filter(this.availableMetrics, (metric) => {
            return !_.find(this.metrics, {id: metric.id})
                    && metric.title.toLowerCase().indexOf(options.term.toLowerCase()) !== -1;
        }));
    }

    beforeSave(tile) {
        tile.properties.metrics = _.reduce(this.metrics, (tileMetrics, metric) => {
            tileMetrics.value[metric.id] = metric.title;
            return tileMetrics;
        }, {value: {}, variable: null});
    }

    refreshSonarServers() {
        this.sonarSummaryService.fetchSonarServers().then((sonarServers) => {
            this.sonarServers = sonarServers.map((sonarServer) => {
                return {
                    ...sonarServer,
                    id: this.Ids.getName(sonarServer.id),
                };
            });
        });
    }

    refreshSonarMetrics() {
        this.availableMetrics = [];
        if (!this.tile.properties.sonarServer) {
            this.hasSonarMetricsError = true;
            return this.$q.resolve(this.availableMetrics);
        }

        const configurationId = this.Ids.toConfigurationId(this.tile.properties.sonarServer);

        this.isLoadingMetrics = true;
        return this.sonarSummaryService.fetchMetrics(configurationId)
            .then(sonarMetrics => {
                this.availableMetrics = _.keys(sonarMetrics).reduce((availableMetrics, id) => {
                    availableMetrics.push({
                        id,
                        title: sonarMetrics[id].name,
                        sonarMetric: sonarMetrics[id]
                    });
                    return availableMetrics;
                }, []);
                this.hasSonarMetricsError = false;
            }).catch(() => {
                this.hasSonarMetricsError = true;
            }).finally(() => {
                this.isLoadingMetrics = false;
            });
    }

     getCurrentSonarServerName() {
        if (_.has(this.tile, 'properties.sonarServer') && this.sonarServers) {
            const currentSonarServer = this.sonarServers.find(s => s.id === this.tile.properties.sonarServer);
            return currentSonarServer ? currentSonarServer.title : '';
        }
    }
}

export const jenkinsCITileConfig = {
    bindings: {
        tile: '<',
        parent: '<'
    },
    controller: JenkinsCiTileConfigController,
    template
};
