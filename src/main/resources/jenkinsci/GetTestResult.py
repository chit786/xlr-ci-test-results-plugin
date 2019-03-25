import sys, string, json, urllib
from jenkinsci import JenkinsciScript

if jenkinsciServer is None:
    print "No server provided."
    sys.exit(1)

resultSet = dict()

status = "| Metric         |      Count       |  \n"

status += "|--------------- |:----------------:| \n"

jenkinsciUrl = jenkinsciServer['url']

if jenkinsciUrl.endswith('/'):
    jenkinsciUrl = jenkinsciUrl[:len(jenkinsciUrl)-1]

buildNum = 'latest'

if buildId != buildNum:
    buildNum = buildId

if buildNum == 'latest':
    buildNum = 'lastCompletedBuild'

jenkinsci = JenkinsciScript(jenkinsciServer, username, password)

responseVal = jenkinsci.get_jenkinsci_results(urllib.quote(jobid), buildNum)

buildStatus = 'PASSED'

if responseVal['failCount'] > 0:
    buildStatus = 'FAILED'

for obj in responseVal['suites']:
    for case in obj['cases']:
        if case['status'] in ['REGRESSION', 'FAILED']:
            resultSet[obj['name']] = case['name']

testResults = resultSet

status += "|%s|%s| \n" % ('Passed', responseVal['passCount'])
status += "|%s|%s| \n" % ('Failed', responseVal['failCount'])
status += "|%s|%s| \n" % ('skipped', responseVal['skipCount'])

print status