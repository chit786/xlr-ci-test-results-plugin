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

    fetchTileData(tileId, tileProperties) {
        return this.Backend.get(`tiles/${tileId}/data`, {...tileProperties, hideAlert: true});
    }

    fetchJenkinsServers() {
        return this.ConfigurationService.searchAllConfiguration('jenkinsci.Server', null).then((data => data['jenkinsci.Server']));
    }

    fetchMetrics(serverId) {
        return this.Backend.get('api/extension/jenkins/metrics', {params: {serverId}, hideAlert: true}).then((resp) => {
            return _.get(resp, 'data.entity');
        });
    }
}
