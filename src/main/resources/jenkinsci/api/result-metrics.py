
#
# Copyright (c) 2018. All rights reserved.
#
# This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
#

from jenkinsci import JenkinsciScript
from xlrelease.HttpRequest import HttpRequest
import json, urllib

jenkins_server = securityApi.decrypt(configurationApi.getConfiguration(request.query['serverId']))

params = {'url': jenkins_server.url, 'username': jenkins_server.username, 'password': jenkins_server.password,
          'proxyHost': jenkins_server.proxyHost, 'proxyPort': jenkins_server.proxyPort,
          'proxyUsername': jenkins_server.proxyUsername, 'proxyPassword': jenkins_server.proxyPassword}

buildId = request.query['buildId']
jobId = request.query['jobid']
http_request = HttpRequest(params)
jenkins_response = http_request.get('/job/' + jobId + '/' + buildId + '/testReport/api/json')

if jenkins_response.isSuccessful():
    json_data = json.loads(jenkins_response.getResponse())
    response.entity = json_data
else:
    error = json.loads(jenkins_response.getResponse())
    sys.exit(1)