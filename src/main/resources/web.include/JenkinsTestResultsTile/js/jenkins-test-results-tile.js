export const JenkinsTestResultsTileController = function ($scope, ConfigurationInstances, XlrTileHelper) {
    const vm = this;
    console.log($scope);
    if ($scope.xlrDashboard) {
        // summary page
        vm.release = $scope.xlrDashboard.release;
    } else {
        // details page
        vm.release = $scope.xlrTileDetailsCtrl.release;
    }

    loadJenkinsServers().then(function (jenkinsServers) {
        vm.allJenkinsBuilds = getAllJenkinsBuilds(vm.release, jenkinsServers);
        vm.counts = XlrTileHelper.countTasksByStatus(vm.allJenkinsBuilds);
        vm.totalCount = vm.allJenkinsBuilds.length;
        // vm.gridOptions = getGridOptions(vm.allJenkinsBuilds);

        vm.chartOptions = XlrTileHelper.getChartOptions({
            label: 'Build',
            total: vm.totalCount
        });
    });

    ///

    function getAllJenkinsBuilds(release, jenkinsServers) {
        return _(ReleasesService.getLeafTasks(release))
            .filter({scriptDefinitionType: "jenkins.Build"})
            .map(function (task) {
                return {
                    taskName: task.title,
                    taskStatus: task.status,
                    taskStatusCategory: XlrTileHelper.getCategoryByTaskStatus(task.status),
                    buildNumber: task.outputProperties['buildNumber'].value,
                    buildStatus: task.outputProperties['buildStatus'].value,
                    buildUrl: getBuildUrl(
                        jenkinsServers,
                        task.inputProperties.jenkinsServer,
                        task.inputProperties.jobName,
                        task.outputProperties['buildNumber'].value)
                };
            })
            .value();
    }

    function getGridOptions(jenkinsBuilds) {
        const columnDefs = [
            {
                displayName: "Task name",
                field: "taskName",
                cellTemplate: "static/@project.version@/include/JenkinsBuildsTile/grid/build-name-cell-template.html",
                filterHeaderTemplate: "<div data-ng-include=\"'static/@project.version@/include/JenkinsBuildsTile/grid/filter-template.html'\"></div>",
                enableColumnMenu: false,
                width: '40%'
            },
            {
                displayName: "Build number",
                field: "buildNumber",
                cellTemplate: "static/@project.version@/include/JenkinsBuildsTile/grid/build-number-cell-template.html",
                filterHeaderTemplate: "<div data-ng-include=\"'static/@project.version@/include/JenkinsBuildsTile/grid/filter-template.html'\"></div>",
                enableColumnMenu: false,
                width: '20%'
            },
            {
                displayName: "Build status",
                field: "taskStatusCategory",
                cellTemplate: "static/@project.version@/include/JenkinsBuildsTile/grid/build-status-cell-template.html",
                filterHeaderTemplate: "<div data-ng-include=\"'static/@project.version@/include/JenkinsBuildsTile/grid/filter-template.html'\"></div>",
                enableColumnMenu: false,
                width: '39%'
            }
        ];

        return XlrTileHelper.getGridOptions(jenkinsBuilds, columnDefs);
    }

    function loadJenkinsServers() {
        $scope.$on('$destroy', function () {
            ConfigurationInstances.reset();
        });

        return ConfigurationInstances.load().then(function () {
            const servers = ConfigurationInstances.getInstancesByType('jenkinsci.Server');
            const serverIdToUrl = {};
            _.forEach(servers, function (server) {
                const id = server.id;
                const url = server.properties ? server.properties.url : server.url;
                if (url) {
                    serverIdToUrl[id] = url;
                }
            });
            return serverIdToUrl;
        });
    }

    function getBuildUrl(jenkinsServers, serverId, jobName, buildNumber) {
        if (!buildNumber) {
            return undefined;
        }
        const jenkinsUrl = jenkinsServers[serverId];
        if (jenkinsUrl && jobName) {
            const jobContext = '/job/' + encodeURI(jobName) + '/';
            return jenkinsUrl + jobContext + buildNumber;
        }
        return undefined;
    }

};
