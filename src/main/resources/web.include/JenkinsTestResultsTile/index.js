/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import {sonarSummaryTileView} from './components/tile-view/jenkinsci-test-results-summary-tile-view.component';
import {sonarSummaryTileConfig} from './components/tile-config/jenkinsci-test-results-summary-tile-config.component';
import sonarSummaryService from './services/jenkinsci-test-results-summary.service';

angular.module('xlrelease.JenkinsTestResultsTile', [])
    .component('sonarSummaryTileConfig', sonarSummaryTileConfig)
    .component('sonarSummaryTileView', sonarSummaryTileView)
    .service('sonarSummaryService', sonarSummaryService);
