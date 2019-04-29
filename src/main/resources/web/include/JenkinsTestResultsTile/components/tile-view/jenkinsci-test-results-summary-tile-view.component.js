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

        this.predefinedColors = {};
        this.predefinedColors.PASSED = '#45BF55';
        this.predefinedColors.FAILED = '#8E2800';
        this.predefinedColors.SKIPPED = '#7E827A';

        this.colorPool = [
            '#45BF55',
            '#8E2800',
            '#7E827A'
        ];

        const mapSeries = data => {
            const series = {
                name: 'Status',
                data: []
            };
            series.data = _.map(data.data, value => ({y: value.counter, name: value.status, color: value.color}));
            return [series];
        };

        this.chartOptions = {
            topTitleText: data => data.total,
            bottomTitleText: 'tests',
            series: mapSeries,
            showLegend: false,
            donutThickness: '80%'
        };
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
        this.loading = true;
        let configurationId = this.Ids.toConfigurationId(this.tile.properties.jenkinsciServer);
        let buildId = this.tile.properties.buildId;
        let jobid = this.tile.properties.jobid;
        let username = this.tile.properties.username;
        let password = this.tile.properties.password;

        this.JenkinsCIService.fetchTileData(configurationId, buildId, jobid, username, password)
            .then((response) => {
                this.mapResponseToUi(response);
                const jenkinsData = response;
                this.result = jenkinsData;
                this.loader.loaded(jenkinsData);
                this.loader.endLoading();
                this.loading = false;
            })
            .catch((response) => {
                this.loader.failLoading(this.transformErrorsToTileError(response));
            });
    }

    getColor(value) {
        if (this.predefinedColors[value]) return this.predefinedColors[value];
        return this.colorPool.pop();
    }

    mapResponseToUi(response) {
        const IssueArray = [];
        const IssueArray_temp = [];
        // const issues = response.suites;
        const totalCount = response.passCount + response.failCount + response.skipCount;
        this.statuses = [];
        this.issuesSummaryData = {
            data: {
                PASSED : {
                    counter: response.passCount,
                    color: this.getColor('PASSED'),
                    status: 'PASSED'
                },
                FAILED : {
                    counter: response.failCount,
                    color: this.getColor('FAILED'),
                    status: 'FAILED'
                },
                SKIPPED : {
                    counter: response.skipCount,
                    color: this.getColor('SKIPPED'),
                    status: 'SKIPPED'
                }
            },
            total: totalCount
        };

        _.forEach(this.issuesSummaryData.data, value => {
                this.statuses.push(value);
            });
        //  TODO improve this 2 level for loop to reduce the javascript object from jenkins response
        // for(let issue in issues) {
        //     for(let _case in issue.cases) {
        //         console.log('adding item', _case);
        //         IssueArray_temp.push(_case);
        //     }
        // }
        //
        // console.log('mydata' + IssueArray_temp);

        // this.issuesSummaryData.data = _.reduce(IssueArray_temp, (result, value) => {
        //     const status = value.status;
        //     this.issuesSummaryData.total += 1;
        //     if (result[status]) {
        //         result[status].counter += 1;
        //     } else {
        //         result[status] = {
        //             counter: 1,
        //             color: this.getColor(status),
        //             status: status
        //         };
        //     }
        //     value.color = result[status].color;
        //     IssueArray.push(value);
        //     return result;
        // }, {});
        // _.forEach(this.issuesSummaryData.data, value => {
        //     this.statuses.push(value);
        // });
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
    controllerAs: "$ctrl",
    template
};
