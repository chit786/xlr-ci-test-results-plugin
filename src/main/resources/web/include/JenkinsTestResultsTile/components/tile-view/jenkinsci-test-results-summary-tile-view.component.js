/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import './jenkinsci-test-results-summary-tile-view.less';

import template from './jenkinsci-test-results-summary-tile-view.tpl.html';

class JenkinsciTileViewController {

    static $inject = ['JenkinsCiService', 'ReportLoader', 'Report', 'Ids'];

    constructor(JenkinsCiService, ReportLoader, Report, Ids) {
        this.JenkinsCIService = JenkinsCiService;
        this.Ids= Ids;
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
        let configurationId = this.Ids.toConfigurationId(this.tile.properties.jenkinsciServer);
        let buildId = this.tile.properties.buildId;
        let jobid = this.tile.properties.jobid;
        let username = this.tile.properties.username;
        let password = this.tile.properties.password;

        this.JenkinsCIService.fetchTileData(configurationId, buildId, jobid, username, password)
            .then((response) => {
                console.log(response);
                const jenkinsData = response;
                this.result = jenkinsData;
                this.loader.loaded(jenkinsData);
                this.loader.endLoading();
            })
            .catch((response) => {
                this.loader.failLoading(this.transformErrorsToTileError(response));
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
