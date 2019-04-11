/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import {jenkinsCITileView} from './components/tile-view/jenkinsci-test-results-summary-tile-view.component';
import {jenkinsCITileConfig} from './components/tile-config/jenkinsci-test-results-summary-tile-config.component';
import JenkinsCIService from './services/jenkinsci-test-results-summary.service';

angular.module('xlrelease.JenkinsTestResultsTile', [])
    .component('jenkinsCITileView', jenkinsCITileView)
    .component('jenkinsCITileConfig', jenkinsCITileConfig)
    .service('JenkinsCIService', JenkinsCIService);
