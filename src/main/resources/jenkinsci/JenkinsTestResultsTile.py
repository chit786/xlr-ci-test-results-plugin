#
# Copyright (c) 2018. All rights reserved.
#
# This software and all trademarks, trade names, and logos included herein are the property of XebiaLabs, Inc. and its affiliates, subsidiaries, and licensors.
#

import json
from xlrelease.HttpRequest import HttpRequest
import org.apache.http.conn.HttpHostConnectException

if not sonarServer:
    raise Exception("Sonar server ID must be provided")

def get_sonar_metric_url(metric):
    return "{}/component_measures?id={}&metric={}&view=list".format(sonar_url, resource, metric)

def get_sonar_project_url():
    return "{}/dashboard?id={}".format(sonar_url, resource)

try:
    sonar_url = sonarServer['url']
    sonar_server_api_url = '/api/measures/component?componentKey=%s&metricKeys=%s' % (
        resource, ','.join(metrics.keys()))
    http_request = HttpRequest(sonarServer)
    sonar_response = http_request.get(sonar_server_api_url)
    if sonar_response.isSuccessful():
        json_data = json.loads(sonar_response.getResponse())
        component = json_data['component']

        analysis = {}
        for item in json_data['component']['measures']:
            metric_name = item['metric']
            if 'value' in item is not None:
                value = item['value']
            elif 'periods' in item is not None:
                first_period_value = item['periods'][0]['value']
                if float(first_period_value) == int(float(first_period_value)):
                    value = first_period_value
                else:
                    value = round(float(first_period_value), 2)
            else:
                value = "(Unknown)"
            analysis[metric_name] = {
                'value': value,
                'sonarMetricUrl': get_sonar_metric_url(metric_name)
            }
        data = {
            'id': component['id'],
            'key': json_data['component']['key'],
            'name': json_data['component']['name'],
            'sonarProjectUrl': get_sonar_project_url(),
            'analysisDate': '',
            'analysis': analysis
        }
    else:
        error = json.loads(sonar_response.getResponse())
        print error
        data = {'error': error['errors']}
except org.apache.http.conn.HttpHostConnectException as e:
    print "Connection Failed : {0} ".format(str(e))
    data = {'error': [{'msg': e.getMessage()}]}
except Exception as exception:
    data = {'error': exception.message}
