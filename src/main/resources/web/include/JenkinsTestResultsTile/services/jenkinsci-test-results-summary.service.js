/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
export default class JenkinsCiService {

    static $inject = ['Backend', 'ConfigurationService'];

    constructor(Backend, ConfigurationService) {
        this.Backend = Backend;
        this.ConfigurationService = ConfigurationService;
    }

    fetchJenkinsServers() {
        return this.ConfigurationService.searchAllConfiguration('jenkinsci.Server', null).then((data => data['jenkinsci.Server']));
    }

    fetchTileData(serverId, buildId, jobid, uName, pass) {
        console.log(serverId);
        return this.Backend.get(`api/extension/jenkins/metrics`, {params: {serverId, buildId, jobid, ...uName, ...pass}, hideAlert: true}).then((resp) => {
            // console.log('log', _.get(resp, 'data.entity'));
            return _.get(resp, 'data.entity');
        });
    }
}
