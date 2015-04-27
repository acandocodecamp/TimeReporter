(function (angular) {

    var app = angular.module('app', ['ngRoute']);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
          when('/MyReports', {
              templateUrl: 'MyReports.html',
              controller: 'MyReportsController'
          }).
          when('/', {
              templateUrl: 'ReportTime.html',
              controller: 'ReportTimeController'
          }).
          otherwise({
              redirectTo: '/'
          });
    }]);

})(window.angular);