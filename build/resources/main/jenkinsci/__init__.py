
#
# Copyright (c) 2018. All rights reserved.
#
# This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
#

import com.xhaus.jyson.JysonCodec as Json
from xlrelease.HttpRequest import HttpRequest

class JenkinsciScript:

    def __init__(self, jenkins_ci_server, username, password, encoding='utf-8'):
        if jenkins_ci_server is None:
            error('No server provided.')

        self.jenkins_ci_server = jenkins_ci_server
        self.username = username
        self.password = password
        self.encoding = encoding

    def get_jenkinsci_results(self, jobid):
        buildNum = 'latest'
        if not jobid:
            error('No job id is provided.')

        if buildId != buildNum:
            buildNum = buildId

        testresulturl = '/job/' + jobid + '/' + buildNum + '/testReport/api/json'

        request = self._createRequest()
        jennkinsci_response = request.get(testresulturl, contentType='application/json')
        if jennkinsci_response.status == 200:
            data = Json.loads(jennkinsci_response.response)
        else:
            data = ''

        return data

    def _createRequest(self):
        return HttpRequest(self.jenkins_ci_server, self.username, self.password)