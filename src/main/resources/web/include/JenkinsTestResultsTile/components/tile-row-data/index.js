import "./jenkinsci-test-result-button.less"
import "./jenkinsci-test-result-data.less"

import jenkinsCiTestDataButtonTemplate from './jenkinsci-test-result-button.tpl.html';
import jenkinsCiTestDataTemplate from './jenkinsci-test-result-data.tpl.html';


export const jenkinsCiTestDataComponent = {
    bindings: {
        show: '=',
        testResult: '<'
    },
    controller: () => {

    },
    template: jenkinsCiTestDataTemplate
};

export const jenkinsCiTestDataButtonComponent = {
    bindings: {
        active: '<'
    },
    controller: () => {
    },
    template: jenkinsCiTestDataButtonTemplate
};
