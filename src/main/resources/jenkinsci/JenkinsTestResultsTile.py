#
# Copyright (c) 2018. All rights reserved.
#
# This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
#

import json
from xlrelease.HttpRequest import HttpRequest
import org.apache.http.conn.HttpHostConnectException

if not jenkinsciServer:
    raise Exception("jenkins server ID must be provided")

try:
    jenkins_url = jenkinsciServer['url']
    http_request = HttpRequest(jenkinsciServer)
    jennkins_test_result_url = '/job/' + jobid + '/' + buildId + '/testReport/api/json'
    jenkins_response = http_request.get(jennkins_test_result_url)
    if jenkins_response.isSuccessful():
        json_data = json.loads(jenkins_response.getResponse())

        data = json_data
    else:
        error = json.loads(jenkins_response.getResponse())
        print error
        data = {'error': error['errors']}
except org.apache.http.conn.HttpHostConnectException as e:
    print "Connection Failed : {0} ".format(str(e))
    data = {'error': [{'msg': e.getMessage()}]}
except Exception as exception:
    data = {'error': exception.message}
