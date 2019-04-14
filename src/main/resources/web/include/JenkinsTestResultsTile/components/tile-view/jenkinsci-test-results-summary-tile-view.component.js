/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import './jenkinsci-test-results-summary-tile-view.less';

import template from './jenkinsci-test-results-summary-tile-view.tpl.html';

class JenkinsciTileViewController {

    static $inject = ['JenkinsCiService', 'ReportLoader', 'Report'];

    constructor(JenkinsCiService, ReportLoader, Report) {
        this.JenkinsCIService = JenkinsCiService;
        this.loader = new ReportLoader();
        this.report = new Report();
    }

    $onInit() {
        this.isConfigured = !!(this.tile.properties.jenkinsciServer
            && this.tile.properties.jobid
            && this.tile.properties.buildId);
            // && !_.isEmpty(this.tile.properties.metrics.value));

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

    transformErrorsToTileError(jenkinsErrors) {
        return {
            data: jenkinsErrors ? jenkinsErrors.map(e => e.msg).join('\n') : 'Unknown error'
        };
    }

    loadData() {
        this.loader.startLoading();
        this.JenkinsCIService.fetchTileData(this.tile.id, this.tile.properties)
            .then((response) => {
                const jenkinsData = response.data.data;
                if (jenkinsData.error) {
                    return this.loader.failLoading(this.transformErrorsToTileError(jenkinsData.error));
                }
                const analysis = _.chain(jenkinsData.analysis).keys()
                    .map(key => {
                        return {
                            key,
                            title: _.get(this.tile, `properties.metrics.value.${key}`),
                            ...jenkinsData.analysis[key]
                        };
                    }).value();
                this.result = {
                    ...jenkinsData,
                    analysis
                };
                this.loader.loaded(jenkinsData);
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

export const jenkinsCiTileView = {
    bindings: {
        tile: '<'
    },
    controller: JenkinsciTileViewController,
    template
};
