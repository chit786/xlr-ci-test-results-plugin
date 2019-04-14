/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import {jenkinsCiTileView} from './components/tile-view/jenkinsci-test-results-summary-tile-view.component';
import {jenkinsCiTileConfig} from './components/tile-config/jenkinsci-test-results-summary-tile-config.component';
import JenkinsCiService from './services/jenkinsci-test-results-summary.service';

angular.module('xlrelease.JenkinsTestResultsTile', [])
    .component('jenkinsCiTileView', jenkinsCiTileView)
    .component('jenkinsCiTileConfig', jenkinsCiTileConfig)
    .service('JenkinsCiService', JenkinsCiService);
