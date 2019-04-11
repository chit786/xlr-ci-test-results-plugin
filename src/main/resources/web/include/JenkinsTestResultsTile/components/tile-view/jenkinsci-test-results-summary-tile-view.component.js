/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import './jenkinsci-test-results-summary-tile-view.less';

import template from './jenkinsci-test-results-summary-tile-view.tpl.html';

class JenkinsciTileViewController {

    static $inject = ['JenkinsCIService', 'ReportLoader', 'Report'];

    constructor(JenkinsCIService, ReportLoader, Report) {
        this.sonarSummaryService = JenkinsCIService;
        this.loader = new ReportLoader();
        this.report = new Report();
    }

    $onInit() {
        this.isConfigured = !!(this.tile.properties.sonarServer
            && this.tile.properties.resource
            && !_.isEmpty(this.tile.properties.metrics.value));

        if (this.isConfigured) {
            this.report.add('data', this.loader);
            this.loadData();
        }
    }

    isContentLoaded() {
        return this.report.isConfigured()
            && !this.report.loading()
            && !this.report.isEmpty()
            && !this.report.hasError();
    }

    transformErrorsToTileError(sonarErrors) {
        return {
            data: sonarErrors ? sonarErrors.map(e => e.msg).join('\n') : 'Unknown error'
        };
    }

    loadData() {
        this.loader.startLoading();
        this.sonarSummaryService.fetchTileData(this.tile.id, this.tile.properties)
            .then((response) => {
                const sonarData = response.data.data;
                if (sonarData.error) {
                    return this.loader.failLoading(this.transformErrorsToTileError(sonarData.error));
                }
                const analysis = _.chain(sonarData.analysis).keys()
                    .map(key => {
                        return {
                            key,
                            title: _.get(this.tile, `properties.metrics.value.${key}`),
                            ...sonarData.analysis[key]
                        };
                    }).value();
                this.result = {
                    ...sonarData,
                    analysis
                };
                this.loader.loaded(sonarData);
                this.loader.endLoading();
            })
            .catch((response) => {
                this.loader.failLoading(this.transformErrorsToTileError(response.error));
            });
    }

    parseJSON(json) {
        return JSON.parse(json);
    }

    getMetricTitle(metricKey) {
        return _.startCase(metricKey)
    }
}

export const jenkinsCITileView = {
    bindings: {
        tile: '<'
    },
    controller: JenkinsciTileViewController,
    template
};
