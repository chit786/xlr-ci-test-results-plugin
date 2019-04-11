/*
 * Copyright (c) 2018. All rights reserved.
 *
 * This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
 */
export default class JenkinsCIService {

    static $inject = ['Backend', 'ConfigurationService'];

    constructor(Backend, ConfigurationService) {
        this.Backend = Backend;
        this.ConfigurationService = ConfigurationService;
    }

    fetchTileData(tileId, tileProperties) {
        return this.Backend.get(`tiles/${tileId}/data`, {...tileProperties, hideAlert: true});
    }

    fetchSonarServers() {
        return this.ConfigurationService.searchAllConfiguration('sonar.Server', null).then((data => data['sonar.Server']));
    }

    fetchMetrics(serverId) {
        return this.Backend.get('api/extension/sonar/metrics', {params: {serverId}, hideAlert: true}).then((resp) => {
            return _.get(resp, 'data.entity');
        });
    }
}
