import "./JenkinsTestResultsTile/css/jenkins-test-results-tile.css";
import {JenkinsTestResultsTileController} from "./JenkinsTestResultsTile/js/jenkins-test-results-tile";

JenkinsTestResultsTileController.$inject = ['$scope', 'ConfigurationInstances', 'XlrTileHelper'];
angular.module('xlrelease').controller('summary.JenkinsTestResultsTileController', JenkinsTestResultsTileController);