/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import template from './jenkinsc-test-results-tile-config.tpl.html';


class JenkinsCiTileConfigController {

    static $inject = ['JenkinsCiService', 'Ids', '$q', '$timeout'];

    constructor(JenkinsCiService, Ids, $q, $timeout) {
        this.JenkinsCIService = JenkinsCiService;
        this.Ids = Ids;
        this.$q = $q;
        this.$timeout = $timeout;
        //
        // this.metricsHandlers = {
        //     addCandidates: this.getMetricsByOptions.bind(this)
        // };

        this.onBeforeSaveListener = this.beforeSave.bind(this);
    }

    $onInit() {
        this.parent.registerSaveListener(this.onBeforeSaveListener);

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
        // tile.properties.metrics = _.reduce(this.metrics, (tileMetrics, metric) => {
        //     tileMetrics.value[metric.id] = metric.title;
        //     return tileMetrics;
        // }, {value: {}, variable: null});
    }

    refreshSonarServers() {
        this.JenkinsCIService.fetchJenkinsServers().then((jenkinsServers) => {
            this.jenkinsServers = jenkinsServers.map((jenkinsServer) => {
                return {
                    ...jenkinsServer,
                    id: this.Ids.getName(jenkinsServer.id),
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
        return this.JenkinsCIService.fetchMetrics(configurationId)
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

     getCurrentJenkinsServerName() {
        if (_.has(this.tile, 'properties.jenkinsciServer') && this.jenkinsServers) {
            const currentJenkinsServer = this.jenkinsServers.find(s => s.id === this.tile.properties.jenkinsciServer);
            return currentJenkinsServer ? currentJenkinsServer.title : '';
        }
    }
}

export const jenkinsCiTileConfig = {
    bindings: {
        tile: '<',
        parent: '<'
    },
    controller: JenkinsCiTileConfigController,
    template
};
