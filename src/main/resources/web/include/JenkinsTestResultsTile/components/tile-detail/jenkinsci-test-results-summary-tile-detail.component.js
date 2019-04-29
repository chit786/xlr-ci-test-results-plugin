/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import './jenkinsci-test-results-summary-tile-detail.less'

import template from './jenkinsci-test-results-summary-tile-detail.tpl.html';

class JenkinsciTileDetailController {

    static $inject = ['JenkinsCiService', 'Ids'];

    constructor(JenkinsCiService, Ids) {
        this.JenkinsCiService = JenkinsCiService;
        this.Ids = Ids;
    }

    $onInit() {
        this.result = [];
        this.loading = false;
        this.isConfigured = !!(this.tile.properties.jenkinsciServer
            && this.tile.properties.jobid
            && this.tile.properties.buildId);
        // && !_.isEmpty(this.tile.properties.metrics.value));
        if (this.isConfigured) {
            this.loadData();
        }
    }

    loadData() {
        const configurationId = this.Ids.toConfigurationId(this.tile.properties.jenkinsciServer);
        const buildId = this.tile.properties.buildId;
        const jobid = this.tile.properties.jobid;
        const username = this.tile.properties.username;
        const password = this.tile.properties.password;

        this.loading = true;
        this.JenkinsCiService.fetchTileData(configurationId, buildId, jobid, username, password)
            .then((response) => {
                const jenkinsTestResult = response;
                this.result = jenkinsTestResult['suites'];
                this.loading = false;
            })
            .catch((response) => {
                this.loading = false;
                console.log(response);
            });
    }

}

export const jenkinsCiTileDetail = {
    bindings: {
        tile: '<'
    },
    controller: JenkinsciTileDetailController,
    template: template
};
