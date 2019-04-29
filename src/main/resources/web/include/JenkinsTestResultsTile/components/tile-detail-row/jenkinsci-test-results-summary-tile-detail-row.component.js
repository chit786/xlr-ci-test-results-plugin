import template from "./jenkinsci-test-results-summary-tile-detail-row.tpl.html";

import './jenkinsci-test-results-summary-tile-detail-row.less'

class JenkinsciTileRowController {
    toggleTestView() {
        this.showTestData = !this.showTestData;
    }
}

export const jenkinsCiTileRow = {
    bindings: {
        testResult: '<',
        cssClass: '<'
    },
    controller: JenkinsciTileRowController,
    template
};
