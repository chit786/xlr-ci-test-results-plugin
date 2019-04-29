/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
import {jenkinsCiTileView} from './components/tile-view/jenkinsci-test-results-summary-tile-view.component';
import {jenkinsCiTileConfig} from './components/tile-config/jenkinsci-test-results-summary-tile-config.component';
import {jenkinsCiTileDetail} from './components/tile-detail/jenkinsci-test-results-summary-tile-detail.component';
import {jenkinsCiTileRow} from './components/tile-detail-row/jenkinsci-test-results-summary-tile-detail-row.component';
import {jenkinsCiTestDataButtonComponent, jenkinsCiTestDataComponent} from './components/tile-row-data/index'
import JenkinsCiService from './services/jenkinsci-test-results-summary.service';

angular.module('xlrelease.JenkinsTestResultsTile', [])
    .component('jenkinsCiTileView', jenkinsCiTileView)
    .component('jenkinsCiTileConfig', jenkinsCiTileConfig)
    .component('jenkinsCiTileDetail', jenkinsCiTileDetail)
    .component('jenkinsCiTileRow', jenkinsCiTileRow)
    .component('jenkinsCiTestDataComponent', jenkinsCiTestDataComponent)
    .component('jenkinsCiTestDataButtonComponent', jenkinsCiTestDataButtonComponent)
    .service('JenkinsCiService', JenkinsCiService);
